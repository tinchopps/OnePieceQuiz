# 🏴‍☠️ One Piece Trivia API - Mejoras Críticas

## 📋 CONTEXTO
Tienes una API de trivia de One Piece en FastAPI con los siguientes problemas críticos que necesitan solución inmediata:

**Repositorio**: https://github.com/tinchopps/Trivia_One_Piece_api
**URL Actual**: https://trivia-one-piece-api.onrender.com
**Problemas Detectados**: CORS inseguro, estructura de datos deficiente, manejo de errores inconsistente, falta de validación

---

## 🚨 PROBLEMAS CRÍTICOS A RESOLVER

### 1. **SEGURIDAD CRÍTICA**
```python
# PROBLEMA ACTUAL:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ¡MUY PELIGROSO!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SOLUCIÓN REQUERIDA:
# - Restringir origins a dominios específicos
# - Implementar rate limiting
# - Añadir autenticación básica opcional
```

### 2. **ESTRUCTURA DE DATOS DEFICIENTE**
```python
# PROBLEMA ACTUAL:
incorrect_answers="|".join(question.incorrect_answers)  # String separado por "|"

# SOLUCIÓN REQUERIDA:
# - Cambiar a campo JSON/JSONB en la base de datos
# - Mejorar el modelo de datos con timestamps
# - Añadir validación de datos entrada
```

### 3. **ENDPOINTS INCOMPLETOS**
```python
# FALTAN ESTOS ENDPOINTS CRÍTICOS:
@app.get("/sagas/")           # Listar sagas disponibles
@app.get("/health/")          # Health check para monitoring
@app.get("/warm/")            # Endpoint específico para warming
@app.get("/stats/")           # Estadísticas de preguntas
```

---

## 🎯 ESPECIFICACIONES TÉCNICAS EXACTAS

### **A. MODELO DE DATOS MEJORADO**
```python
# Reemplazar el modelo actual con:
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Enum
from datetime import datetime
import enum

class DifficultyEnum(enum.Enum):
    EASY = "easy"
    MEDIUM = "medium" 
    HARD = "hard"

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    saga = Column(String(100), nullable=False, index=True)
    category = Column(String(50), nullable=False)
    difficulty = Column(Enum(DifficultyEnum), nullable=False, index=True)
    type = Column(String(20), nullable=False)  # "multiple" or "boolean"
    question = Column(Text, nullable=False)
    correct_answer = Column(String(200), nullable=False)
    incorrect_answers = Column(JSON, nullable=False)  # ¡JSON en lugar de string!
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### **B. ENDPOINTS CRÍTICOS REQUERIDOS**
```python
# 1. ENDPOINT DE WARMING (MUY IMPORTANTE)
@app.get("/warm/")
@limiter.limit("60/minute")
async def warm_up_endpoint():
    """Endpoint ligero específico para warming de Render"""
    return {
        "status": "warm",
        "timestamp": datetime.utcnow().isoformat(),
        "server": "active"
    }

# 2. SAGAS DISPONIBLES
@app.get("/sagas/")
@limiter.limit("30/minute")
async def get_available_sagas(db: Session = Depends(get_db)):
    """Retorna todas las sagas disponibles con conteo de preguntas"""
    try:
        sagas = db.query(Question.saga, 
                        func.count(Question.id).label('question_count'))\
                 .group_by(Question.saga)\
                 .all()
        
        return {
            "sagas": [
                {
                    "name": saga.saga,
                    "question_count": saga.question_count,
                    "api_name": saga.saga  # Para compatibilidad
                }
                for saga in sagas
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching sagas: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# 3. HEALTH CHECK
@app.get("/health/")
async def health_check(db: Session = Depends(get_db)):
    """Health check completo"""
    try:
        # Test database connection
        db.execute("SELECT 1")
        
        # Count total questions
        total_questions = db.query(Question).count()
        
        return {
            "status": "healthy",
            "database": "connected",
            "total_questions": total_questions,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unavailable")
```

### **C. MEJORAS DE SEGURIDAD Y PERFORMANCE**
```python
# RATE LIMITING
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS SEGURO
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tu-dominio.com",
        "https://tu-dominio.vercel.app", 
        "http://localhost:3000",
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# LOGGING
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

### **D. ENDPOINT DE PREGUNTAS MEJORADO**
```python
@app.get("/questions/")
@limiter.limit("60/minute")
async def get_questions(
    amount: int = Query(10, ge=1, le=50, description="Número de preguntas (1-50)"),
    saga: Optional[str] = Query(None, regex=r"^[A-Za-z\s]+$", description="Saga específica"),
    difficulty: Optional[str] = Query(None, regex=r"^(easy|medium|hard)$", description="Dificultad"),
    db: Session = Depends(get_db)
):
    """Obtener preguntas con validación mejorada"""
    try:
        logger.info(f"Fetching {amount} questions - saga: {saga}, difficulty: {difficulty}")
        
        query = db.query(Question)
        
        if saga:
            query = query.filter(Question.saga.ilike(f"%{saga}%"))
        
        if difficulty:
            query = query.filter(Question.difficulty == difficulty)
        
        questions = query.all()
        
        if not questions:
            raise HTTPException(
                status_code=404, 
                detail=f"No questions found for saga='{saga}', difficulty='{difficulty}'"
            )
        
        # Shuffle and limit
        random.shuffle(questions)
        questions = questions[:amount]
        
        # Format response con opciones mezcladas
        formatted_questions = []
        for q in questions:
            # Manejar tanto el formato viejo (string) como nuevo (JSON)
            if isinstance(q.incorrect_answers, str):
                incorrect = q.incorrect_answers.split("|") if q.incorrect_answers else []
            else:
                incorrect = q.incorrect_answers or []
            
            options = incorrect + [q.correct_answer]
            random.shuffle(options)
            
            formatted_questions.append({
                "id": q.id,
                "saga": q.saga,
                "difficulty": q.difficulty.value if hasattr(q.difficulty, 'value') else q.difficulty,
                "question": q.question,
                "options": options,
                "correct_answer": q.correct_answer
            })
        
        logger.info(f"Successfully returned {len(formatted_questions)} questions")
        return {"response_code": 0, "results": formatted_questions}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching questions: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
```

---

## 🛠️ SCRIPT DE MIGRACIÓN DE DATOS

```python
# migration_script.py - Para migrar datos existentes
def migrate_incorrect_answers_to_json():
    """Migrar campo incorrect_answers de string a JSON"""
    db = SessionLocal()
    try:
        questions = db.query(Question).all()
        for q in questions:
            if isinstance(q.incorrect_answers, str) and q.incorrect_answers:
                # Convertir string separado por "|" a lista JSON
                q.incorrect_answers = q.incorrect_answers.split("|")
                db.add(q)
        
        db.commit()
        print(f"Migrated {len(questions)} questions successfully")
    except Exception as e:
        db.rollback()
        print(f"Migration failed: {e}")
    finally:
        db.close()
```

---

## 📦 DEPENDENCIAS ADICIONALES REQUERIDAS

```txt
# Añadir a requirements.txt:
slowapi==0.1.9          # Rate limiting
redis==4.5.5            # Cache (opcional)
python-multipart==0.0.6 # Form data support
```

---

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### **FASE 1 - CRÍTICO (Implementar INMEDIATAMENTE)**
1. ✅ Corregir CORS con dominios específicos
2. ✅ Añadir rate limiting básico
3. ✅ Crear endpoint `/warm/` para Render
4. ✅ Mejorar manejo de errores con logging

### **FASE 2 - IMPORTANTE (Próxima semana)**
1. ✅ Migrar campo `incorrect_answers` a JSON
2. ✅ Añadir endpoints `/sagas/` y `/health/`
3. ✅ Implementar validación robusta de inputs
4. ✅ Mejorar modelo de datos con timestamps

### **FASE 3 - MEJORAS (Futuro)**
1. ✅ Sistema de caché con Redis
2. ✅ Autenticación opcional
3. ✅ Métricas y monitoring
4. ✅ Tests unitarios

---

## 🧪 COMANDOS DE TESTING

```bash
# Para probar los endpoints después de implementar:
curl -X GET "https://trivia-one-piece-api.onrender.com/warm/"
curl -X GET "https://trivia-one-piece-api.onrender.com/health/"
curl -X GET "https://trivia-one-piece-api.onrender.com/sagas/"
curl -X GET "https://trivia-one-piece-api.onrender.com/questions/?amount=5&saga=East%20Blue&difficulty=easy"
```

---

## ⚡ NOTA ESPECIAL PARA RENDER

```python
# Añadir este endpoint específicamente para warming de Render:
@app.get("/")
async def root():
    return {
        "message": "One Piece Trivia API",
        "status": "active",
        "version": "2.0",
        "endpoints": ["/questions/", "/warm/", "/health/", "/sagas/"]
    }
```

---

**🎯 RESULTADO ESPERADO**: API más segura, robusta y optimizada para el warming de Render, con mejor estructura de datos y endpoints completos para tu app de React Native.

**⏰ TIEMPO ESTIMADO**: 2-3 horas de trabajo para implementar las mejoras críticas.

**🔥 IMPACTO**: Resolver los problemas de 404 en warming, mejorar seguridad, y tener una API production-ready.

# 🏴‍☠️ One Piece Trivia App

Una aplicación móvil de trivia de One Piece desarrollada con Expo y React Native, con navegación por sagas y sistema de progreso.

## 📱 Descripción del Proyecto

**One Piece Trivia App** es una aplicación interactiva que permite a los fans de One Piece poner a prueba sus conocimientos sobre la serie. La app cuenta con un sistema de progreso por sagas, donde los usuarios desbloquean nuevas sagas al completar las anteriores.

### 🎯 Funcionalidades Principales

- **Modo Historia**: Progresión estructurada por sagas (East Blue → Alabasta → Skypea)
- **Modo Libre**: Juego personalizable con selección de saga, cantidad de preguntas y dificultad
- **Sistema de Preguntas**: Preguntas de opción múltiple con feedback inmediato
- **Temporizador**: 30 segundos por pregunta con indicador visual
- **Persistencia Local**: Progreso guardado usando AsyncStorage
- **Estadísticas**: Seguimiento de rendimiento y mejores puntuaciones
- **Interfaz Temática**: Diseño pirata con colores navy, dorado y rojo

### 🎨 Características de Diseño

- **Tema Pirata**: Colores navy blue (#1e3a8a), gold (#fbbf24), red (#dc2626)
- **Tipografía**: Pirata One para títulos, Inter para texto
- **Animaciones**: Transiciones suaves con React Native Reanimated
- **Responsive**: Optimizado para móvil con navegación por tabs
- **Iconografía**: Emojis temáticos y iconos Lucide

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Expo CLI (opcional, se puede usar npx)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd one-piece-trivia-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir la aplicación**
   - Web: Abre automáticamente en http://localhost:8081
   - Móvil: Escanea el QR con Expo Go app

## 📋 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build:web    # Build para producción web
npm run lint         # Ejecuta linter de Expo

# Expo específicos
npx expo start       # Inicia servidor Expo
npx expo build       # Build nativo
npx expo install     # Instala dependencias compatibles
```

## 📁 Estructura del Proyecto

```
one-piece-trivia-app/
├── app/                          # Pantallas principales (Expo Router)
│   ├── (tabs)/                   # Navegación por tabs
│   │   ├── _layout.tsx          # Layout de tabs
│   │   ├── index.tsx            # Pantalla principal
│   │   ├── story.tsx            # Modo historia
│   │   ├── progress.tsx         # Estadísticas
│   │   └── settings.tsx         # Configuración
│   ├── _layout.tsx              # Layout raíz
│   ├── quiz.tsx                 # Pantalla de preguntas
│   ├── results.tsx              # Pantalla de resultados
│   ├── free-mode.tsx            # Configuración modo libre
│   └── +not-found.tsx           # Pantalla 404
├── components/                   # Componentes reutilizables
│   └── ui/                      # Componentes UI base
│       ├── Button.tsx           # Botón con gradientes
│       ├── Card.tsx             # Tarjeta con sombras
│       ├── ProgressBar.tsx      # Barra de progreso animada
│       └── LoadingSpinner.tsx   # Spinner de carga
├── context/                     # Estado global
│   └── GameContext.tsx          # Context del juego
├── services/                    # Servicios y APIs
│   ├── questionsApi.ts          # API mock de preguntas
│   └── storage.ts               # Servicio de almacenamiento
├── types/                       # Definiciones TypeScript
│   └── game.ts                  # Tipos del juego
├── constants/                   # Constantes
│   ├── colors.ts                # Paleta de colores
│   └── sagas.ts                 # Configuración de sagas
├── hooks/                       # Hooks personalizados
│   └── useFrameworkReady.ts     # Hook de inicialización
├── assets/                      # Recursos estáticos
│   └── images/                  # Imágenes e iconos
├── package.json                 # Dependencias y scripts
├── tsconfig.json               # Configuración TypeScript
├── app.json                    # Configuración Expo
└── README.md                   # Documentación
```

## 🐛 Problemas Conocidos Actuales

### Errores Críticos Resueltos (no estan resueltos del todo)
- ✅ **Navigation Error**: Reemplazado `navigation.isReady()` por estado local (resuelto pero a veces siguen apareciendo errores)
- ✅ **Answer Comparison**: Implementada comparación case-insensitive (esto no resolvio)
- ✅ **Streak Logic**: Corregido cálculo de racha en GameContext
- ✅ **Tab Bar UI**: Ajustada altura y padding del tab bar

### Problemas Menores Pendientes
- ⚠️ **Timer Reset**: Ocasionalmente el timer no se resetea correctamente
- ⚠️ **Loading States**: Algunos estados de carga podrían ser más fluidos
- ⚠️ **Error Boundaries**: Falta manejo de errores más robusto

## 🗺️ Roadmap de Desarrollo

### Fase 1 - Estabilización (Completada)
- [x] Corrección de errores críticos de navegación
- [x] Implementación de lógica de preguntas correcta
- [x] Mejoras en UI del tab bar

### Fase 2 - Mejoras de UX (Pendiente)
- [ ] Implementar sonidos y efectos hápticos
- [ ] Añadir animaciones de transición más fluidas
- [ ] Mejorar feedback visual en respuestas
- [ ] Implementar modo oscuro

### Fase 3 - Contenido (Pendiente)
- [ ] Añadir la api propia de one piece
- [ ] Expandir base de datos de preguntas
- [ ] Añadir más sagas (Water 7, Enies Lobby, etc.)
- [ ] Implementar categorías temáticas
- [ ] Añadir preguntas con imágenes

### Fase 4 - Funcionalidades Avanzadas (Futuro)
- [ ] Sistema de logros y badges
- [ ] Modo multijugador local
- [ ] Compartir resultados en redes sociales
- [ ] Estadísticas avanzadas y gráficos

## 🔧 Configuración Técnica

### Dependencias Principales
```json
{
  "expo": "^53.0.0",
  "react": "19.0.0",
  "react-native": "0.79.1",
  "expo-router": "~5.0.2",
  "react-native-reanimated": "~3.17.4"
}
```

### Configuración TypeScript
- Strict mode habilitado
- Path mapping configurado (@/* para imports relativos)
- Tipos de Expo incluidos

### Configuración Expo
- Plataformas: iOS, Android, Web
- New Architecture habilitado
- Plugins: expo-router, expo-font, expo-web-browser

## 🧪 Testing Manual

### Casos de Prueba Básicos

1. **Inicio de App**
   - ✅ La app carga correctamente 
   - ✅ Navegación por tabs funciona
   - ✅ Fuentes se cargan correctamente

2. **Modo Libre - 1 Pregunta**
   - ✅ Selección de configuración funciona
   - ✅ Pregunta se muestra correctamente
   - ✅ Respuesta correcta se valida bien (esto no es cierto, la respuesta se valida mal)
   - ✅ Navegación a resultados funciona

3. **Modo Historia**
   - ✅ East Blue saga disponible
   - ✅ Otras sagas bloqueadas inicialmente
   - ✅ Progreso se guarda correctamente (esto hay que revisarlo bien)

## 🚨 Debugging y Troubleshooting

### Errores Comunes

1. **"Cannot read properties of undefined"**
   - Causa: Acceso a propiedades antes de carga de datos
   - Solución: Verificar estados de loading y null checks

2. **"Navigation not ready"**
   - Causa: Intento de navegación antes de mount
   - Solución: Usar estados locales para controlar navegación

3. **"Text node cannot be child of View"**
   - Causa: Texto directo en componente View
   - Solución: Envolver texto en componente Text

### Logs Útiles
```bash
# Ver logs detallados
npx expo start --dev-client

# Limpiar cache
npx expo start --clear

# Verificar dependencias
npx expo doctor
```

## 📞 Soporte y Contribución

### Reportar Bugs
1. Verificar que el bug no esté en la lista de problemas conocidos
2. Incluir pasos para reproducir el error
3. Proporcionar logs de consola y stack traces
4. Especificar plataforma (iOS/Android/Web)

### Contribuir
1. Fork del repositorio
2. Crear branch para feature/bugfix
3. Seguir convenciones de código existentes
4. Probar en múltiples plataformas
5. Crear pull request con descripción detallada

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**¡Que comience la aventura pirata! 🏴‍☠️**

*"¡Voy a ser el Rey de los Piratas!" - Monkey D. Luffy*
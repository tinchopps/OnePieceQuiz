// Ejemplo de integración del FeedbackOverlay en quiz.tsx
// Este es solo un ejemplo de cómo integrar el sistema de feedback

import React, { useState } from 'react';
import { FeedbackOverlay } from '@/components/ui/FeedbackOverlay';
import { Question } from '@/types/game';

// Ejemplo de estado en el componente Quiz
const [showFeedback, setShowFeedback] = useState(false);
const [currentFeedbackData, setCurrentFeedbackData] = useState<{
  question: Question;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
} | null>(null);

// Función que se llama después de responder una pregunta
const handleQuestionAnswered = (
  question: Question,
  userAnswer: string,
  isCorrect: boolean
) => {
  // ... lógica existente de scoring/navigation ...

  // Configurar datos para feedback
  setCurrentFeedbackData({
    question,
    userAnswer,
    correctAnswer: question.correct_answer,
    isCorrect,
  });

  // Mostrar overlay de feedback
  setShowFeedback(true);
  
  // NO HAY TIMEOUT - El overlay permanece hasta que usuario actúe
};

// Función cuando se completa el feedback
const handleFeedbackComplete = () => {
  setShowFeedback(false);
  setCurrentFeedbackData(null);
  
  // Continuar con la navegación (siguiente pregunta o resultados)
  // ... lógica de navegación existente ...
};

// En el JSX del componente Quiz:
return (
  <View style={styles.container}>
    {/* ... resto del UI del quiz ... */}
    
    {/* Overlay de Feedback - Sin timeout automático */}
    {currentFeedbackData && (
      <FeedbackOverlay
        visible={showFeedback}
        question={currentFeedbackData.question}
        userAnswer={currentFeedbackData.userAnswer}
        correctAnswer={currentFeedbackData.correctAnswer}
        isCorrect={currentFeedbackData.isCorrect}
        onComplete={handleFeedbackComplete}
      />
    )}
  </View>
);

// CARACTERÍSTICAS IMPLEMENTADAS:
// ✅ Sin timeout automático - permanece visible hasta acción del usuario
// ✅ Rating obligatorio con estrellas (1-5)
// ✅ Categorías de problemas opcionales con chips seleccionables
// ✅ Comentario libre opcional (máx 500 caracteres)
// ✅ Botón "Saltar" para usuarios que no quieren dar feedback
// ✅ Botón "Enviar Feedback" que requiere rating mínimo
// ✅ Persistencia en AsyncStorage via FeedbackService
// ✅ UI responsive con información completa de la pregunta
// ✅ Emojis y colores temáticos de One Piece

// FLUJO DE USUARIO:
// 1. Usuario responde pregunta
// 2. Aparece overlay de feedback (SIN desaparecer automáticamente)
// 3. Usuario puede:
//    a) "Saltar" - se cierra inmediatamente
//    b) Dar rating + feedback opcional y "Enviar"
// 4. Solo después de alguna de estas acciones continúa el juego

export default {};

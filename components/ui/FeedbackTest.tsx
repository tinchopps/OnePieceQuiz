import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FeedbackOverlay } from '@/components/ui/FeedbackOverlay';
import { SimpleFeedback } from '@/components/ui/SimpleFeedback';
import { SimpleFeedbackOverlay } from '@/components/ui/SimpleFeedbackOverlay';
import { Question } from '@/types/game';

export const FeedbackTest: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSimple, setShowSimple] = useState(false);
  const [showSimpleFeedback, setShowSimpleFeedback] = useState(false);

  // Pregunta de prueba
  const testQuestion: Question = {
    id: 999,
    saga: 'east-blue',
    difficulty: 'easy',
    question: '¿Esta es una pregunta de prueba para el feedback?',
    options: ['Sí', 'No', 'Tal vez', 'No sé'],
    correct_answer: 'Sí'
  };

  const handleShowFeedback = () => {
    console.log('🧪 Mostrando feedback completo');
    setShowFeedback(true);
  };

  const handleShowSimple = () => {
    console.log('🧪 Mostrando modal simple');
    setShowSimple(true);
  };

  const handleShowSimpleFeedback = () => {
    console.log('🧪 Mostrando feedback simple');
    setShowSimpleFeedback(true);
  };

  const handleFeedbackComplete = () => {
    console.log('✅ Feedback completo completado');
    setShowFeedback(false);
  };

  const handleSimpleComplete = () => {
    console.log('✅ Modal simple completado');
    setShowSimple(false);
  };

  const handleSimpleFeedbackComplete = () => {
    console.log('✅ Feedback simple completado');
    setShowSimpleFeedback(false);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleShowSimple}
        >
          <Text style={styles.buttonText}>1. Test Modal Básico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondButton]}
          onPress={handleShowSimpleFeedback}
        >
          <Text style={styles.buttonText}>2. Test Feedback Simple</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.thirdButton]}
          onPress={handleShowFeedback}
        >
          <Text style={styles.buttonText}>3. Test Feedback Completo</Text>
        </TouchableOpacity>

        <Text style={styles.status}>
          Modal: {showSimple ? 'VISIBLE' : 'OCULTO'}
        </Text>
        <Text style={styles.status}>
          Simple: {showSimpleFeedback ? 'VISIBLE' : 'OCULTO'}
        </Text>
        <Text style={styles.status}>
          Completo: {showFeedback ? 'VISIBLE' : 'OCULTO'}
        </Text>
      </View>

      <SimpleFeedback
        visible={showSimple}
        onComplete={handleSimpleComplete}
      />

      <SimpleFeedbackOverlay
        visible={showSimpleFeedback}
        question={testQuestion}
        userAnswer="No sé"
        correctAnswer="Sí"
        isCorrect={false}
        onComplete={handleSimpleFeedbackComplete}
      />

      <FeedbackOverlay
        visible={showFeedback}
        question={testQuestion}
        userAnswer="No sé"
        correctAnswer="Sí"
        isCorrect={false}
        onComplete={handleFeedbackComplete}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  secondButton: {
    backgroundColor: '#dc2626',
  },
  thirdButton: {
    backgroundColor: '#059669',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 3,
    textAlign: 'center',
  },
});

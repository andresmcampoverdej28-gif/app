// lib/ui/useSwipeLogic.ts
import { useState, useCallback } from 'react';
import { type Profile } from '@/components/molecules';

export interface SwipeState {
  // Índice del perfil actual
  currentIndex: number;
  
  // Lista de perfiles con los que hubo match
  matches: Profile[];
  
  // Lista de perfiles rechazados
  passed: Profile[];
  
  // Si ya no hay más perfiles
  hasMoreProfiles: boolean;
  
  // Total de swipes realizados
  totalSwipes: number;
}

export interface SwipeActions {
  // Hacer swipe en una dirección
  swipe: (direction: 'left' | 'right') => void;
  
  // Like directo (botón)
  like: () => void;
  
  // Pass directo (botón)
  pass: () => void;
  
  // Super like (guarda en matches con flag especial)
  superLike: () => void;
  
  // Reiniciar el stack de perfiles
  reset: () => void;
  
  // Deshacer último swipe
  undo: () => void;
}

export const useSwipeLogic = (
  profiles: Profile[]
): SwipeState & SwipeActions => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [passed, setPassed] = useState<Profile[]>([]);
  const [swipeHistory, setSwipeHistory] = useState<{
    index: number;
    direction: 'left' | 'right';
  }[]>([]);

  const hasMoreProfiles = currentIndex < profiles.length;
  const totalSwipes = matches.length + passed.length;

  /**
   * Manejar swipe en cualquier dirección
   */
  const swipe = useCallback((direction: 'left' | 'right') => {
    if (!hasMoreProfiles) return;

    const currentProfile = profiles[currentIndex];
    
    // Guardar en historial para poder deshacer
    setSwipeHistory(prev => [...prev, { index: currentIndex, direction }]);

    // Si es swipe derecho (like)
    if (direction === 'right') {
      setMatches(prev => [...prev, currentProfile]);
      console.log('✅ Match con:', currentProfile.name);
    } else {
      // Si es swipe izquierdo (pass)
      setPassed(prev => [...prev, currentProfile]);
      console.log('❌ Pass a:', currentProfile.name);
    }

    // Avanzar al siguiente perfil
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, hasMoreProfiles, profiles]);

  /**
   * Like directo (desde botón)
   */
  const like = useCallback(() => {
    swipe('right');
  }, [swipe]);

  /**
   * Pass directo (desde botón)
   */
  const pass = useCallback(() => {
    swipe('left');
  }, [swipe]);

  /**
   * Super like - Like especial con mayor énfasis
   */
  const superLike = useCallback(() => {
    if (!hasMoreProfiles) return;

    const currentProfile = profiles[currentIndex];
    
    // Guardar en matches con log especial
    setMatches(prev => [...prev, currentProfile]);
    console.log('⭐ SUPER LIKE a:', currentProfile.name);
    
    // Avanzar
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, hasMoreProfiles, profiles]);

  /**
   * Reiniciar todo el proceso
   */
  const reset = useCallback(() => {
    setCurrentIndex(0);
    setMatches([]);
    setPassed([]);
    setSwipeHistory([]);
    console.log('🔄 Stack reiniciado');
  }, []);

  /**
   * Deshacer último swipe
   */
  const undo = useCallback(() => {
    if (swipeHistory.length === 0) return;

    const lastSwipe = swipeHistory[swipeHistory.length - 1];
    
    // Remover del historial
    setSwipeHistory(prev => prev.slice(0, -1));
    
    // Volver al índice anterior
    setCurrentIndex(lastSwipe.index);
    
    // Remover de matches o passed
    if (lastSwipe.direction === 'right') {
      setMatches(prev => prev.slice(0, -1));
    } else {
      setPassed(prev => prev.slice(0, -1));
    }
    
    console.log('↩️ Swipe deshecho');
  }, [swipeHistory]);

  return {
    // Estado
    currentIndex,
    matches,
    passed,
    hasMoreProfiles,
    totalSwipes,

    // Acciones
    swipe,
    like,
    pass,
    superLike,
    reset,
    undo,
  };
};
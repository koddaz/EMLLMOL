import { useCallback } from 'react';
import { runOnJS } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

export function useSwipeGesture(onSwipe: (direction: 'prev' | 'next') => void) {
  const handleSwipe = useCallback((direction: 'prev' | 'next') => {
    onSwipe(direction);
  }, [onSwipe]);

  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      
      // Reduced thresholds for faster response
      if (Math.abs(translationX) > 30 || Math.abs(velocityX) > 300) {
        if (translationX > 0) {
          // Swipe right = previous day
          runOnJS(handleSwipe)('prev');
        } else {
          // Swipe left = next day
          runOnJS(handleSwipe)('next');
        }
      }
    });

  return panGesture;
}
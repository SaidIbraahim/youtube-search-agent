import { useState, useEffect, useRef } from 'react';

interface UseTypingEffectOptions {
  text: string;
  speed?: number; // Characters per interval (higher = faster)
  enabled?: boolean; // Whether to enable typing effect
}

/**
 * Hook to create a typing effect for text display
 * @param text - The full text to display
 * @param speed - Typing speed (characters per interval, default: 3)
 * @param enabled - Whether typing effect is enabled (default: true)
 * @returns The current displayed text and whether typing is complete
 */
export function useTypingEffect({ 
  text, 
  speed = 3, 
  enabled = true 
}: UseTypingEffectOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    // Reset when text changes
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;

    const type = () => {
      if (indexRef.current < text.length) {
        // Calculate chunk size based on speed
        const chunk = text.slice(0, indexRef.current + speed);
        setDisplayedText(chunk);
        indexRef.current += speed;
        
        // Variable speed: faster for spaces and punctuation
        const currentChar = text[indexRef.current - 1];
        const delay = currentChar === ' ' || currentChar === '\n' ? 20 : 
                     currentChar === '.' || currentChar === '!' || currentChar === '?' ? 100 : 
                     30; // Base delay in ms
        
        timeoutRef.current = setTimeout(type, delay);
      } else {
        setDisplayedText(text);
        setIsComplete(true);
      }
    };

    // Start typing after a short delay
    timeoutRef.current = setTimeout(type, 50);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, enabled]);

  return { displayedText, isComplete };
}


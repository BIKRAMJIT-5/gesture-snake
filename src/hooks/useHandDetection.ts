import { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;

interface HandPosition {
  x: number;
  y: number;
}

interface UseHandDetectionReturn {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  direction: Direction;
  handPosition: HandPosition | null;
  landmarks: number[][] | null;
  startDetection: (videoElement: HTMLVideoElement) => void;
  stopDetection: () => void;
}

export function useHandDetection(): UseHandDetectionReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<Direction>(null);
  const [handPosition, setHandPosition] = useState<HandPosition | null>(null);
  const [landmarks, setLandmarks] = useState<number[][] | null>(null);

  const modelRef = useRef<handpose.HandPose | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousPositionRef = useRef<HandPosition | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load the model
  useEffect(() => {
    let mounted = true;

    async function loadModel() {
      try {
        setIsLoading(true);
        await tf.ready();
        const model = await handpose.load();
        
        if (mounted) {
          modelRef.current = model;
          setIsReady(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load hand detection model');
          setIsLoading(false);
        }
      }
    }

    loadModel();

    return () => {
      mounted = false;
    };
  }, []);

  const detectHand = useCallback(async () => {
    if (!modelRef.current || !videoRef.current) return;

    try {
      const predictions = await modelRef.current.estimateHands(videoRef.current);

      if (predictions.length > 0) {
        const hand = predictions[0];
        const indexFinger = hand.landmarks[8]; // Index finger tip
        const palm = hand.landmarks[0]; // Wrist/palm base
        
        const currentPosition: HandPosition = {
          x: indexFinger[0],
          y: indexFinger[1],
        };

        setHandPosition(currentPosition);
        setLandmarks(hand.landmarks);

        // Calculate direction based on palm position relative to center
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        
        const centerX = videoWidth / 2;
        const centerY = videoHeight / 2;
        
        const palmX = palm[0];
        const palmY = palm[1];
        
        const threshold = 60;
        const dx = palmX - centerX;
        const dy = palmY - centerY;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > threshold) {
            setDirection('LEFT'); // Mirrored for webcam
          } else if (dx < -threshold) {
            setDirection('RIGHT');
          }
        } else {
          if (dy > threshold) {
            setDirection('DOWN');
          } else if (dy < -threshold) {
            setDirection('UP');
          }
        }

        previousPositionRef.current = currentPosition;
      } else {
        setHandPosition(null);
        setLandmarks(null);
      }
    } catch (err) {
      console.error('Hand detection error:', err);
    }

    animationFrameRef.current = requestAnimationFrame(detectHand);
  }, []);

  const startDetection = useCallback((videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;
    detectHand();
  }, [detectHand]);

  const stopDetection = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return {
    isLoading,
    isReady,
    error,
    direction,
    handPosition,
    landmarks,
    startDetection,
    stopDetection,
  };
}

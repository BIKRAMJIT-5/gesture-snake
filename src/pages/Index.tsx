import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { WebcamView } from '@/components/WebcamView';
import { GameCanvas } from '@/components/GameCanvas';
import { GameUI } from '@/components/GameUI';
import { GestureGuide } from '@/components/GestureGuide';
import { useHandDetection } from '@/hooks/useHandDetection';
import { useSnakeGame } from '@/hooks/useSnakeGame';

const Index = () => {
  const {
    isLoading,
    isReady,
    error,
    direction,
    landmarks,
    startDetection,
    stopDetection,
  } = useHandDetection();

  const {
    snake,
    food,
    score,
    highScore,
    isGameOver,
    isPaused,
    isPlaying,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    setDirection,
    gridSize,
    cellCount,
  } = useSnakeGame();

  // Pass direction to game
  useEffect(() => {
    if (direction && isPlaying && !isPaused) {
      setDirection(direction);
    }
  }, [direction, isPlaying, isPaused, setDirection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Webcam */}
          <div className="space-y-4">
            <WebcamView
              isLoading={isLoading}
              isReady={isReady}
              error={error}
              direction={direction}
              landmarks={landmarks}
              onVideoReady={startDetection}
            />
            <GestureGuide currentDirection={direction} />
          </div>

          {/* Right Column - Game */}
          <div className="space-y-4">
            <div className="relative neon-border rounded-lg p-1 crt-effect">
              <GameCanvas
                snake={snake}
                food={food}
                gridSize={gridSize}
                cellCount={cellCount}
                isGameOver={isGameOver}
              />
              <div className="absolute inset-0 scanlines pointer-events-none rounded-lg" />
            </div>
            
            <GameUI
              score={score}
              highScore={highScore}
              isPlaying={isPlaying}
              isPaused={isPaused}
              isGameOver={isGameOver}
              onStart={startGame}
              onPause={pauseGame}
              onResume={resumeGame}
              onReset={resetGame}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground font-orbitron">
            POWERED BY TENSORFLOW.JS & MEDIAPIPE HANDPOSE
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary">COMPUTER VISION ACTIVE</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;

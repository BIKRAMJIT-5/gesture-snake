import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { WebcamView } from '@/components/WebcamView';
import { GameCanvas } from '@/components/GameCanvas';
import { GameUI } from '@/components/GameUI';
import { GestureGuide } from '@/components/GestureGuide';
import { TouchControls } from '@/components/TouchControls';
import { useHandDetection } from '@/hooks/useHandDetection';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  const [useTouchControls, setUseTouchControls] = useState(false);
  
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

  // Determine if touch controls should be shown
  useEffect(() => {
    // Show touch controls on mobile or when there's a webcam error
    if (isMobile || error) {
      setUseTouchControls(true);
    }
  }, [isMobile, error]);

  // Pass direction to game (from hand detection)
  useEffect(() => {
    if (direction && isPlaying && !isPaused && !useTouchControls) {
      setDirection(direction);
    }
  }, [direction, isPlaying, isPaused, setDirection, useTouchControls]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  // Handle touch control direction changes
  const handleTouchDirection = (dir: typeof direction) => {
    if (dir && isPlaying && !isPaused) {
      setDirection(dir);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Webcam or Touch Controls */}
          <div className="space-y-4">
            {!useTouchControls ? (
              <>
                <WebcamView
                  isLoading={isLoading}
                  isReady={isReady}
                  error={error}
                  direction={direction}
                  landmarks={landmarks}
                  onVideoReady={startDetection}
                />
                <GestureGuide currentDirection={direction} />
              </>
            ) : (
              <div className="bg-card/30 rounded-lg p-6 neon-border">
                <div className="flex flex-col items-center justify-center min-h-[300px] gap-6">
                  {error && (
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground font-orbitron mb-2">
                        WEBCAM UNAVAILABLE
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Using touch controls instead
                      </p>
                    </div>
                  )}
                  {isMobile && !error && (
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground font-orbitron mb-2">
                        MOBILE DEVICE DETECTED
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Use the buttons below to control the snake
                      </p>
                    </div>
                  )}
                  <TouchControls
                    onDirectionChange={handleTouchDirection}
                    disabled={!isPlaying || isPaused}
                  />
                </div>
                
                {/* Toggle button to switch to webcam on mobile if desired */}
                {isMobile && !error && (
                  <button
                    onClick={() => setUseTouchControls(false)}
                    className="mt-4 w-full text-xs text-primary/70 hover:text-primary font-orbitron transition-colors"
                  >
                    TRY WEBCAM CONTROLS INSTEAD
                  </button>
                )}
              </div>
            )}
            
            {/* Show toggle to go back to touch controls when using webcam on mobile */}
            {!useTouchControls && isMobile && (
              <button
                onClick={() => setUseTouchControls(true)}
                className="w-full text-xs text-primary/70 hover:text-primary font-orbitron transition-colors py-2"
              >
                SWITCH TO TOUCH CONTROLS
              </button>
            )}
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
            {useTouchControls 
              ? 'TOUCH CONTROLS ACTIVE' 
              : 'POWERED BY TENSORFLOW.JS & MEDIAPIPE HANDPOSE'
            }
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className={`w-2 h-2 rounded-full ${useTouchControls ? 'bg-secondary' : 'bg-primary'} animate-pulse`} />
            <span className="text-xs text-primary">
              {useTouchControls ? 'TOUCH MODE' : 'COMPUTER VISION ACTIVE'}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;

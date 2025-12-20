import React from 'react';
import { Play, Pause, RotateCcw, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameUIProps {
  score: number;
  highScore: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function GameUI({
  score,
  highScore,
  isPlaying,
  isPaused,
  isGameOver,
  onStart,
  onPause,
  onResume,
  onReset,
}: GameUIProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Score Display */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 bg-card/50 rounded-lg px-4 py-2 neon-border">
          <Zap className="w-5 h-5 text-neon-yellow" />
          <div>
            <p className="text-xs text-muted-foreground font-orbitron">SCORE</p>
            <p className="text-2xl font-arcade text-primary neon-text">{score.toString().padStart(5, '0')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-card/50 rounded-lg px-4 py-2">
          <Trophy className="w-5 h-5 text-neon-yellow" />
          <div>
            <p className="text-xs text-muted-foreground font-orbitron">HIGH SCORE</p>
            <p className="text-2xl font-arcade text-secondary neon-text-blue">{highScore.toString().padStart(5, '0')}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isPlaying && !isGameOver && (
          <Button
            onClick={onStart}
            className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron gap-2 shadow-neon-green transition-all hover:shadow-[0_0_20px_hsl(120_100%_50%_/_0.8)]"
          >
            <Play className="w-5 h-5" />
            START GAME
          </Button>
        )}

        {isPlaying && !isPaused && (
          <Button
            onClick={onPause}
            variant="secondary"
            className="flex-1 font-orbitron gap-2 shadow-neon-blue"
          >
            <Pause className="w-5 h-5" />
            PAUSE
          </Button>
        )}

        {isPlaying && isPaused && (
          <Button
            onClick={onResume}
            className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron gap-2 shadow-neon-green"
          >
            <Play className="w-5 h-5" />
            RESUME
          </Button>
        )}

        {isGameOver && (
          <Button
            onClick={onStart}
            className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron gap-2 shadow-neon-green animate-pulse"
          >
            <RotateCcw className="w-5 h-5" />
            PLAY AGAIN
          </Button>
        )}

        {(isPlaying || isGameOver) && (
          <Button
            onClick={onReset}
            variant="outline"
            className="font-orbitron gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Game Over Message */}
      {isGameOver && (
        <div className="text-center py-4 bg-card/50 rounded-lg border border-destructive/50">
          <p className="text-2xl font-arcade text-destructive animate-flicker mb-2">GAME OVER</p>
          <p className="text-sm text-muted-foreground font-orbitron">
            Final Score: <span className="text-primary">{score}</span>
          </p>
        </div>
      )}

      {/* Instructions */}
      {!isPlaying && !isGameOver && (
        <div className="text-center py-4 bg-card/50 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground font-orbitron mb-2">
            MOVE YOUR HAND TO CONTROL THE SNAKE
          </p>
          <div className="flex justify-center gap-4 text-xs text-primary">
            <span>↑ UP</span>
            <span>↓ DOWN</span>
            <span>← LEFT</span>
            <span>→ RIGHT</span>
          </div>
        </div>
      )}
    </div>
  );
}

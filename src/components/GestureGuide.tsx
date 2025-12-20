import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Hand } from 'lucide-react';
import { Direction } from '@/hooks/useHandDetection';

interface GestureGuideProps {
  currentDirection: Direction;
}

export function GestureGuide({ currentDirection }: GestureGuideProps) {
  const directions = [
    { key: 'UP', icon: ArrowUp, label: 'Move hand UP' },
    { key: 'DOWN', icon: ArrowDown, label: 'Move hand DOWN' },
    { key: 'LEFT', icon: ArrowLeft, label: 'Move hand LEFT' },
    { key: 'RIGHT', icon: ArrowRight, label: 'Move hand RIGHT' },
  ] as const;

  return (
    <div className="bg-card/30 rounded-lg p-4 border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Hand className="w-5 h-5 text-secondary" />
        <h3 className="font-orbitron text-sm text-secondary">GESTURE MAPPING</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {directions.map(({ key, icon: Icon, label }) => (
          <div
            key={key}
            className={`flex items-center gap-2 p-2 rounded-md transition-all ${
              currentDirection === key
                ? 'bg-primary/20 border border-primary shadow-neon-green'
                : 'bg-muted/30 border border-transparent'
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                currentDirection === key ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            <span
              className={`text-xs font-orbitron ${
                currentDirection === key ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {key}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        Position your hand in the camera and move it to control the snake
      </p>
    </div>
  );
}

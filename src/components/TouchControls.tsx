import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Direction } from '@/hooks/useHandDetection';

interface TouchControlsProps {
  onDirectionChange: (direction: Direction) => void;
  disabled?: boolean;
}

export function TouchControls({ onDirectionChange, disabled }: TouchControlsProps) {
  const handleDirection = (direction: Direction) => {
    if (!disabled) {
      onDirectionChange(direction);
    }
  };

  const buttonClass = `
    w-16 h-16 rounded-xl flex items-center justify-center
    bg-card/80 border border-primary/30 
    active:bg-primary/30 active:scale-95
    transition-all duration-100
    touch-manipulation select-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-muted-foreground font-orbitron mb-2">TOUCH CONTROLS</p>
      
      <div className="grid grid-cols-3 gap-2">
        {/* Top row - Up button */}
        <div />
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDirection('UP');
          }}
          onClick={() => handleDirection('UP')}
          disabled={disabled}
          aria-label="Move up"
        >
          <ChevronUp className="w-8 h-8 text-primary" />
        </button>
        <div />

        {/* Middle row - Left and Right */}
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDirection('LEFT');
          }}
          onClick={() => handleDirection('LEFT')}
          disabled={disabled}
          aria-label="Move left"
        >
          <ChevronLeft className="w-8 h-8 text-primary" />
        </button>
        <div className="w-16 h-16 rounded-xl bg-card/30 border border-border/20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-primary/50" />
        </div>
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDirection('RIGHT');
          }}
          onClick={() => handleDirection('RIGHT')}
          disabled={disabled}
          aria-label="Move right"
        >
          <ChevronRight className="w-8 h-8 text-primary" />
        </button>

        {/* Bottom row - Down button */}
        <div />
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDirection('DOWN');
          }}
          onClick={() => handleDirection('DOWN')}
          disabled={disabled}
          aria-label="Move down"
        >
          <ChevronDown className="w-8 h-8 text-primary" />
        </button>
        <div />
      </div>
    </div>
  );
}

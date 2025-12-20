import React from 'react';
import { Cpu, Hand, Gamepad2 } from 'lucide-react';

export function Header() {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="relative">
          <Hand className="w-10 h-10 text-secondary float-animation" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse" />
        </div>
        <h1 className="text-3xl md:text-4xl font-arcade text-primary neon-text tracking-wider">
          SNAKE
        </h1>
        <Gamepad2 className="w-10 h-10 text-accent" />
      </div>
      
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-orbitron">
        <Cpu className="w-4 h-4 text-secondary" />
        <span>AI-POWERED HAND GESTURE CONTROL</span>
        <Cpu className="w-4 h-4 text-secondary" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary">TENSORFLOW.JS</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-secondary">HANDPOSE</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent">COMPUTER VISION</span>
        </div>
      </div>
    </header>
  );
}

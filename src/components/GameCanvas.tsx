import React, { useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface GameCanvasProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  cellCount: number;
  isGameOver: boolean;
}

export function GameCanvas({
  snake,
  food,
  gridSize,
  cellCount,
  isGameOver,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = gridSize * cellCount;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'hsl(220, 20%, 6%)';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    ctx.strokeStyle = 'hsl(120, 100%, 50%, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= cellCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvasSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvasSize, i * gridSize);
      ctx.stroke();
    }

    // Draw food with glow effect
    ctx.shadowColor = 'hsl(0, 100%, 50%)';
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'hsl(0, 100%, 50%)';
    ctx.beginPath();
    ctx.arc(
      food.x * gridSize + gridSize / 2,
      food.y * gridSize + gridSize / 2,
      gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow for snake
    ctx.shadowColor = 'hsl(120, 100%, 50%)';
    ctx.shadowBlur = 10;

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const alpha = 1 - (index * 0.03);
      
      if (isHead) {
        // Head with brighter glow
        ctx.fillStyle = 'hsl(120, 100%, 60%)';
        ctx.shadowBlur = 20;
      } else {
        ctx.fillStyle = `hsla(120, 100%, 50%, ${Math.max(alpha, 0.4)})`;
        ctx.shadowBlur = 8;
      }

      const x = segment.x * gridSize + 1;
      const y = segment.y * gridSize + 1;
      const size = gridSize - 2;
      const radius = isHead ? 6 : 4;

      // Rounded rectangle
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + size - radius, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
      ctx.lineTo(x + size, y + size - radius);
      ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
      ctx.lineTo(x + radius, y + size);
      ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.fill();

      // Draw eyes on head
      if (isHead) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'hsl(220, 20%, 6%)';
        ctx.beginPath();
        ctx.arc(x + size * 0.35, y + size * 0.35, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size * 0.65, y + size * 0.35, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Game over overlay
    if (isGameOver) {
      ctx.fillStyle = 'hsla(220, 20%, 6%, 0.8)';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    }
  }, [snake, food, gridSize, cellCount, canvasSize, isGameOver]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      className="game-canvas rounded-lg"
    />
  );
}

import { useState, useCallback, useRef, useEffect } from 'react';
import { Direction } from './useHandDetection';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
  isPlaying: boolean;
}

interface UseSnakeGameReturn extends GameState {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  setDirection: (direction: Direction) => void;
  gridSize: number;
  cellCount: number;
}

const GRID_SIZE = 20;
const CELL_COUNT = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

function generateFood(snake: Position[]): Position {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * CELL_COUNT),
      y: Math.floor(Math.random() * CELL_COUNT),
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
}

export function useSnakeGame(): UseSnakeGameReturn {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(() => generateFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<number | null>(null);

  const moveSnake = useCallback(() => {
    setSnake(currentSnake => {
      const head = currentSnake[0];
      const direction = nextDirectionRef.current;
      directionRef.current = direction;

      let newHead: Position;
      switch (direction) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
        default:
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= CELL_COUNT ||
        newHead.y < 0 ||
        newHead.y >= CELL_COUNT
      ) {
        setIsGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      // Check self collision
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check food collision
      setFood(currentFood => {
        if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
          setScore(prev => {
            const newScore = prev + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snakeHighScore', newScore.toString());
            }
            return newScore;
          });
          return generateFood(newSnake);
        }
        newSnake.pop();
        return currentFood;
      });

      return newSnake;
    });
  }, [highScore]);

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
  }, []);

  const pauseGame = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeGame = useCallback(() => {
    setIsPaused(false);
  }, []);

  const resetGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(false);
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
  }, []);

  const setDirection = useCallback((newDirection: Direction) => {
    if (!newDirection) return;

    const currentDirection = directionRef.current;
    
    // Prevent reversing direction
    const opposites: Record<string, string> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };

    if (opposites[newDirection] !== currentDirection) {
      nextDirectionRef.current = newDirection;
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (isPlaying && !isPaused && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, 150);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, isPaused, isGameOver, moveSnake]);

  return {
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
    gridSize: GRID_SIZE,
    cellCount: CELL_COUNT,
  };
}

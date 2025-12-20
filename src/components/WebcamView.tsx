import React, { useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, Hand } from 'lucide-react';
import { Direction } from '@/hooks/useHandDetection';

interface WebcamViewProps {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  direction: Direction;
  landmarks: number[][] | null;
  onVideoReady: (video: HTMLVideoElement) => void;
}

export function WebcamView({
  isLoading,
  isReady,
  error,
  direction,
  landmarks,
  onVideoReady,
}: WebcamViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          if (videoRef.current) {
            onVideoReady(videoRef.current);
          }
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
    }
  }, [onVideoReady]);

  useEffect(() => {
    if (isReady) {
      startCamera();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isReady, startCamera]);

  // Draw landmarks on canvas
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !landmarks) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17], // Palm
    ];

    ctx.strokeStyle = 'hsl(200, 100%, 50%)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'hsl(200, 100%, 50%)';
    ctx.shadowBlur = 10;

    connections.forEach(([start, end]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[start][0], landmarks[start][1]);
      ctx.lineTo(landmarks[end][0], landmarks[end][1]);
      ctx.stroke();
    });

    // Draw landmarks
    landmarks.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point[0], point[1], index === 8 ? 8 : 4, 0, Math.PI * 2);
      ctx.fillStyle = index === 8 ? 'hsl(120, 100%, 50%)' : 'hsl(320, 100%, 60%)';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 15;
      ctx.fill();
    });
  }, [landmarks]);

  const directionArrow = {
    UP: '↑',
    DOWN: '↓',
    LEFT: '←',
    RIGHT: '→',
  };

  return (
    <div className="relative rounded-lg overflow-hidden neon-border-blue crt-effect">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-sm px-4 py-2 flex items-center justify-between border-b border-secondary/30">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-secondary" />
          <span className="text-xs font-orbitron text-secondary">CAMERA FEED</span>
        </div>
        {landmarks && (
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs text-primary">HAND DETECTED</span>
          </div>
        )}
      </div>

      {/* Video Container */}
      <div className="relative aspect-[4/3] bg-muted">
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-x-[-1]"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute inset-0 w-full h-full scale-x-[-1] pointer-events-none"
        />

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-orbitron text-primary neon-text">LOADING AI MODEL...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90">
            <CameraOff className="w-12 h-12 text-destructive mb-4" />
            <p className="text-sm font-orbitron text-destructive">{error}</p>
          </div>
        )}

        {/* Direction Indicator */}
        {direction && (
          <div className="absolute bottom-4 right-4 z-20">
            <div className="w-16 h-16 rounded-full bg-background/80 border-2 border-primary flex items-center justify-center neon-border">
              <span className="text-3xl text-primary neon-text">
                {directionArrow[direction]}
              </span>
            </div>
          </div>
        )}

        {/* Center Guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 border border-dashed border-muted-foreground/30 rounded-full" />
          <div className="absolute w-2 h-2 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>

      {/* Scanlines Effect */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
    </div>
  );
}

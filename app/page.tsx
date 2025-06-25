"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context as CanvasRenderingContext2D;

    const car = { x: 150, y: 260, width: 40, height: 60, speed: 5 };
    const obstacles: { x: number; y: number; width: number; height: number }[] = [];
    let keys: { [key: string]: boolean } = {};
    let animationFrame: number;
    let lastSpawn = 0;

    function drawCar() {
      ctx.fillStyle = "blue";
      ctx.fillRect(car.x, car.y, car.width, car.height);
    }

    function drawObstacles() {
      ctx.fillStyle = "red";
      for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      }
    }

    function updateObstacles() {
      for (let obs of obstacles) {
        obs.y += 3;
      }
      const now = Date.now();
      if (now - lastSpawn > 1000) {
        obstacles.push({ x: Math.random() * 260, y: -50, width: 40, height: 40 });
        lastSpawn = now;
      }
      for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].y > 300) obstacles.splice(i, 1);
      }
    }

    function checkCollision(): boolean {
      for (let obs of obstacles) {
        if (
          car.x < obs.x + obs.width &&
          car.x + car.width > obs.x &&
          car.y < obs.y + obs.height &&
          car.y + car.height > obs.y
        ) {
          return true;
        }
      }
      return false;
    }

    function gameLoop() {
      ctx.clearRect(0, 0, 300, 320);
      if (keys["ArrowLeft"] && car.x > 0) car.x -= car.speed;
      if (keys["ArrowRight"] && car.x < 260) car.x += car.speed;

      drawCar();
      drawObstacles();
      updateObstacles();

      if (checkCollision()) {
        setRunning(false);
        cancelAnimationFrame(animationFrame);
        alert("Game Over! Score: " + score);
        return;
      }

      setScore((prev) => prev + 1);
      animationFrame = requestAnimationFrame(gameLoop);
    }

    const downHandler = (e: KeyboardEvent) => (keys[e.key] = true);
    const upHandler = (e: KeyboardEvent) => (keys[e.key] = false);

    if (running) {
      document.addEventListener("keydown", downHandler);
      document.addEventListener("keyup", upHandler);
      animationFrame = requestAnimationFrame(gameLoop);
    }

    return () => {
      document.removeEventListener("keydown", downHandler);
      document.removeEventListener("keyup", upHandler);
      cancelAnimationFrame(animationFrame);
    };
  }, [running]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">🚗 Car Minigame</h1>
      <canvas
        ref={canvasRef}
        width={300}
        height={320}
        className="border border-black mb-4 rounded-xl bg-white"
      ></canvas>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setScore(0);
            setRunning(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Start Game
        </button>
        <span className="text-lg font-medium">Score: {score}</span>
      </div>
    </div>
  );
}

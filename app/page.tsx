// "use client";

// import React, { useEffect, useRef, useState } from "react";

// export default function Home() {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [running, setRunning] = useState(false);
//   const [score, setScore] = useState(0);
//   const moveLeftRef = useRef(false);
//   const moveRightRef = useRef(false);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const context = canvas.getContext("2d");
//     if (!context) return;
//     const ctx = context as CanvasRenderingContext2D;

//     const car = { x: 150, y: 260, width: 40, height: 60, speed: 5 };
//     const obstacles: { x: number; y: number; width: number; height: number }[] = [];
//     let keys: { [key: string]: boolean } = {};
//     let animationFrame: number;
//     let lastSpawn = 0;

//     const carImage = new Image();
//     const obstacleImage = new Image();
//     carImage.src = "/car-player.png"; // Ferrari image
//     obstacleImage.src = "/car-obstacle.png";

//     function drawCar() {
//       if (carImage.complete) {
//         ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
//       } else {
//         ctx.fillStyle = "blue";
//         ctx.fillRect(car.x, car.y, car.width, car.height);
//       }
//     }

//     function drawObstacles() {
//       for (let obs of obstacles) {
//         if (obstacleImage.complete) {
//           ctx.drawImage(obstacleImage, obs.x, obs.y, obs.width, obs.height);
//         } else {
//           ctx.fillStyle = "red";
//           ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
//         }
//       }
//     }

//     function updateObstacles() {
//       for (let obs of obstacles) {
//         obs.y += 3;
//       }
//       const now = Date.now();
//       if (now - lastSpawn > 1000) {
//         obstacles.push({ x: Math.random() * 260, y: -60, width: 40, height: 60 });
//         lastSpawn = now;
//       }
//       for (let i = obstacles.length - 1; i >= 0; i--) {
//         if (obstacles[i].y > 320) obstacles.splice(i, 1);
//       }
//     }

//     function checkCollision(): boolean {
//       for (let obs of obstacles) {
//         if (
//           car.x < obs.x + obs.width &&
//           car.x + car.width > obs.x &&
//           car.y < obs.y + obs.height &&
//           car.y + car.height > obs.y
//         ) {
//           return true;
//         }
//       }
//       return false;
//     }

//     function gameLoop() {
//       ctx.clearRect(0, 0, 300, 320);

//       if ((keys["ArrowLeft"] || moveLeftRef.current) && car.x > 0) car.x -= car.speed;
//       if ((keys["ArrowRight"] || moveRightRef.current) && car.x < 260) car.x += car.speed;

//       drawCar();
//       drawObstacles();
//       updateObstacles();

//       if (checkCollision()) {
//         setRunning(false);
//         cancelAnimationFrame(animationFrame);
//         alert("Game Over! Score: " + score);
//         return;
//       }

//       setScore((prev) => prev + 1);
//       animationFrame = requestAnimationFrame(gameLoop);
//     }

//     const downHandler = (e: KeyboardEvent) => (keys[e.key] = true);
//     const upHandler = (e: KeyboardEvent) => (keys[e.key] = false);

//     if (running) {
//       document.addEventListener("keydown", downHandler);
//       document.addEventListener("keyup", upHandler);
//       animationFrame = requestAnimationFrame(gameLoop);
//     }

//     return () => {
//       document.removeEventListener("keydown", downHandler);
//       document.removeEventListener("keyup", upHandler);
//       cancelAnimationFrame(animationFrame);
//     };
//   }, [running]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <h1 className="text-3xl font-bold mb-4">🚗 Car Minigame</h1>
//       <canvas
//         ref={canvasRef}
//         width={300}
//         height={320}
//         className="border border-black mb-4 rounded-xl bg-white"
//       ></canvas>
//       <div className="flex items-center gap-4 mb-4">
//         <button
//           onClick={() => {
//             setScore(0);
//             setRunning(true);
//           }}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Start Game
//         </button>
//         <span className="text-lg font-medium">Score: {score}</span>
//       </div>
//       {/* Mobile Controls */}
//       <div className="flex justify-center gap-4 md:hidden">
//         <button
//           onTouchStart={() => (moveLeftRef.current = true)}
//           onTouchEnd={() => (moveLeftRef.current = false)}
//           className="bg-gray-700 text-white px-6 py-3 rounded-lg"
//         >
//           ⬅️ Left
//         </button>
//         <button
//           onTouchStart={() => (moveRightRef.current = true)}
//           onTouchEnd={() => (moveRightRef.current = false)}
//           className="bg-gray-700 text-white px-6 py-3 rounded-lg"
//         >
//           Right ➡️
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);

  // Track movement refs for instant feedback
  const moveLeftRef = useRef(false);
  const moveRightRef = useRef(false);

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

    const carImage = new Image();
    const obstacleImage = new Image();
    carImage.src = "/car-player.png"; // make sure it's in public/
    obstacleImage.src = "/car-obstacle.png";

    carImage.onerror = () => console.error("❌ Failed to load car image");
    obstacleImage.onerror = () => console.error("❌ Failed to load obstacle image");

    function drawCar() {
      if (carImage.complete && carImage.naturalWidth !== 0) {
        ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
      } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(car.x, car.y, car.width, car.height);
      }
    }

    function drawObstacles() {
      for (let obs of obstacles) {
        if (obstacleImage.complete && obstacleImage.naturalWidth !== 0) {
          ctx.drawImage(obstacleImage, obs.x, obs.y, obs.width, obs.height);
        } else {
          ctx.fillStyle = "red";
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        }
      }
    }

    function updateObstacles() {
      for (let obs of obstacles) obs.y += 3;
      const now = Date.now();
      if (now - lastSpawn > 1000) {
        obstacles.push({ x: Math.random() * 260, y: -60, width: 40, height: 60 });
        lastSpawn = now;
      }
      for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].y > 320) obstacles.splice(i, 1);
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

      if ((keys["ArrowLeft"] || moveLeftRef.current) && car.x > 0)
        car.x -= car.speed;
      if ((keys["ArrowRight"] || moveRightRef.current) && car.x < 260)
        car.x += car.speed;

      drawCar();
      drawObstacles();
      updateObstacles();

      if (checkCollision()) {
        setRunning(false);
        cancelAnimationFrame(animationFrame);
        alert("Game Over!");
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
      <div className="flex items-center gap-4 mb-4">
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
      <div className="flex justify-center gap-4 md:hidden">
        <button
          onTouchStart={() => (moveLeftRef.current = true)}
          onTouchEnd={() => (moveLeftRef.current = false)}
          className="bg-gray-700 text-white px-6 py-3 rounded-lg"
        >
          ⬅️ Left
        </button>
        <button
          onTouchStart={() => (moveRightRef.current = true)}
          onTouchEnd={() => (moveRightRef.current = false)}
          className="bg-gray-700 text-white px-6 py-3 rounded-lg"
        >
          Right ➡️
        </button>
      </div>
    </div>
  );
}

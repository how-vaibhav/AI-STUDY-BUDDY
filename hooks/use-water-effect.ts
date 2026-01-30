import { useEffect, useRef } from "react";

export const useWaterEffect = (
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const waveRef = useRef<Float32Array | null>(null);
  const particlesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; life: number }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
    }> = [];
    particlesRef.current = particles;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.current = e.clientX - rect.left;
      mouseY.current = e.clientY - rect.top;

      // Create liquid particles
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        particles.push({
          x: mouseX.current,
          y: mouseY.current,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
        });
      }
    };

    const animate = () => {
      // Clear canvas with semi-transparent background
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      ctx.fillRect(
        0,
        0,
        canvas.width / window.devicePixelRatio,
        canvas.height / window.devicePixelRatio,
      );

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics
        p.vy += 0.1; // gravity
        p.vx *= 0.98; // friction
        p.vy *= 0.98;

        // Position
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.008;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle with gradient
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 15);
        gradient.addColorStop(0, `rgba(147, 112, 219, ${p.life * 0.3})`);
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${p.life * 0.2})`);
        gradient.addColorStop(1, `rgba(99, 102, 241, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Draw liquid blob
        ctx.strokeStyle = `rgba(147, 112, 219, ${p.life * 0.15})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw cursor interaction effect
      const gradient = ctx.createRadialGradient(
        mouseX.current,
        mouseY.current,
        5,
        mouseX.current,
        mouseY.current,
        50,
      );
      gradient.addColorStop(0, "rgba(147, 112, 219, 0.1)");
      gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.05)");
      gradient.addColorStop(1, "rgba(99, 102, 241, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouseX.current, mouseY.current, 50, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [containerRef]);

  return canvasRef;
};

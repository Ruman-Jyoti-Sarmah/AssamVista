import { useEffect, useRef } from "react";

import "../../styles/intro.css";

const BRAND_NAME = "AssamVista";
const COLORS = ["#1e6fe0", "#0b3d91", "#e0212c", "#4f9d1e", "#e8b13a", "#38b6ff"];
const PARTICLE_LIMIT = 180;
const ANIMATION_MS = 3300;
const SAFETY_MS = 4500;

export default function AssamVistaIntro({ onFinish }) {
  const introRef = useRef(null);
  const canvasRef = useRef(null);
  const logoRef = useRef(null);

  const rafRef = useRef(0);
  const finishTimerRef = useRef(null);
  const safetyTimerRef = useRef(null);
  const finishedRef = useRef(false);

  const ctxRef = useRef(null);
  const sizeRef = useRef({ width: 0, height: 0, pixelRatio: 1 });
  const particlesRef = useRef([]);
  const startedAtRef = useRef(0);
  const previousTimeRef = useRef(0);
  const burstCreatedRef = useRef(false);

  const prefersReducedRef = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const particleLimit =
    prefersReducedRef.current || typeof window !== "undefined" && window.innerWidth < 640
      ? 60
      : PARTICLE_LIMIT;

  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  function resizeCanvas() {
    const intro = introRef.current;
    const canvas = canvasRef.current;
    if (!intro || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const bounds = intro.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    sizeRef.current = { width, height, pixelRatio };
  }

  function addParticle(x, y, velocityX, velocityY, color) {
    const particles = particlesRef.current;
    if (particles.length >= particleLimit) particles.shift();
    particles.push({
      x,
      y,
      velocityX,
      velocityY,
      life: 0.9 + Math.random() * 1.1,
      maxLife: 2,
      size: 1.2 + Math.random() * 2.2,
      color,
    });
  }

  function createBurst() {
    const { width, height } = sizeRef.current;
    const centerX = width / 2;
    const centerY = height * 0.42;
    for (let index = 0; index < 90; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 45 + Math.random() * 150;
      addParticle(
        centerX,
        centerY,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        COLORS[Math.floor(Math.random() * COLORS.length)],
      );
    }
  }

  function drawParticle(particle, delta) {
    particle.life -= delta;
    particle.x += particle.velocityX * delta;
    particle.y += particle.velocityY * delta;
    particle.velocityX *= 0.985;
    particle.velocityY *= 0.985;

    const ctx = ctxRef.current;
    if (!ctx) return;

    const opacity = Math.max(0, Math.min(1, particle.life / particle.maxLife));
    ctx.globalAlpha = opacity;
    ctx.fillStyle = particle.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }

  function renderParticles(timestamp) {
    if (prefersReducedRef.current) return;

    const ctx = ctxRef.current;
    if (!ctx) return;

    const elapsed = (timestamp - startedAtRef.current) / 1000;
    const delta = Math.min((timestamp - previousTimeRef.current) / 1000 || 0.016, 0.04);
    previousTimeRef.current = timestamp;

    const { width, height } = sizeRef.current;
    ctx.clearRect(0, 0, width, height);

    if (elapsed > 1.05 && !burstCreatedRef.current) {
      burstCreatedRef.current = true;
      createBurst();
    }

    const particles = particlesRef.current;
    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      drawParticle(particle, delta);
      if (particle.life <= 0) particles.splice(index, 1);
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    if (elapsed < 3.2 || particles.length > 0) {
      rafRef.current = requestAnimationFrame(renderParticles);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearTimeout(finishTimerRef.current);
    onFinishRef.current?.();
  }

  function startIntro() {
    if (finishedRef.current) return;
    const intro = introRef.current;
    if (!intro) return;

    intro.classList.remove("is-playing");
    void intro.offsetWidth;
    intro.classList.add("is-playing");

    particlesRef.current = [];
    burstCreatedRef.current = false;
    startedAtRef.current = performance.now();
    previousTimeRef.current = startedAtRef.current;

    resizeCanvas();
    if (!prefersReducedRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(renderParticles);
    }

    clearTimeout(finishTimerRef.current);
    finishTimerRef.current = setTimeout(finish, ANIMATION_MS);
  }

  useEffect(() => {
    const intro = introRef.current;
    const logo = logoRef.current;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      }
    };

    const handleResize = () => {
      resizeCanvas();
    };

    const handleOrientationChange = () => {
      setTimeout(resizeCanvas, 180);
    };

    const handleLogoError = () => {
      if (logo) {
        logo.alt = "AssamVista";
        logo.style.visibility = "hidden";
      }
    };
    logo?.addEventListener("error", handleLogoError, { once: true });

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    startIntro();

    safetyTimerRef.current = setTimeout(finish, SAFETY_MS);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(finishTimerRef.current);
      clearTimeout(safetyTimerRef.current);
      document.body.style.overflow = previousOverflow;
      logo?.removeEventListener("error", handleLogoError);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={introRef}
      className="av-intro"
      role="region"
      aria-label="AssamVista introduction"
    >
      <div className="ambient ambient--blue" aria-hidden="true" />
      <div className="ambient ambient--red" aria-hidden="true" />
      <div className="ambient ambient--green" aria-hidden="true" />
      <canvas className="particle-canvas" ref={canvasRef} aria-hidden="true" />

      <section className="brand-lockup" aria-label="AssamVista">
        <div className="brand-mark">
          <img
            ref={logoRef}
            alt="AssamVista emblem"
            decoding="async"
            src="/Logo/AssamVista-Logo.png"
          />
        </div>
        <h1 className="wordmark" aria-label="AssamVista">
          {BRAND_NAME.split("").map((character, index) => (
            <span key={character + index} style={{ "--letter-index": index }} aria-hidden="true">
              {character}
            </span>
          ))}
        </h1>
        <p className="tagline">A CULTURE IN MOTION</p>
        <div className="progress-area" aria-hidden="true">
          <div className="progress-track">
            <div className="progress-value" />
          </div>
          <p className="loading-label">Discovering Assam</p>
        </div>
      </section>

      <div className="bottom-band" aria-hidden="true" />
    </div>
  );
}

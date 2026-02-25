"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { useSettingStore } from "@/store/setting.store";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated floating particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
    };

    const particles: Particle[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.35 + 0.08,
    }));

    const colors = ["#624a2b", "#9c620f", "#ab936c", "#c9c3b6"];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = colors[i % colors.length];
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        .nf-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #fbf9f7;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dark .nf-root {
          background: #14120f;
        }

        /* Canvas */
        .nf-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        /* Grain overlay */
        .nf-grain {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.5;
        }

        /* Big decorative 404 */
        .nf-bg-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -48%);
          font-family: 'Playfair Display', serif;
          font-size: clamp(200px, 30vw, 420px);
          font-weight: 900;
          color: transparent;
          -webkit-text-stroke: 1.5px #ab936c28;
          letter-spacing: -0.04em;
          line-height: 1;
          pointer-events: none;
          user-select: none;
          z-index: 1;
          white-space: nowrap;
        }
        .dark .nf-bg-text {
          -webkit-text-stroke: 1.5px #ab936c18;
        }

        /* Content */
        .nf-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 2rem;
          max-width: 560px;
          animation: nf-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes nf-rise {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Logo row */
        .nf-logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 3rem;
          text-decoration: none;
          animation: nf-rise 0.7s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .nf-logo-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #9c620f;
        }
        .nf-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #624a2b;
          letter-spacing: 0.04em;
        }
        .dark .nf-logo-name { color: #ab936c; }

        /* Tag */
        .nf-tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9c620f;
          background: #9c620f18;
          border: 1px solid #9c620f30;
          padding: 4px 14px;
          border-radius: 999px;
          margin-bottom: 1.5rem;
          animation: nf-rise 0.7s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* Headline */
        .nf-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.12;
          color: #211d11;
          margin: 0 0 1.25rem;
          animation: nf-rise 0.7s 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .dark .nf-headline { color: #f6f3ef; }

        .nf-headline em {
          font-style: italic;
          color: #9c620f;
        }

        /* Body */
        .nf-body {
          font-size: 1rem;
          line-height: 1.7;
          color: #8b7f6e;
          margin: 0 0 2.5rem;
          animation: nf-rise 0.7s 0.36s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .dark .nf-body { color: #cfc5b8; }

        /* Divider with leaf */
        .nf-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 auto 2.5rem;
          max-width: 240px;
          animation: nf-rise 0.7s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .nf-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #ab936c60, transparent);
        }
        .nf-divider-icon {
          color: #9c620f;
          font-size: 0.85rem;
        }

        /* Buttons */
        .nf-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          animation: nf-rise 0.7s 0.48s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .nf-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: linear-gradient(135deg, #624a2b, #9c620f);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 999px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 18px #9c620f40;
        }
        .nf-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px #9c620f55;
        }
        .nf-btn-primary:active { transform: translateY(0); }

        .nf-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 24px;
          background: transparent;
          color: #624a2b;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 999px;
          text-decoration: none;
          border: 1.5px solid #ab936c60;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }
        .nf-btn-ghost:hover {
          border-color: #9c620f;
          background: #9c620f0d;
          transform: translateY(-2px);
        }
        .dark .nf-btn-ghost {
          color: #ab936c;
          border-color: #ab936c40;
        }
        .dark .nf-btn-ghost:hover {
          border-color: #ab936c;
          background: #ab936c0d;
        }

        /* Bottom links */
        .nf-links {
          margin-top: 3rem;
          display: flex;
          gap: 24px;
          justify-content: center;
          animation: nf-rise 0.7s 0.58s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .nf-links a {
          font-size: 0.82rem;
          color: #8b7f6e;
          text-decoration: none;
          letter-spacing: 0.04em;
          position: relative;
          transition: color 0.2s;
        }
        .nf-links a::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 100%;
          height: 1px;
          background: #9c620f;
          transition: right 0.25s ease;
        }
        .nf-links a:hover { color: #9c620f; }
        .nf-links a:hover::after { right: 0; }

        /* Corner decorations */
        .nf-corner {
          position: absolute;
          z-index: 2;
          pointer-events: none;
        }
        .nf-corner-tl {
          top: 28px; left: 28px;
          width: 60px; height: 60px;
          border-top: 1.5px solid #ab936c50;
          border-left: 1.5px solid #ab936c50;
        }
        .nf-corner-br {
          bottom: 28px; right: 28px;
          width: 60px; height: 60px;
          border-bottom: 1.5px solid #ab936c50;
          border-right: 1.5px solid #ab936c50;
        }

        /* Wandering coffee leaf SVG */
        .nf-leaf {
          position: absolute;
          z-index: 1;
          opacity: 0.12;
          pointer-events: none;
          animation: nf-float 9s ease-in-out infinite;
        }
        .nf-leaf-1 { top: 12%; left: 8%; animation-delay: 0s; }
        .nf-leaf-2 { bottom: 15%; right: 9%; animation-delay: -4s; }

        @keyframes nf-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-18px) rotate(8deg); }
        }
      `}</style>

      <div className="nf-root">
        <canvas ref={canvasRef} className="nf-canvas" />
        <div className="nf-grain" />

        {/* Corner brackets */}
        <div className="nf-corner nf-corner-tl" />
        <div className="nf-corner nf-corner-br" />

        {/* Floating leaves */}
        <svg
          className="nf-leaf nf-leaf-1"
          width="90"
          height="90"
          viewBox="0 0 90 90"
          fill="none"
        >
          <path
            d="M45 5 C20 5 5 30 10 60 C15 80 40 88 55 75 C70 62 80 30 65 12 C58 5 51 5 45 5Z"
            fill="#9c620f"
          />
          <line
            x1="45"
            y1="10"
            x2="42"
            y2="80"
            stroke="#624a2b"
            strokeWidth="1.2"
          />
        </svg>
        <svg
          className="nf-leaf nf-leaf-2"
          width="70"
          height="70"
          viewBox="0 0 90 90"
          fill="none"
        >
          <path
            d="M45 5 C20 5 5 30 10 60 C15 80 40 88 55 75 C70 62 80 30 65 12 C58 5 51 5 45 5Z"
            fill="#ab936c"
          />
          <line
            x1="45"
            y1="10"
            x2="42"
            y2="80"
            stroke="#624a2b"
            strokeWidth="1.2"
          />
        </svg>

        {/* Big ghost 404 */}
        <div className="nf-bg-text" aria-hidden="true">
          404
        </div>

        {/* Main content */}
        <div className="nf-content">
          <Link href="/" className="nf-logo">
            <div className="nf-logo-dot" />
            <span className="nf-logo-name">
              {useSettingStore((state) => state.general?.systemName)}
            </span>
          </Link>

          <div>
            <span className="nf-tag">Error 404</span>
          </div>

          <h1 className="nf-headline">
            Con đường này
            <br />
            <em>dẫn đến vô định</em>
          </h1>

          <p className="nf-body">
            Trang bạn đang tìm có lẽ đã rời đi làm tình nguyện ở một nơi nào đó
            mà chúng tôi chưa biết đến. Hãy quay lại và khám phá những cơ hội
            khác nhé!
          </p>

          <div className="nf-divider">
            <div className="nf-divider-line" />
            <span className="nf-divider-icon">✦</span>
            <div className="nf-divider-line" />
          </div>

          <div className="nf-actions">
            <Link href="/" className="nf-btn-primary">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Về trang chủ
            </Link>
            <Link href="/bai-viet" className="nf-btn-ghost">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Khám phá hoạt động
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

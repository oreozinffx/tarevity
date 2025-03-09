"use client";

import React, { useState, useEffect } from "react";

interface LogoProps {
  className?: string;
  width?: string;
  height?: string;
}

export default function Logo({
  className,
  width = "auto",
  height = "auto",
}: LogoProps) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const updateMode = () => {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme === "dark") {
        setMode("dark");
      } else if (savedTheme === "light") {
        setMode("light");
      } else if (document.documentElement.classList.contains("dark")) {
        setMode("dark");
      } else {
        setMode("light");
      }
    };

    updateMode();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        updateMode();
      }
    };

    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains("dark")) {
        setMode("dark");
      } else {
        setMode("light");
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      observer.disconnect();
    };
  }, []);

  const palette = {
    light: {
      background: "#f8f9fa",
      card: "#ffffff",
      primary: "#4361ee",
      secondary: "#3f37c9",
      text: {
        primary: "#212529",
        secondary: "#6c757d",
        muted: "#adb5bd",
      },
      border: "#dee2e6",
      hover: "#e9ecef",
    },
    dark: {
      background: "#121212",
      card: "#1e1e1e",
      primary: "#4cc9f0",
      secondary: "#4895ef",
      text: {
        primary: "#f8f9fa",
        secondary: "#e9ecef",
        muted: "#6c757d",
      },
      border: "#343a40",
      hover: "#2b2b2b",
    },
  };

  const colors = {
    // Modo claro
    light: {
      logoBackground: palette.light.primary,
      logoText: "#ffffff",
      textColor: palette.light.text.primary,
    },
    // Modo escuro
    dark: {
      logoBackground: palette.dark.primary,
      logoText: "#ffffff",
      textColor: palette.dark.text.primary,
    },
  };

  const currentColors = colors[mode];

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 410 92"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={currentColors.logoBackground} />
          <stop offset="100%" stopColor={currentColors.logoBackground} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Ajustando a posição vertical do container do ícone */}
      <g transform="translate(0, 0)">
        {/* Fundo do retângulo - muda para a cor primária da paleta */}
        <g transform="matrix(1,0,0,1,0,0)" fill="url(#logoGradient)">
          <rect
            xmlns="http://www.w3.org/2000/svg"
            width="110"
            height="92"
            rx="10"
            ry="10"
          ></rect>
        </g>
        
        {/* Ícones em branco para melhor contraste - centralizado verticalmente */}
        <g
          transform="matrix(0.7977662295158654,0,0,0.7977662295158654,14.96689512823895,10.049462247040735)"
          fill={currentColors.logoText}
        >
          <g xmlns="http://www.w3.org/2000/svg">
            <path
              fill={currentColors.logoText}
              d="M74.993,35.487c-0.296,0-0.591,0.007-0.889,0.021c-0.605-6.927-6.438-12.38-13.52-12.38   c-1.324,0-2.621,0.188-3.871,0.561c-4.387-5.478-11.052-8.709-18.104-8.709c-12.783,0-23.184,10.399-23.184,23.183   c0,1.81,0.21,3.603,0.626,5.355c-5.819,2.345-9.742,8.042-9.742,14.438c0,3.746,1.351,7.365,3.804,10.193   c2.397,2.768,5.692,4.602,9.286,5.174c0.794,0.23,1.611,0.346,2.433,0.346h5.529v-3.686h-5.529c-0.504,0-1.006-0.074-1.494-0.223   c-0.084-0.025-0.17-0.047-0.258-0.061c-5.751-0.867-10.087-5.92-10.087-11.746c0-5.359,3.61-10.078,8.78-11.472   c0.486-0.131,0.897-0.455,1.138-0.898c0.24-0.441,0.289-0.964,0.135-1.443c-0.621-1.934-0.937-3.944-0.937-5.979   c0-10.752,8.748-19.501,19.5-19.501c6.325,0,12.284,3.095,15.939,8.276c0.498,0.706,1.42,0.971,2.217,0.636   c1.21-0.506,2.494-0.764,3.816-0.764c5.451,0,9.889,4.437,9.889,9.888c0,0.21-0.01,0.436-0.028,0.712   c-0.041,0.56,0.179,1.107,0.593,1.487c0.413,0.38,0.977,0.55,1.531,0.462c0.805-0.127,1.619-0.191,2.423-0.191   c8.481,0,15.384,6.899,15.384,15.381c0,8.48-6.9,15.383-15.384,15.383c-0.058,0-0.112-0.002-0.17-0.004l-0.162-0.006   c-0.092,0-0.185,0.004-0.276,0.016c-0.234,0.031-0.453,0.045-0.668,0.045h-1.56v3.686h1.56c0.322,0,0.653-0.021,0.99-0.061   c0.096,0.004,0.189,0.008,0.286,0.008c10.513,0,19.065-8.553,19.065-19.066C94.056,44.038,85.505,35.487,74.993,35.487z"
            ></path>
          </g>
          <g xmlns="http://www.w3.org/2000/svg">
            <g>
              <path
                fill="none"
                d="M48.048,52.328c-0.565,0-1.022,0.457-1.022,1.023C47.023,52.787,47.482,52.328,48.048,52.328    s1.022,0.459,1.022,1.023C49.072,52.787,48.615,52.328,48.048,52.328z"
              ></path>
              <path
                fill="none"
                d="M47.023,53.354c0,0.566,0.459,1.023,1.024,1.023C47.482,54.377,47.023,53.92,47.023,53.354z"
              ></path>
              <path
                fill="none"
                d="M48.048,54.377c0.565,0,1.022-0.457,1.022-1.023C49.072,53.92,48.615,54.377,48.048,54.377z"
              ></path>
            </g>
          </g>
          <g xmlns="http://www.w3.org/2000/svg">
            <path
              fill={currentColors.logoText}
              d="M61.803,50.278c0,0-2.367,2.445-7.33,2.445v4.887c0,0,9.773-0.15,9.773-4.887   C64.246,50.278,61.803,50.278,61.803,50.278z"
            ></path>
            <path
              fill={currentColors.logoText}
              d="M61.803,58.952c0,0-2.367,2.441-7.33,2.441v4.887c0,0,9.773-0.15,9.773-4.887   C64.246,58.952,61.803,58.952,61.803,58.952z"
            ></path>
            <path
              fill={currentColors.logoText}
              d="M61.803,67.624c0,0-2.367,2.441-7.33,2.441v4.889c0,0,9.773-0.152,9.773-4.889   C64.246,67.624,61.803,67.624,61.803,67.624z"
            ></path>
            <ellipse
              fill={currentColors.logoText}
              cx="54.473"
              cy="44.05"
              rx="9.771"
              ry="4.887"
            ></ellipse>
            <path
              fill={currentColors.logoText}
              d="M49.584,63.839c0,0-2.365,2.441-7.33,2.441c-4.963,0-7.33-2.441-7.33-2.441s-2.443,0-2.443,2.441   c0,4.734,9.775,4.889,9.775,4.889s9.773-0.152,9.773-4.889C52.029,63.839,49.584,63.839,49.584,63.839z"
            ></path>
            <path
              fill={currentColors.logoText}
              d="M49.584,72.511c0,0-2.365,2.443-7.33,2.443c-4.963,0-7.33-2.443-7.33-2.443s-2.443,0-2.443,2.443   c-0.002,4.73,9.773,4.885,9.773,4.885s9.775-0.152,9.775-4.885C52.029,72.511,49.584,72.511,49.584,72.511z"
            ></path>
            <ellipse
              fill={currentColors.logoText}
              cx="42.254"
              cy="57.61"
              rx="9.775"
              ry="4.887"
            ></ellipse>
          </g>
        </g>
      </g>

      {/* Texto da logo - ajustado verticalmente para alinhar com o centro do ícone */}
      <g
        transform="matrix(4.025301597423555,0,0,4.025301597423555,129.11443257369532,-10.34674619399522)"
        fill={currentColors.textColor}
      >
        <path d="M11.26 5.84 l0 1.8 l-4.56 0 l0 12.36 l-1.92 0 l0 -12.36 l-4.56 0 l0 -1.8 l11.04 0 z M14.42 10.28 c1.2 0 2.15 0.27328 2.85 0.81994 s1.07 1.3067 1.11 2.28 l0 5.08 c0 0.48 0.02666 0.99334 0.08 1.54 l-1.6 0 c-0.04 -0.42666 -0.06 -0.90666 -0.06 -1.44 l-0.04 0 c-0.41334 0.61334 -0.89 1.0467 -1.43 1.3 s-1.17 0.38 -1.89 0.38 c-0.97334 0 -1.7633 -0.26 -2.37 -0.78 s-0.91 -1.2067 -0.91 -2.06 c0 -1.08 0.45334 -1.8967 1.36 -2.45 s2.1866 -0.83 3.84 -0.83 l1.34 0 l0 -0.34 c0 -0.64 -0.21 -1.1433 -0.63 -1.51 s-0.97 -0.55 -1.65 -0.55 c-0.50666 0 -0.95 0.07666 -1.33 0.23 s-0.83 0.43668 -1.35 0.85002 l-1.08 -1.12 c1.0267 -0.90666 2.28 -1.3733 3.76 -1.4 z M11.96 17.259999999999998 c0 1.0267 0.68002 1.54 2.04 1.54 c0.81334 0 1.4633 -0.24334 1.95 -0.73 s0.73666 -1.19 0.75 -2.11 l0 -0.52 l-1.02 0 c-1.1733 0 -2.0866 0.15 -2.74 0.45 s-0.98 0.75666 -0.98 1.37 z M25.68 10.28 c0.33334 0 0.6 0.04 0.8 0.12 l-0.08 1.94 c-0.34666 -0.09334 -0.64666 -0.14 -0.9 -0.14 c-1.7733 0 -2.6734 0.98666 -2.7 2.96 l0 4.84 l-1.8 0 l0 -9.48 l1.8 0 l0 1.46 l0.04 0 c0.24 -0.50666 0.62666 -0.91666 1.16 -1.23 s1.0933 -0.47 1.68 -0.47 z M32.38 10.28 c1.4533 0 2.5834 0.45664 3.39 1.37 s1.2167 2.17 1.23 3.77 l0 0.5 l-7.6 0 c0 0.77334 0.31 1.4233 0.93 1.95 s1.3767 0.79666 2.27 0.81 c0.98666 0 1.8533 -0.47334 2.6 -1.42 l1.36 1.04 c-1.0133 1.2933 -2.4134 1.94 -4.2 1.94 c-1.4533 0 -2.6234 -0.46334 -3.51 -1.39 s-1.3433 -2.1234 -1.37 -3.59 c0 -1.4133 0.45666 -2.59 1.37 -3.53 s2.09 -1.4233 3.53 -1.45 z M35.08 14.48 c-0.02666 -0.89334 -0.28 -1.5767 -0.76 -2.05 s-1.14 -0.71 -1.98 -0.71 c-0.56 0 -1.0633 0.13666 -1.51 0.41 s-0.79666 0.62668 -1.05 1.06 s-0.38 0.86334 -0.38 1.29 l5.68 0 z M40.099999999999994 10.52 l2.84 7.26 l2.72 -7.26 l1.92 0 l-3.72 9.48 l-1.98 0 l-3.86 -9.48 l2.08 0 z M50.199999999999996 5.800000000000001 c0.36 0 0.67002 0.13002 0.93002 0.39002 s0.39 0.57 0.39 0.93 c0 0.37334 -0.13334 0.68668 -0.4 0.94002 s-0.57332 0.38 -0.91998 0.38 c-0.37334 0 -0.68668 -0.12666 -0.94002 -0.38 s-0.38 -0.56668 -0.38 -0.94002 s0.13334 -0.68668 0.4 -0.94002 s0.57332 -0.38 0.91998 -0.38 z M51.099999999999994 10.52 l0 9.48 l-1.8 0 l0 -9.48 l1.8 0 z M56.459999999999994 7.859999999999999 l-0.000019531 2.66 l2.58 0 l0 1.56 l-2.58 0 l0 4.56 c0 0.61334 0.08666 1.0867 0.26 1.42 s0.54 0.5 1.1 0.5 c0.53334 0 0.96 -0.09334 1.28 -0.28 l0 1.64 c-0.34666 0.18666 -0.89332 0.29332 -1.64 0.31998 c-0.72 0 -1.2767 -0.11 -1.67 -0.33 s-0.68 -0.52666 -0.86 -0.92 s-0.27 -1.01 -0.27 -1.85 l0 -5.06 l-2.08 0 l0 -1.56 l2.08 0 l0 -2.66 l1.8 0 z M62.29999999999999 10.52 l2.82 7.4 l0.04 0 l2.68 -7.4 l1.94 0 l-4.48 11.48 c-0.41334 1.1067 -0.86668 1.85 -1.36 2.23 s-1.1267 0.57 -1.9 0.57 c-0.65334 0 -1.1867 -0.08666 -1.6 -0.26 l0.22 -1.62 c0.37334 0.13334 0.73334 0.2 1.08 0.2 c0.56 0 0.96334 -0.13666 1.21 -0.41 s0.46332 -0.66334 0.64998 -1.17 l0.56 -1.48 l-3.94 -9.54 l2.08 0 z"></path>
      </g>
    </svg>
  );
}
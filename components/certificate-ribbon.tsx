'use client';

import { useLanguage } from '@/lib/use-language';
import { ELanguage } from '@/constants/enums';

interface CertificateRibbonProps {
  text?: string;
}

export function CertificateRibbon({ text }: CertificateRibbonProps) {
  const { language } = useLanguage();
  const displayText = text || (language === ELanguage.ru ? 'ПРОВЕРЕН' : 'VERIFIED');
  return (
    <div className="ribbon-container">
      <div className="ribbon">{displayText}</div>

      <style jsx>{`
        .ribbon-container {
          position: absolute;
          top: -42px;
          right: -32px;
          z-index: 10;
          animation: gentle-sway 4s ease-in-out infinite;
          transform-origin: center;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .ribbon {
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          --c: #7ed0d6;

          padding: 0.6em 1.3em;
          aspect-ratio: 1;
          display: grid;
          place-content: center;
          text-align: center;
          position: relative;
          z-index: 0;
          width: fit-content;
          box-sizing: border-box;
        }

        .ribbon:before {
          content: '';
          position: absolute;
          z-index: -1;
          inset: 50% 0 auto;
          aspect-ratio: 1;
          background: color-mix(in srgb, var(--c), #000 35%);
          clip-path: polygon(
            calc(100% / 3) 0,
            calc(200% / 3) 0,
            100% 90%,
            80% 85%,
            calc(200% / 3) 100%,
            calc(100% / 3) 0,
            calc(200% / 3) 0,
            calc(100% / 3) 100%,
            20% 85%,
            0 90%
          );
        }

        .ribbon:after {
          content: '';
          position: absolute;
          z-index: -1;
          inset: 0;
          background: radial-gradient(35% 35%, #0000 96%, #0003 97% 99%, #0000) var(--c);
          clip-path: polygon(
            100% 50%,
            89.66% 55.22%,
            98.3% 62.94%,
            86.96% 65.31%,
            93.3% 75%,
            81.73% 74.35%,
            85.36% 85.36%,
            74.35% 81.73%,
            75% 93.3%,
            65.31% 86.96%,
            62.94% 98.3%,
            55.22% 89.66%,
            50% 100%,
            44.78% 89.66%,
            37.06% 98.3%,
            34.69% 86.96%,
            25% 93.3%,
            25.65% 81.73%,
            14.64% 85.36%,
            18.27% 74.35%,
            6.7% 75%,
            13.04% 65.31%,
            1.7% 62.94%,
            10.34% 55.22%,
            0% 50%,
            10.34% 44.78%,
            1.7% 37.06%,
            13.04% 34.69%,
            6.7% 25%,
            18.27% 25.65%,
            14.64% 14.64%,
            25.65% 18.27%,
            25% 6.7%,
            34.69% 13.04%,
            37.06% 1.7%,
            44.78% 10.34%,
            50% 0%,
            55.22% 10.34%,
            62.94% 1.7%,
            65.31% 13.04%,
            75% 6.7%,
            74.35% 18.27%,
            85.36% 14.64%,
            81.73% 25.65%,
            93.3% 25%,
            86.96% 34.69%,
            98.3% 37.06%,
            89.66% 44.78%
          );
        }

        @keyframes gentle-sway {
          0%,
          100% {
            transform: rotate(-3deg) scale(1);
          }
          25% {
            transform: rotate(1deg) scale(1.02);
          }
          50% {
            transform: rotate(3deg) scale(1);
          }
          75% {
            transform: rotate(-1deg) scale(1.02);
          }
        }

        @media (max-width: 640px) {
          .ribbon {
            font-size: 12px;
            padding: 0.4em 1em;
          }

          .ribbon-container {
            top: 10px;
            right: 10px;
          }
        }
      `}</style>
    </div>
  );
}

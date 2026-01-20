'use client';

import { useLanguage } from '@/lib/use-language';
import { TechIcon } from './tech-icon';
import { Palette, Hammer, Gauge, Globe, Server, Accessibility, Smartphone } from 'lucide-react';
import { AnimatedSectionTitle } from '@/components/animated-section-title';
import { useDeviceOrientation } from '@/lib/use-device-orientation';
import { useRef, useEffect, useCallback } from 'react';

const expertiseIcons = ['🏗️', '🎨', 'HTML5', 'React', '♿', 'Node.js / Express'];

const expertiseColors = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-green-500 to-emerald-600',
  'from-teal-500 to-cyan-600',
];

const expertiseBgColors = [
  'bg-blue-50 dark:bg-blue-900/20',
  'bg-purple-50 dark:bg-purple-900/20',
  'bg-orange-50 dark:bg-orange-900/20',
  'bg-cyan-50 dark:bg-cyan-900/20',
  'bg-green-50 dark:bg-green-900/20',
  'bg-teal-50 dark:bg-teal-900/20',
];

const expertiseBorderColors = [
  'border-blue-200 dark:border-blue-800',
  'border-purple-200 dark:border-purple-800',
  'border-orange-200 dark:border-orange-800',
  'border-cyan-200 dark:border-cyan-800',
  'border-green-200 dark:border-green-800',
  'border-teal-200 dark:border-teal-800',
];

export function SkillsSection() {
  const { t } = useLanguage();
  const [orientation, requestOrientationPermission] = useDeviceOrientation({
    useRelativeOrientation: true,
    smoothingFactor: 0.12,
  });

  // Refs for all cards to apply orientation transforms
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Apply orientation-based transforms to all cards on mobile
  useEffect(() => {
    if (!orientation.isTracking || prefersReducedMotion) return;

    // Map orientation to card transforms
    // beta: front/back tilt (-180 to 180) -> rotateX
    // gamma: left/right tilt (-90 to 90) -> rotateY
    const maxTiltDeg = 8;

    // Clamp and scale values
    const rotateX = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, orientation.beta * 0.3));
    const rotateY = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, orientation.gamma * -0.4));

    // Calculate glare based on orientation
    const px = (rotateY / maxTiltDeg + 1) / 2; // 0..1
    const py = (-rotateX / maxTiltDeg + 1) / 2; // 0..1
    const dx = px * 2 - 1;
    const dy = py * 2 - 1;
    const intensity = Math.min(0.5, 0.12 + (Math.abs(dx) + Math.abs(dy)) * 0.2);
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;
    const rot = angleDeg + 90;

    cardRefs.current.forEach((card) => {
      if (!card) return;

      // Add smooth transition for mobile motion
      card.style.transition = 'transform 0.15s ease-out';
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;
      card.style.setProperty('--glare-x', `${(px * 100).toFixed(2)}%`);
      card.style.setProperty('--glare-y', `${(py * 100).toFixed(2)}%`);
      card.style.setProperty('--glare-o', `${intensity.toFixed(3)}`);
      card.style.setProperty('--glare-rot', `${rot.toFixed(1)}deg`);
    });
  }, [orientation.beta, orientation.gamma, orientation.isTracking, prefersReducedMotion]);

  // Desktop mouse handlers
  const handleMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      // Skip mouse handling on mobile when orientation is active
      if (prefersReducedMotion || orientation.isTracking) return;

      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width; // 0..1
      const py = y / rect.height; // 0..1

      // Map to -1..1 (center is 0,0)
      const dx = px * 2 - 1;
      const dy = py * 2 - 1;

      const maxTiltDeg = 8;
      const rotateY = dx * maxTiltDeg; // left/right
      const rotateX = -dy * maxTiltDeg; // up/down (invert so top pushes back)

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;

      // Update glare position and intensity via CSS variables
      card.style.setProperty('--glare-x', `${(px * 100).toFixed(2)}%`);
      card.style.setProperty('--glare-y', `${(py * 100).toFixed(2)}%`);
      const intensity = Math.min(0.5, 0.12 + (Math.abs(dx) + Math.abs(dy)) * 0.2);
      card.style.setProperty('--glare-o', `${intensity.toFixed(3)}`);

      // Angle the streak roughly perpendicular to the dominant axis of tilt
      const angleRad = Math.atan2(dy, dx); // -PI..PI
      const angleDeg = (angleRad * 180) / Math.PI; // -180..180
      // Rotate streak to cross the bright spot pleasingly
      const rot = angleDeg + 90;
      card.style.setProperty('--glare-rot', `${rot.toFixed(1)}deg`);
    },
    [prefersReducedMotion, orientation.isTracking]
  );

  const handleEnter: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (prefersReducedMotion || orientation.isTracking) return;
      const card = e.currentTarget;
      card.style.transition = 'transform 150ms ease-out';
    },
    [prefersReducedMotion, orientation.isTracking]
  );

  const handleLeave: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      // Don't reset transform on mobile when orientation is active
      if (orientation.isTracking) return;

      const card = e.currentTarget;
      card.style.transition = 'transform 200ms ease-in';
      card.style.transform = '';
    },
    [orientation.isTracking]
  );

  // Handler for permission button
  const handleEnableMotion = useCallback(async () => {
    await requestOrientationPermission();
  }, [requestOrientationPermission]);

  return (
    <section className="py-10 md:py-20 px-4 md:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent_50%)]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-8 text-center md:text-left">
          <AnimatedSectionTitle
            text={t.skills}
            className="justify-center md:justify-start"
            wrapperClassName="text-center md:text-left"
          />
          <p className="text-base text-gray-600 dark:text-gray-300">{t.skillsDescription}</p>
        </div>

        {/* Mobile motion enable button - shown only when permission is required and not yet granted */}
        {orientation.isMobileDevice &&
          orientation.permissionRequired &&
          !orientation.permissionGranted && (
            <div className="mb-6 flex justify-center">
              <button
                onClick={handleEnableMotion}
                className="group/btn flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                aria-label={t.enableMotion || 'Enable motion effects'}
              >
                <Smartphone
                  size={20}
                  className="group-hover/btn:rotate-12 transition-transform duration-200"
                />
                <span>{t.enableMotion || 'Enable motion effects'}</span>
              </button>
            </div>
          )}

        {/* Motion status indicator */}
        {orientation.isTracking && (
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {t.motionActive || 'Motion tracking active'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {t.expertise.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onMouseMove={handleMove}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              className={`group relative p-8 rounded-2xl border-2 ${expertiseBgColors[index]} ${expertiseBorderColors[index]} hover:shadow-2xl transition-all duration-500 ease-out transform-gpu will-change-transform z-10`}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${expertiseColors[index]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              {/* Background icons for all cards */}
              {index === 0 && (
                <div className="absolute top-2 right-2 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
                  <Hammer size={160} className="text-blue-500/40 dark:text-blue-400/40" />
                </div>
              )}
              {index === 1 && (
                <div className="absolute top-2 right-2 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
                  <Palette size={160} className="text-purple-500/40 dark:text-purple-400/40" />
                </div>
              )}
              {index === 2 && (
                <div className="absolute top-2 right-2 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
                  <Gauge size={160} className="text-orange-500/40 dark:text-orange-400/40" />
                </div>
              )}
              {index === 3 && (
                <div className="absolute top-2 right-2 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
                  <Globe size={160} className="text-cyan-500/40 dark:text-cyan-400/40" />
                </div>
              )}
              {index === 4 && (
                <div className="absolute top-2 right-2 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
                  <Accessibility size={160} className="text-green-500/40 dark:text-green-400/40" />
                </div>
              )}
              {index === 5 && (
                <div className="absolute top-2 right-2 opacity-15 group-hover:opacity-25 transition-opacity duration-300">
                  <Server size={160} className="text-teal-500/40 dark:text-teal-400/40" />
                </div>
              )}

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 dark:border-white/20 flex items-center justify-center shadow-sm group-hover:bg-white/30 dark:group-hover:bg-white/15 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-black/25 dark:group-hover:shadow-black/60 dark:group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 relative z-20">
                    {['🎨', '🏗️', '♿'].includes(expertiseIcons[index]) ? (
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {expertiseIcons[index]}
                      </span>
                    ) : (
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        <TechIcon name={expertiseIcons[index]} size={32} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>

              {/* Glare effect */}
              <div
                className="tilt-glare pointer-events-none absolute inset-0 rounded-2xl"
                aria-hidden
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .tilt-glare {
          background: linear-gradient(
            var(--glare-rot, 0deg),
            transparent 0%,
            rgba(255, 255, 255, var(--glare-o, 0)) 50%,
            transparent 100%
          );
          background-position: var(--glare-x, 0%), var(--glare-y, 0%);
          background-size: 200% 200%;
          opacity: ${orientation.isTracking ? '1' : '0'};
          transition: opacity 0.3s ease;
        }

        .group:hover .tilt-glare {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}

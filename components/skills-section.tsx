'use client';

import { useLanguage } from '@/lib/use-language';
import { TechIcon } from './tech-icon';

const skills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js (SSR/SSG)',
  'HTML5',
  'CSS3',
  'Lit / Web Components',
  'UI/UX Design',
  'Frontend Architecture',
  'Design Systems',
  'Material UI',
  'Micro‑frontends',
  'Web Performance',
  'Accessibility (WCAG)',
  'PWA / Service Workers',
  'RWD / Mobile-First',
  'HTTP / REST',
  'Node.js / Express',
  'Bun',
  'Deno',
  'IndexedDB',
  'SQL / NoSQL',
  'Rust / WebAssembly',
  'Web Security (OWASP)',
  'FrontOps',
  'QA / Testing',
  'Automated Testing',
  'Headless CMS',
  'SEO',
  'Scratch',
];

export function SkillsSection() {
  const { t } = useLanguage();

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const handleMove: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (prefersReducedMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width; // 0..1
    const py = y / rect.height; // 0..1

    // Map to -1..1 (center is 0,0)
    const dx = px * 2 - 1;
    const dy = py * 2 - 1;

    const maxTiltDeg = 12;
    const rotateY = dx * maxTiltDeg; // left/right
    const rotateX = -dy * maxTiltDeg; // up/down (invert so top pushes back)

    card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.04)`;

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
  };

  const handleEnter: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (prefersReducedMotion) return;
    const card = e.currentTarget;
    card.style.transition = 'transform 120ms ease-out';
  };

  const handleLeave: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const card = e.currentTarget;
    card.style.transition = 'transform 180ms ease-in';
    card.style.transform = '';
    card.style.removeProperty('--glare-x');
    card.style.removeProperty('--glare-y');
    card.style.removeProperty('--glare-o');
  };

  const handleSkillClick = (skill: string) => {
    const searchQuery = skill
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/[‑–—]/g, ' ')
      .trim();

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' web')}`;
    window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-10 md:py-20 px-4 md:px-8 bg-gray-100/50 dark:bg-gray-800/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{t.skills}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <button
              key={skill}
              onClick={() => handleSkillClick(skill)}
              onMouseMove={handleMove}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              className="relative overflow-hidden shadow-lg bg-blue-100 dark:bg-blue-800 p-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors duration-200 text-left transform-gpu will-change-transform"
              aria-label={`${t.searchFor} ${skill} ${t.onGoogle}`}
            >
              <div className="relative z-10 flex items-center gap-3">
                <TechIcon name={skill} size={20} />
                <span className="font-medium text-blue-900 dark:text-white">{skill}</span>
              </div>
              <div
                className="tilt-glare pointer-events-none absolute inset-0 rounded-lg"
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { sortedTimelineData, TimelineEvent } from '@/constants/timeline';
import { ArrowLeft, Calendar, User, Code, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/use-language';
import { translations } from '@/lib/translations';
import NavigationButtons from '@/components/navigation-buttons';

export function TimelineClient() {
  const [visibleEvents, setVisibleEvents] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    setIsLoaded(true);

    // Show all events with staggered animation
    const showAllEvents = () => {
      const allEvents = new Set<number>();
      for (let i = 0; i < sortedTimelineData.length; i++) {
        allEvents.add(i);
      }
      setVisibleEvents(allEvents);
    };

    // Delay to ensure smooth animation
    setTimeout(showAllEvents, 300);
  }, []);

  const TimelineEventCard = ({
    event,
    index,
    side,
  }: {
    event: TimelineEvent;
    index: number;
    side: 'left' | 'right';
  }) => {
    const isVisible = visibleEvents.has(index);

    return (
      <div
        data-timeline-event
        data-index={index}
        className={`timeline-item ${side} ${isVisible ? 'visible' : ''}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        }}
      >
        <div className="timeline-content">
          <div className="timeline-year">
            <Calendar className="w-4 h-4" />
            <span>{event.year}</span>
          </div>

          <div className="timeline-card">
            {event.category === 'career' ? (
              // Career events: image -> text -> icon
              <>
                {event.image && (
                  <div className="timeline-image">
                    <Image
                      src={event.image}
                      alt={event.title[language]}
                      width={77}
                      height={77}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="timeline-text">
                  <h3 className="timeline-title">{event.title[language]}</h3>
                  <p className="timeline-description">{event.description[language]}</p>
                </div>
                <div className="timeline-icon">
                  <User className="w-6 h-6" />
                </div>
              </>
            ) : (
              // Technology events: icon -> text -> image
              <>
                <div className="timeline-icon">
                  <Code className="w-6 h-6" />
                </div>
                <div className="timeline-text">
                  <h3 className="timeline-title">{event.title[language]}</h3>
                  <p className="timeline-description">{event.description[language]}</p>
                </div>
                {event.image && (
                  <div className="timeline-image">
                    <Image
                      src={event.image}
                      alt={event.title[language]}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Critical CSS to prevent FOUC */}
      <style jsx global>{`
        .timeline-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981);
          transform: translateX(-50%);
          border-radius: 2px;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 3rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .timeline-item.visible {
          opacity: 1;
          transform: translateY(0);
          animation: fadeInUp 0.8s ease-out both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Staggered animation delays for all visible items */
        .timeline-item.visible:nth-child(1) {
          animation-delay: 0.1s;
        }

        .timeline-item.visible:nth-child(2) {
          animation-delay: 0.2s;
        }

        .timeline-item.visible:nth-child(3) {
          animation-delay: 0.3s;
        }

        .timeline-item.visible:nth-child(4) {
          animation-delay: 0.4s;
        }

        .timeline-item.visible:nth-child(5) {
          animation-delay: 0.5s;
        }

        .timeline-item.visible:nth-child(6) {
          animation-delay: 0.6s;
        }

        .timeline-item.visible:nth-child(7) {
          animation-delay: 0.7s;
        }

        .timeline-item.visible:nth-child(8) {
          animation-delay: 0.8s;
        }

        .timeline-item.visible:nth-child(9) {
          animation-delay: 0.9s;
        }

        .timeline-item.visible:nth-child(10) {
          animation-delay: 1s;
        }

        .timeline-item.visible:nth-child(11) {
          animation-delay: 1.1s;
        }

        .timeline-item.visible:nth-child(12) {
          animation-delay: 1.2s;
        }

        .timeline-item.visible:nth-child(13) {
          animation-delay: 1.3s;
        }

        .timeline-item.visible:nth-child(14) {
          animation-delay: 1.4s;
        }

        .timeline-item.visible:nth-child(15) {
          animation-delay: 1.5s;
        }

        .timeline-item.left {
          text-align: right;
          padding-right: 60%;
        }

        .timeline-item.right {
          text-align: left;
          padding-left: 60%;
        }

        .timeline-content {
          position: relative;
        }

        .timeline-year {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: #1f2937;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          font-weight: bold;
          font-size: 0.875rem;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 2px solid white;
          opacity: 0;
          transform: translateY(-50%) scale(0.8);
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .timeline-item.visible .timeline-year {
          opacity: 1;
          transform: translateY(-50%) scale(1);
          animation: fadeInYear 0.8s ease-out both;
        }

        /* Staggered animation delays for years */
        .timeline-item.visible:nth-child(1) .timeline-year {
          animation-delay: 0.15s;
        }

        .timeline-item.visible:nth-child(2) .timeline-year {
          animation-delay: 0.25s;
        }

        .timeline-item.visible:nth-child(3) .timeline-year {
          animation-delay: 0.35s;
        }

        .timeline-item.visible:nth-child(4) .timeline-year {
          animation-delay: 0.45s;
        }

        .timeline-item.visible:nth-child(5) .timeline-year {
          animation-delay: 0.55s;
        }

        .timeline-item.visible:nth-child(6) .timeline-year {
          animation-delay: 0.65s;
        }

        .timeline-item.visible:nth-child(7) .timeline-year {
          animation-delay: 0.75s;
        }

        .timeline-item.visible:nth-child(8) .timeline-year {
          animation-delay: 0.85s;
        }

        .timeline-item.visible:nth-child(9) .timeline-year {
          animation-delay: 0.95s;
        }

        .timeline-item.visible:nth-child(10) .timeline-year {
          animation-delay: 1.05s;
        }

        .timeline-item.visible:nth-child(11) .timeline-year {
          animation-delay: 1.15s;
        }

        .timeline-item.visible:nth-child(12) .timeline-year {
          animation-delay: 1.25s;
        }

        .timeline-item.visible:nth-child(13) .timeline-year {
          animation-delay: 1.35s;
        }

        .timeline-item.visible:nth-child(14) .timeline-year {
          animation-delay: 1.45s;
        }

        .timeline-item.visible:nth-child(15) .timeline-year {
          animation-delay: 1.55s;
        }

        @keyframes fadeInYear {
          from {
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
        }

        .timeline-item.left .timeline-year {
          right: -5rem;
        }

        .timeline-item.right .timeline-year {
          left: -5rem;
        }

        .timeline-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }

        .timeline-item.visible .timeline-card {
          opacity: 1;
          transform: translateY(0) scale(1);
          animation: fadeInCard 0.8s ease-out both;
        }

        /* Staggered animation delays for cards */
        .timeline-item.visible:nth-child(1) .timeline-card {
          animation-delay: 0.2s;
        }

        .timeline-item.visible:nth-child(2) .timeline-card {
          animation-delay: 0.3s;
        }

        .timeline-item.visible:nth-child(3) .timeline-card {
          animation-delay: 0.4s;
        }

        .timeline-item.visible:nth-child(4) .timeline-card {
          animation-delay: 0.5s;
        }

        .timeline-item.visible:nth-child(5) .timeline-card {
          animation-delay: 0.6s;
        }

        .timeline-item.visible:nth-child(6) .timeline-card {
          animation-delay: 0.7s;
        }

        .timeline-item.visible:nth-child(7) .timeline-card {
          animation-delay: 0.8s;
        }

        .timeline-item.visible:nth-child(8) .timeline-card {
          animation-delay: 0.9s;
        }

        .timeline-item.visible:nth-child(9) .timeline-card {
          animation-delay: 1s;
        }

        .timeline-item.visible:nth-child(10) .timeline-card {
          animation-delay: 1.1s;
        }

        .timeline-item.visible:nth-child(11) .timeline-card {
          animation-delay: 1.2s;
        }

        .timeline-item.visible:nth-child(12) .timeline-card {
          animation-delay: 1.3s;
        }

        .timeline-item.visible:nth-child(13) .timeline-card {
          animation-delay: 1.4s;
        }

        .timeline-item.visible:nth-child(14) .timeline-card {
          animation-delay: 1.5s;
        }

        .timeline-item.visible:nth-child(15) .timeline-card {
          animation-delay: 1.6s;
        }

        @keyframes fadeInCard {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .timeline-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .timeline-item.left .timeline-card {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
        }

        .timeline-item.right .timeline-card {
          background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);
          color: white;
        }

        .timeline-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .timeline-text {
          flex: 1;
        }

        .timeline-title {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .timeline-description {
          font-size: 0.875rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .timeline-image {
          width: 6rem;
          height: 6rem;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .timeline-image:hover {
          transform: scale(2.3);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          z-index: 10;
          position: relative;
        }

        .timeline-image img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          transition: transform 0.3s ease;
        }

        /* Dark mode styles */
        .dark .timeline-card {
          background: linear-gradient(135deg, #1f2937 0%, #293d53 100%);
          border-color: #374151;
        }

        .dark .timeline-item.left .timeline-card {
          background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
        }

        .dark .timeline-item.right .timeline-card {
          background: linear-gradient(135deg, #be185d 0%, #d97706 100%);
        }

        .dark .timeline-year {
          background: linear-gradient(135deg, #111827 0%, #293d53 100%);
          border-color: #374151;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .timeline-line {
            left: 1.25rem;
          }

          .timeline-item.left,
          .timeline-item.right {
            text-align: left;
            padding-left: 4rem;
            padding-right: 1rem;
          }

          .timeline-item.left .timeline-year,
          .timeline-item.right .timeline-year {
            left: -3rem;
            right: auto;
          }

          .timeline-card {
            padding: 1.5rem;
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .timeline-text {
            order: 1;
          }

          .timeline-icon {
            order: 2;
          }

          .timeline-image {
            order: 3;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400/20 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-pink-400/40 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-red-400/30 rounded-full animate-pulse delay-3000"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-blue-400/50 rounded-full animate-pulse delay-4000"></div>
          <div className="absolute top-3/4 right-1/2 w-2 h-2 bg-purple-400/25 rounded-full animate-pulse delay-5000"></div>
        </div>
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Desktop version */}
                <Link
                  href="/"
                  className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {t.timelineBackToHome}
                </Link>
                {/* Mobile version */}
                <Link
                  href="/"
                  className="md:hidden flex items-center justify-center w-10 h-10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Home className="w-5 h-5" />
                </Link>
                {/* Desktop title */}
                <h1 className="hidden md:block text-2xl font-bold text-gray-900 dark:text-white">
                  {t.timelineTitle} ({sortedTimelineData.length} {t.timelineEventsCount})
                </h1>
                {/* Mobile title */}
                <h1 className="md:hidden text-xl font-bold text-gray-900 dark:text-white">
                  Timeline
                </h1>
              </div>
              <NavigationButtons showLanguageSwitcher showThemeSwitcher />
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="timeline-container">
          <div className="timeline-line"></div>

          {sortedTimelineData.map((event, index) => (
            <TimelineEventCard
              key={`${event.category}-${event.year}-${index}`}
              event={event}
              index={index}
              side={event.category === 'career' ? 'left' : 'right'}
            />
          ))}
        </div>
      </div>
    </>
  );
}

'use client';

import Image from 'next/image';
import { Palette, Users, Bike, Mail, ChevronLeft, ChevronRight, Car } from 'lucide-react';
import { useLanguage } from '@/lib/use-language';
import { useState, useRef } from 'react';

export function FunActivitiesSection() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [carRunKey, setCarRunKey] = useState<number>(0);
  const [isCarRunning, setIsCarRunning] = useState(false);

  const activities = [
    {
      id: 'art',
      title: t.artTitle,
      description: t.artDesc,
      icon: Palette,
      color: 'text-pink-400',
      href: 'https://arturbasak.artstation.com',
      isExternal: true,
      images: [
        {
          src: '/art-gallery.png',
          alt: 'Art gallery exhibition featuring fantasy illustrations and mythological characters',
        },
      ],
    },
    {
      id: 'stamps',
      title: t.stampsTitle,
      description: t.stampsDesc,
      icon: Mail,
      color: 'text-blue-600',
      href: 'https://zubry.by',
      isExternal: true,
      images: [
        {
          src: 'https://www.zubry.by/assets/pics/slide1.jpg',
          alt: 'Bison stamps and postal items collection',
        },
      ],
    },
    {
      id: 'kids',
      title: t.kidsTitle,
      description: t.kidsDesc,
      icon: Users,
      color: 'text-orange-400',
      images: [{ src: '/scratch.jpg', alt: 'Kids Programming' }],
    },
    {
      id: 'cycling',
      title: t.cycleTitle,
      description: t.cycleDesc,
      icon: Bike,
      color: 'text-green-500',
      images: [{ src: '/cycling.jpg', alt: 'Cycling family trip' }],
    },
    {
      id: 'batmobiles',
      title: t.batmobileTitle,
      description: t.batmobileDesc,
      icon: Car,
      color: 'text-indigo-600',
      images: [{ src: '/batman.jpg', alt: 'Batmobiles collection inspired by DC Comics' }],
    },
  ];

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.scrollWidth / activities.length;
      scrollRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth',
      });
      setCurrentSlide(index);
    }
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % activities.length;
    scrollToSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + activities.length) % activities.length;
    scrollToSlide(prev);
  };

  return (
    <section className="py-10 md:py-20 bg-gray-100/50 dark:bg-gray-800/50 overflow-hidden relative">
      {/* Title */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mb-12">
        <h2 className="text-3xl font-bold text-center">{t.funActivities}</h2>
      </div>

      {/* Racing car overlay */}
      <div className="pointer-events-none absolute inset-0 top-2.5" aria-hidden="true">
        {isCarRunning && (
          // key forces reflow so animation can retrigger on each hover
          <div
            key={carRunKey}
            className="absolute bottom-8 animate-race-left"
            style={{ left: '50%', bottom: '-20px' }}
            onAnimationEnd={() => setIsCarRunning(false)}
          >
            <img
              src="/batmobile.png"
              alt="bemobile"
              className="w-56 md:w-64 h-auto"
              style={{
                transform: 'translateX(-50%)',
                filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))',
              }}
            />
          </div>
        )}
      </div>

      {/* Carousel Container - extends beyond main layout */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label="Previous activity"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label="Next activity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            const CardContent = (
              <div
                className="min-w-[280px] md:min-w-[340px] lg:min-w-[380px] h-[420px] md:h-[450px] bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden snap-center group"
                onClick={
                  activity.id === 'batmobiles'
                    ? () => {
                        setCarRunKey(Date.now());
                        setIsCarRunning(true);
                      }
                    : undefined
                }
              >
                <div className="p-6 md:p-8 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 ${activity.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                      {activity.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm md:text-base">
                    {activity.description}
                  </p>

                  {/* Images */}
                  <div
                    className={`grid gap-3 flex-1 ${activity.images.length === 4 ? 'grid-cols-2' : 'grid-cols-1'}`}
                  >
                    {activity.images.map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={activity.images.length === 4 ? 300 : 500}
                          height={activity.images.length === 4 ? 300 : 350}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          priority={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );

            return activity.href ? (
              <a
                key={activity.id}
                href={activity.href}
                target={activity.isExternal ? '_blank' : '_self'}
                rel={activity.isExternal ? 'noopener noreferrer' : undefined}
                className="block hover:scale-[1.02] transition-transform duration-300"
              >
                {CardContent}
              </a>
            ) : (
              <div key={activity.id} className="block">
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes race-left {
          0% {
            transform: translateX(60vw);
          }
          40% {
            transform: translateX(0);
          }
          64% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-110vw);
          }
        }
        .animate-race-left {
          /* 2.5s движения + 0.8s пауза на середине = 3.3s */
          animation: race-left 3.3s linear both;
        }
      `}</style>
    </section>
  );
}

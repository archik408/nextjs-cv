'use client';

import Image from 'next/image';
import { Palette, Users, Bike, Mail, ChevronLeft, ChevronRight, Car } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { useState, useRef } from 'react';
import { AnimatedSectionTitle } from '@/components/animated-section-title';

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
          src: '/art-gallery.webp',
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
      href: '/garden?tag=дети',
      isExternal: false,
      images: [{ src: '/scratch.webp', alt: 'Kids Programming' }],
    },
    {
      id: 'cycling',
      title: t.cycleTitle,
      description: t.cycleDesc,
      icon: Bike,
      color: 'text-green-500',
      images: [{ src: '/cycling.webp', alt: 'Cycling family trip' }],
    },
    {
      id: 'batmobiles',
      title: t.batmobileTitle,
      description: t.batmobileDesc,
      icon: Car,
      color: 'text-indigo-600',
      images: [{ src: '/batman.webp', alt: 'Batmobiles collection inspired by DC Comics' }],
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
    <section className="py-10 md:py-20 bg-gray-100/50 dark:bg-gray-800/50 relative">
      {/* Title */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mb-12 text-center">
        <AnimatedSectionTitle
          text={t.funActivities}
          className="justify-center"
          wrapperClassName="text-center"
        />
        <p className="mt-4 max-w-3xl mx-auto text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {t.funActivitiesIntro}
        </p>
      </div>

      {/* Racing car overlay */}
      <div
        className="pointer-events-none absolute inset-0 top-2.5 overflow-hidden"
        aria-hidden="true"
      >
        {isCarRunning && (
          // key forces reflow so animation can retrigger on each hover
          <div
            key={carRunKey}
            className="absolute bottom-8 animate-race-left"
            style={{ left: '50%', bottom: '-20px' }}
            onAnimationEnd={() => setIsCarRunning(false)}
          >
            <img
              src="/batmobile.webp"
              alt=""
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
          aria-label={`${t.previous} ${t.activity}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          aria-label={`${t.next} ${t.activity}`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-8 py-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            const CardContent = (
              <div
                className="h-[480px] md:h-[520px] w-full bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden snap-center group"
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
                          alt={activity.title}
                          width={activity.images.length === 4 ? 300 : 500}
                          height={activity.images.length === 4 ? 300 : 350}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          priority={false}
                        />
                        {activity.id === 'art' && (
                          <div
                            className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-5 items-center justify-center gap-1.5 bg-black px-2"
                            aria-hidden="true"
                          >
                            <img
                              src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='35' height='32' fill='none' viewBox='0 0 35 32'%3E%3Cpath fill='%2313AFF0' fill-rule='evenodd' d='M35 24.354c0-.704-.208-1.36-.565-1.91L22.937 2.525A3.54 3.54 0 0 0 19.813.652h-6.077l17.76 30.666 2.8-4.833c.553-.925.704-1.334.704-2.131m-35-.037 2.956 5.093h.001a3.54 3.54 0 0 0 3.157 1.938h19.624l-4.072-7.03zM10.832 5.621l7.938 13.701H2.893z' clip-rule='evenodd'/%3E%3C/svg%3E"
                              alt=""
                              width={14}
                              height={12}
                              className="shrink-0"
                            />
                            <span className="text-xs font-medium leading-none tracking-wide text-white">
                              ArtStation
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );

            const itemClassName =
              'block w-[280px] md:w-[340px] lg:w-[380px] shrink-0 rounded-xl transition-transform duration-300';

            return activity.href ? (
              <a
                key={activity.id}
                href={activity.href}
                target={activity.isExternal ? '_blank' : '_self'}
                rel={activity.isExternal ? 'noopener noreferrer' : undefined}
                className={`${itemClassName} hover:z-10 hover:scale-[1.02]`}
              >
                {CardContent}
              </a>
            ) : (
              <div key={activity.id} className={itemClassName}>
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

'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import { AnimatedSectionTitle } from '@/components/animated-section-title';

export function TestimonialsSection() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === t.testimonials.length - 1 ? 0 : prevIndex + 1));
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [t.testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? t.testimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === t.testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <section className="py-10 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <AnimatedSectionTitle text={t.testimonialsTitle} className="justify-center" />
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-none">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {t.testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 p-8 md:p-12">
                  <div className="max-w-4xl mx-auto text-center">
                    <Quote className="w-12 h-12 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
                    <blockquote
                      className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 ps-8 pe-8 italic"
                      dangerouslySetInnerHTML={{ __html: `"${testimonial.content}"` }}
                    />
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h4 className="font-semibold text-xl text-blue-600 dark:text-blue-400 mb-1">
                        {testimonial.name}
                      </h4>
                      <h5 className="text-gray-900 dark:text-white  font-medium">
                        {testimonial.role}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label={`${t.previous} ${t.testimonial}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label={`${t.next} ${t.testimonial}`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {t.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-6 h-6 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-blue-600 dark:bg-blue-400 scale-110'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`${t.goTo} ${t.testimonial} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

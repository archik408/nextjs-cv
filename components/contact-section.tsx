'use client';

import { Mail, Linkedin } from 'lucide-react';
import { useLanguage } from '@/lib/hooks/use-language';
import Player from '@/components/lottie-player';
import { AnimatedSectionTitle } from '@/components/animated-section-title';

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section className="pt-20 pb-4 px-4 md:px-8 bg-gray-400/50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <AnimatedSectionTitle
            text={t.contact}
            className="justify-center md:justify-start"
            wrapperClassName="text-center md:text-left"
          />
          <p
            className="text-gray-700 dark:text-gray-300 mb-8"
            dangerouslySetInnerHTML={{ __html: t.contactText }}
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="mailto:artur.basak.devingrodno@gmail.com"
              className="shadow-lg inline-flex items-center justify-center px-6 py-3 bg-blue-100 dark:bg-blue-800 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors transform hover:scale-105 duration-200 font-medium text-blue-900 dark:text-white"
            >
              {t.contactButton} <Mail className="w-4 h-4 ml-2" />
            </a>
            <a
              href="https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=arturbasak"
              target="_blank"
              rel="noopener noreferrer"
              className="shadow-lg inline-flex items-center justify-center px-6 py-3 bg-[#0077b5] hover:bg-[#005885] rounded-lg transition-colors transform hover:scale-105 duration-200 font-medium text-white"
            >
              {t.followOnLinkedIn} <Linkedin className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>

        <Player
          autoplay
          loop
          src="/email-lottie.json"
          fallbackSrc="/email-lottie.png"
          fallbackAlt={t.contact}
          style={{ height: '400px', width: '100%' }}
          className="pointer-events-none select-none"
        />
      </div>
    </section>
  );
}

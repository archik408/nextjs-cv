import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import { YandexWitcherPageClient } from './page-client';

export const metadata: Metadata = generateMetadata({
  title: 'Ведьмак для Матвея — текстовая игра',
  description:
    'Текстовый интерфейс навыка Яндекс Станции «Ведьмак для Матвея»: начните охоту, выбирайте ответы и следите за сессией.',
  keywords: 'Яндекс Станция, Алиса, Ведьмак, текстовая игра, навык Алисы',
  path: '/yandex-witcher',
  locale: 'ru',
});

export default function YandexWitcherPage() {
  return <YandexWitcherPageClient />;
}

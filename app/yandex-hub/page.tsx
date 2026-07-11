import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import { YandexHubPageClient } from './page-client';

export const metadata: Metadata = generateMetadata({
  title: 'Мой Микробит — текстовый режим',
  description:
    'Текстовый интерфейс навыка Яндекс Станции «Мой Микробит»: сессии, команды и ответы Алисы в браузере.',
  keywords: 'Яндекс Станция, Алиса, Микробит, текстовый чат, навык Алисы',
  path: '/yandex-hub',
  locale: 'ru',
});

export default function YandexHubPage() {
  return <YandexHubPageClient />;
}

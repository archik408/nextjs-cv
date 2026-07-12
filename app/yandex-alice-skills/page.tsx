import type { Metadata } from 'next';
import { YandexAliceSkillsPageClient } from './page-client';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Навыки для Яндекс Станции Алиса',
  description:
    'Текстовый интерфейс навыков Яндекс Станции «Мой Микробит» и «Ведьмак для Матвея» с выбором навыка прямо в чате.',
  keywords: 'Яндекс Станция, Алиса, Микробит, Ведьмак, текстовый чат, навыки Алисы',
  path: '/yandex-alice-skills',
  locale: 'ru',
});

export default function YandexAliceSkillsPage() {
  return <YandexAliceSkillsPageClient />;
}

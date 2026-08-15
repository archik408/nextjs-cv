import { listGardenNotes } from '@/lib/garden';
import GardenSectionClient from '@/components/garden-section-client';

export function GardenSection() {
  // RU: latest notes as before. EN: all available English translations.
  const ruNotes = listGardenNotes({ locale: 'ru' }).slice(0, 4);
  const enNotes = listGardenNotes({ locale: 'en' });
  return <GardenSectionClient ruNotes={ruNotes} enNotes={enNotes} />;
}

export default GardenSection;

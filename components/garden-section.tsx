import { listGardenNotes } from '@/lib/garden';
import GardenSectionClient from '@/components/garden-section-client';

export function GardenSection() {
  const ruNotes = listGardenNotes({ locale: 'ru' }).slice(0, 4);
  const enNotes = listGardenNotes({ locale: 'en' }).slice(0, 4);
  return <GardenSectionClient ruNotes={ruNotes} enNotes={enNotes} />;
}

export default GardenSection;

import { getHomepageGardenNotes } from '@/lib/garden';
import GardenSectionClient from '@/components/garden-section-client';

export function GardenSection() {
  const ruNotes = getHomepageGardenNotes('ru');
  const enNotes = getHomepageGardenNotes('en');
  return <GardenSectionClient ruNotes={ruNotes} enNotes={enNotes} />;
}

export default GardenSection;

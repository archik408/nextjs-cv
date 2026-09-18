import { getLatestGardenNotes } from '@/lib/garden';
import GardenSectionClient from '@/components/garden-section-client';

export function GardenSection() {
  const ruNotes = getLatestGardenNotes('ru', 6);
  const enNotes = getLatestGardenNotes('en', 6);
  return <GardenSectionClient ruNotes={ruNotes} enNotes={enNotes} />;
}

export default GardenSection;

import { listGardenNotes } from '@/lib/garden';
import GardenSectionClient from '@/components/garden-section-client';

export function GardenSection() {
  const notes = listGardenNotes().slice(0, 4);
  return <GardenSectionClient notes={notes} />;
}

export default GardenSection;

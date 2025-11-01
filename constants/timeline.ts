import { timelineDataRu } from './timeline-ru';
import { timelineDataEn } from './timeline-en';

export interface TimelineEvent {
  year: number;
  title: {
    ru: string;
    en: string;
  };
  description: {
    ru: string;
    en: string;
  };
  image?: string;
  category: 'career' | 'technology';
}

// Combine Russian and English data
export const timelineData: TimelineEvent[] = timelineDataRu.map((ruEvent, index) => {
  const enEvent = timelineDataEn[index];
  return {
    year: ruEvent.year,
    title: {
      ru: ruEvent.title,
      en: enEvent.title,
    },
    description: {
      ru: ruEvent.description,
      en: enEvent.description,
    },
    image: ruEvent.image,
    category: ruEvent.category,
  };
});

// Sort timeline data by year and alternate between career and technology events
export const sortedTimelineData = (() => {
  // First, sort by year
  const sortedByYear = timelineData.sort((a, b) => a.year - b.year);

  // Group events by year
  const eventsByYear: { [year: number]: TimelineEvent[] } = {};
  sortedByYear.forEach((event) => {
    if (!eventsByYear[event.year]) {
      eventsByYear[event.year] = [];
    }
    eventsByYear[event.year].push(event);
  });

  // Interleave events within each year (career and technology alternate)
  const result: TimelineEvent[] = [];
  const sortedYears = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => a - b);

  sortedYears.forEach((year) => {
    const yearEvents = eventsByYear[year];
    const careerEvents = yearEvents.filter((e) => e.category === 'career');
    const techEvents = yearEvents.filter((e) => e.category === 'technology');

    // Alternate between career and technology events
    const maxLength = Math.max(careerEvents.length, techEvents.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < careerEvents.length) {
        result.push(careerEvents[i]);
      }
      if (i < techEvents.length) {
        result.push(techEvents[i]);
      }
    }
  });

  return result;
})();

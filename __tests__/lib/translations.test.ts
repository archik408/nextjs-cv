import { translations } from '@/lib/translations';
import { ELanguage } from '@/constants/enums';

describe('Translations', () => {
  describe('English translations', () => {
    const enTranslations = translations[ELanguage.en];

    it('has required properties', () => {
      expect(enTranslations).toHaveProperty('role');
      expect(enTranslations).toHaveProperty('subtitle');
      expect(enTranslations).toHaveProperty('experience');
      expect(enTranslations).toHaveProperty('garden');
      expect(enTranslations).toHaveProperty('certificates');
    });

    it('has garden as string', () => {
      expect(typeof enTranslations.garden).toBe('string');
      expect(enTranslations.garden.length).toBeGreaterThan(0);
    });

    it('has certificates as string', () => {
      expect(typeof enTranslations.certificates).toBe('string');
      expect(enTranslations.certificates.length).toBeGreaterThan(0);
    });
  });

  describe('Russian translations', () => {
    const ruTranslations = translations[ELanguage.ru];

    it('has required properties', () => {
      expect(ruTranslations).toHaveProperty('role');
      expect(ruTranslations).toHaveProperty('subtitle');
      expect(ruTranslations).toHaveProperty('experience');
      expect(ruTranslations).toHaveProperty('garden');
      expect(ruTranslations).toHaveProperty('certificates');
    });

    it('has garden as string', () => {
      expect(typeof ruTranslations.garden).toBe('string');
      expect(ruTranslations.garden.length).toBeGreaterThan(0);
    });

    it('has certificates as string', () => {
      expect(typeof ruTranslations.certificates).toBe('string');
      expect(ruTranslations.certificates.length).toBeGreaterThan(0);
    });
  });

  describe('Language consistency', () => {
    it('has consistent structure between languages', () => {
      const enTranslations = translations[ELanguage.en];
      const ruTranslations = translations[ELanguage.ru];

      // Check that both languages have the same properties
      const enKeys = Object.keys(enTranslations).sort();
      const ruKeys = Object.keys(ruTranslations).sort();

      expect(enKeys).toEqual(ruKeys);
    });
  });
});

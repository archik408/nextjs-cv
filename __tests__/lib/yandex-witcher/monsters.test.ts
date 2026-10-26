import { createEncounter, loadWitcherMonsters } from '@/lib/yandex-witcher/monsters';

describe('witcher monsters bestiary', () => {
  let randomSpy: jest.SpyInstance;

  beforeEach(() => {
    randomSpy = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  it('loads a rich bestiary with the easter egg monster', async () => {
    const monsters = await loadWitcherMonsters();

    expect(monsters.length).toBeGreaterThan(220);
    const unbeatable = monsters.filter((monster) => monster.unbeatable === true);
    expect(unbeatable).toHaveLength(1);
    expect(unbeatable[0].name).toBe("Гюнтер о'Дим");
  });

  it('spawns the unbeatable monster on a lucky roll', async () => {
    randomSpy.mockReturnValue(0);

    const encounter = await createEncounter([]);

    expect(encounter.unbeatable).toBe(true);
    expect(encounter.monsterName).toBe("Гюнтер о'Дим");
    expect(encounter.options).toHaveLength(3);
  });

  it('spawns a regular monster otherwise', async () => {
    randomSpy.mockReturnValue(0.99);

    const encounter = await createEncounter([]);

    expect(encounter.unbeatable).toBe(false);
    expect(encounter.options).toHaveLength(3);
  });

  it('avoids recently met monsters', async () => {
    randomSpy.mockReturnValue(0.99);
    const monsters = await loadWitcherMonsters();
    const recentNames = monsters.slice(0, 10).map((monster) => monster.name);

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const encounter = await createEncounter(recentNames);
      expect(recentNames).not.toContain(encounter.monsterName);
    }
  });

  it('never offers the easter egg weakness in regular fights', async () => {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const encounter = await createEncounter([]);
      expect(encounter.options).not.toContain('Точное исполнение контракта');
    }
  });
});

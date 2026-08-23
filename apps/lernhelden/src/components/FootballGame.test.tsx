import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {createProfile} from '@lernhelden/engine';
import {PlatformHome, readRoute} from '../App';
import {fractionsAdventure} from '../adventures/fractions';
import {FootballGame} from './FootballGame';

describe('isolated football integration', () => {
  const originalMatchMedia = window.matchMedia;
  const originalLocalStorage = globalThis.localStorage;
  const memoryStorage = (): Storage => {
    const entries = new Map<string, string>();
    return {
      get length() { return entries.size; },
      clear: () => entries.clear(),
      getItem: key => entries.get(key) ?? null,
      key: index => Array.from(entries.keys())[index] ?? null,
      removeItem: key => { entries.delete(key); },
      setItem: (key, value) => { entries.set(key, String(value)); },
    };
  };

  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {configurable: true, writable: true, value: memoryStorage()});
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      imageSmoothingEnabled: false,
      fillStyle: '',
      font: '',
      textAlign: 'center',
      textBaseline: 'middle',
    } as unknown as CanvasRenderingContext2D);
    localStorage.clear();
    sessionStorage.clear();
    location.hash = '';
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn()}),
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
    Object.defineProperty(window, 'matchMedia', {configurable: true, writable: true, value: originalMatchMedia});
    Object.defineProperty(globalThis, 'localStorage', {configurable: true, writable: true, value: originalLocalStorage});
  });

  it('offers football as a fourth beta game and resolves its own hash route', () => {
    const {container} = render(<PlatformHome profile={createProfile('Testheld')}/>);
    expect(container.querySelectorAll('.adventure-card')).toHaveLength(4);
    expect(screen.getByRole('heading', {name: 'Mathe Fußball'})).toBeVisible();
    expect(screen.getByText('Beta')).toBeVisible();

    fireEvent.click(screen.getByRole('button', {name: /Match starten/}));
    expect(location.hash).toBe('#/football');
    expect(readRoute()).toEqual({screen: 'football'});
  });

  it('keeps football difficulty local without replacing the fraction provider', () => {
    const originalNext = fractionsAdventure.questionProvider.next;
    vi.spyOn(Math, 'random').mockReturnValue(.9);
    const {container, unmount} = render(<FootballGame/>);
    const additionRow = screen.getByText('Addition').closest('.football-difficulty-row');
    expect(additionRow).not.toBeNull();
    fireEvent.click(within(additionRow as HTMLElement).getByRole('button', {name: 'Schwer'}));
    fireEvent.click(screen.getByRole('button', {name: /^Passspiel/}));

    expect(container.querySelector('.football-question-meta span')?.textContent).toMatch(/^Ungleichnamige/);
    expect(fractionsAdventure.questionProvider.next).toBe(originalNext);
    unmount();
    expect(fractionsAdventure.questionProvider.next).toBe(originalNext);
  });

  it('shows the correct solution and rewards a completed match only in football storage', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    localStorage.setItem('lernhelden:adventure:fractions:v1', 'unchanged');
    const {container} = render(<FootballGame/>);
    fireEvent.click(screen.getByRole('button', {name: /^Passspiel/}));

    for (let turn = 0; turn < 10; turn += 1) {
      fireEvent.click(container.querySelector<HTMLButtonElement>('.football-action-grid button')!);
      fireEvent.click(container.querySelector<HTMLButtonElement>('.football-tactic-grid button')!);
      fireEvent.change(screen.getByLabelText('Zähler'), {target: {value: '999'}});
      fireEvent.change(screen.getByLabelText('Nenner'), {target: {value: '998'}});
      fireEvent.click(screen.getByRole('button', {name: 'Spielzug ausführen'}));
      if (turn === 0) expect(screen.getByRole('status')).toHaveTextContent(/Richtig wäre/);
      await act(async () => { vi.advanceTimersByTime(400); });
    }

    expect(screen.getByText('Abpfiff')).toBeVisible();
    expect(JSON.parse(localStorage.getItem('lernhelden:football:v1')!)).toMatchObject({matches: 1, wins: 0});
    expect(JSON.parse(localStorage.getItem('lernhelden:football:club:v1')!).coins).toBe(20);
    expect(localStorage.getItem('lernhelden:adventure:fractions:v1')).toBe('unchanged');
  });
});

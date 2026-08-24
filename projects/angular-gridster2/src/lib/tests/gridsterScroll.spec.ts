import type { MockInstance } from 'vitest';

import { DirTypes } from '../gridsterConfig';
import { GridsterResizeEventType } from '../gridsterResizeEventType';

// mirrors the `intervalDuration` constant of gridsterScroll
const frameDuration = 40;
const scrollSensitivity = 30;
const scrollSpeed = 20;
const gridWidth = 500;
const gridHeight = 300;

let cancelScroll: typeof import('../gridsterScroll').cancelScroll;
let scroll: typeof import('../gridsterScroll').scroll;
let requestAnimationFrame: MockInstance<(callback: FrameRequestCallback) => number>;
let frameCallbacks: FrameRequestCallback[] = [];

describe('gridsterScroll', () => {
  beforeAll(async () => {
    requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => frameCallbacks.push(callback));
    // gridsterScroll captures `requestAnimationFrame` when it is loaded, so the spy has to be installed first
    ({ cancelScroll, scroll } = await import('../gridsterScroll'));
  });

  afterEach(() => {
    cancelScroll();
    frameCallbacks = [];
    requestAnimationFrame.mockClear();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('vertical', () => {
    it('should not scroll when the pointer is away from the vertical edges', () => {
      const gridster = createGridster();

      scroll(gridster as never, mouseEvent({ clientY: 150 }), lastMouse(), vi.fn());

      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should scroll down when the pointer is near the bottom edge', () => {
      const gridster = createGridster();

      scroll(gridster as never, mouseEvent({ clientY: 295 }), lastMouse(), vi.fn());
      runScrollFrame();

      expect(gridster.el.scrollTop).toBe(scrollSpeed);
    });

    // regression guard for #1012: the trigger must depend on the pointer only, never on the
    // dragged item size, otherwise an item taller than the grid always scrolls downwards
    it('should scroll up when the pointer is near the top edge', () => {
      const gridster = createGridster({ scrollTop: 100 });

      scroll(gridster as never, mouseEvent({ clientY: 5 }), lastMouse(), vi.fn());
      runScrollFrame();

      expect(gridster.el.scrollTop).toBe(100 - scrollSpeed);
    });

    it('should not scroll up when the grid is already scrolled to the top', () => {
      const gridster = createGridster({ scrollTop: 0 });

      scroll(gridster as never, mouseEvent({ clientY: 5 }), lastMouse(), vi.fn());

      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should keep scrolling down while the pointer is dragged below the grid', () => {
      const gridster = createGridster();

      scroll(gridster as never, mouseEvent({ clientY: gridHeight + 600 }), lastMouse(), vi.fn());
      runScrollFrame();

      expect(gridster.el.scrollTop).toBe(scrollSpeed);
    });

    it('should keep scrolling up while the pointer is dragged above the grid', () => {
      const gridster = createGridster({ scrollTop: 100 });

      scroll(gridster as never, mouseEvent({ clientY: -50 }), lastMouse(), vi.fn());
      runScrollFrame();

      expect(gridster.el.scrollTop).toBe(100 - scrollSpeed);
    });

    it('should not scroll when disableScrollVertical is set', () => {
      const gridster = createGridster({ disableScrollVertical: true });

      scroll(gridster as never, mouseEvent({ clientY: 295 }), lastMouse(), vi.fn());

      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should not scroll down while resizing from a handle that cannot grow south', () => {
      const gridster = createGridster();

      scroll(gridster as never, mouseEvent({ clientY: 295 }), lastMouse(), vi.fn(), true, resizeType({ north: true }));

      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should not start a second animation while a scroll is already running', () => {
      const gridster = createGridster();

      scroll(gridster as never, mouseEvent({ clientY: 295 }), lastMouse(), vi.fn());
      scroll(gridster as never, mouseEvent({ clientY: 296 }), lastMouse(), vi.fn());

      expect(requestAnimationFrame).toHaveBeenCalledOnce();
    });

    it('should cancel the running scroll once the pointer moves away from the edge', () => {
      const gridster = createGridster();

      scroll(gridster as never, mouseEvent({ clientY: 295 }), lastMouse(), vi.fn());
      scroll(gridster as never, mouseEvent({ clientY: 150 }), lastMouse({ clientY: 295 }), vi.fn());
      // a cancelled scroll has to be restartable, a still running one would be skipped
      scroll(gridster as never, mouseEvent({ clientY: 295 }), lastMouse({ clientY: 150 }), vi.fn());

      expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
    });
  });

  describe('horizontal', () => {
    it('should not scroll when the pointer is away from the horizontal edges', () => {
      const gridster = createGridster({ scrollLeft: 100 });

      scroll(gridster as never, mouseEvent({ clientX: 250 }), lastMouse(), vi.fn());

      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should scroll towards the end when the pointer is near the right edge', () => {
      const gridster = createGridster();

      scroll(gridster as never, mouseEvent({ clientX: 495 }), lastMouse(), vi.fn());
      runScrollFrame();

      expect(gridster.el.scrollLeft).toBe(scrollSpeed);
    });

    it('should scroll towards the start when the pointer is near the left edge', () => {
      const gridster = createGridster({ scrollLeft: 100 });

      scroll(gridster as never, mouseEvent({ clientX: 5 }), lastMouse(), vi.fn());
      runScrollFrame();

      expect(gridster.el.scrollLeft).toBe(100 - scrollSpeed);
    });

    it('should not scroll towards the start when the grid is already scrolled to the start', () => {
      const gridster = createGridster({ scrollLeft: 0 });

      scroll(gridster as never, mouseEvent({ clientX: 5 }), lastMouse(), vi.fn());

      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should not scroll when disableScrollHorizontal is set', () => {
      const gridster = createGridster({ disableScrollHorizontal: true });

      scroll(gridster as never, mouseEvent({ clientX: 495 }), lastMouse(), vi.fn());

      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe('horizontal in RTL', () => {
    // in RTL the inline end is the physical left edge, so that is where the forward scroll starts
    it('should scroll towards the end when the pointer is near the left edge', () => {
      const gridster = createGridster({ dirType: DirTypes.RTL });

      scroll(gridster as never, mouseEvent({ clientX: 5 }), lastMouse(), vi.fn());
      runScrollFrame();

      expect(gridster.el.scrollLeft).toBe(-scrollSpeed);
    });

    it('should not scroll towards the end when the pointer is near the right edge', () => {
      const gridster = createGridster({ dirType: DirTypes.RTL });

      scroll(gridster as never, mouseEvent({ clientX: 495 }), lastMouse(), vi.fn());

      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  describe('scale', () => {
    // the grid rect shrinks with the scale, but scrollSensitivity stays in unscaled grid pixels
    it('should not scroll while the unscaled distance to the edge exceeds the sensitivity', () => {
      const gridster = createGridster({ scale: 0.5 });

      // 25px away from the scaled bottom edge, which is 50px in grid pixels
      scroll(gridster as never, mouseEvent({ clientX: 125, clientY: 125 }), lastMouse(), vi.fn());

      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('should scroll once the unscaled distance to the edge is within the sensitivity', () => {
      const gridster = createGridster({ scale: 0.5 });

      // 10px away from the scaled bottom edge, which is 20px in grid pixels
      scroll(gridster as never, mouseEvent({ clientX: 125, clientY: 140 }), lastMouse(), vi.fn());
      runScrollFrame();

      expect(gridster.el.scrollTop).toBe(scrollSpeed);
    });
  });
});

interface GridsterStub {
  scrollTop?: number;
  scrollLeft?: number;
  scale?: number;
  dirType?: DirTypes;
  disableScrollVertical?: boolean;
  disableScrollHorizontal?: boolean;
}

function createGridster({
  scrollTop = 0,
  scrollLeft = 0,
  scale = 1,
  dirType = DirTypes.LTR,
  disableScrollVertical = false,
  disableScrollHorizontal = false
}: GridsterStub = {}): { el: HTMLElement } {
  const el = document.createElement('div');
  Object.defineProperties(el, {
    offsetWidth: { configurable: true, value: gridWidth },
    offsetHeight: { configurable: true, value: gridHeight },
    scrollLeft: { configurable: true, writable: true, value: scrollLeft },
    scrollTop: { configurable: true, writable: true, value: scrollTop },
    getBoundingClientRect: {
      configurable: true,
      value: () => ({ top: 0, left: 0, bottom: gridHeight * scale, right: gridWidth * scale })
    }
  });

  return {
    el,
    curRowHeight: 50,
    curColWidth: 50,
    $options: () => ({
      scrollSensitivity,
      scrollSpeed,
      scale,
      dirType,
      disableScrollVertical,
      disableScrollHorizontal,
      maxRows: 100,
      maxCols: 100,
      margin: 10
    })
  } as unknown as { el: HTMLElement };
}

function mouseEvent({ clientX = 250, clientY = 150 }: { clientX?: number; clientY?: number }): MouseEvent {
  return new MouseEvent('mousemove', { clientX, clientY });
}

function lastMouse({ clientX = 250, clientY = 150 }: { clientX?: number; clientY?: number } = {}): { clientX: number; clientY: number } {
  return { clientX, clientY };
}

function resizeType(handles: Partial<GridsterResizeEventType>): GridsterResizeEventType {
  return handles as GridsterResizeEventType;
}

function runScrollFrame(): void {
  frameCallbacks[0](0);
  frameCallbacks[1](frameDuration);
}

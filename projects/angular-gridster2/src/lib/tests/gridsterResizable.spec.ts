import { NgZone } from '@angular/core';

import { Gridster } from '../gridster';
import { GridsterItem } from '../gridsterItem';
import { GridsterResizable } from '../gridsterResizable';

describe('GridsterResizable', () => {
  interface ResizableInternals {
    directionFunction: (event: Pick<MouseEvent, 'clientX' | 'clientY'>) => void;
  }

  function createResizable() {
    const item = {
      x: 1,
      y: 1,
      cols: 2,
      rows: 2
    };
    const gridsterItem = {
      item: vi.fn(() => item),
      $item: vi.fn(() => ({ ...item })),
      setSize: vi.fn(),
      checkItemChanges: vi.fn()
    };
    const gridster = {
      dragInProgress: false
    };
    const zone = {
      run: vi.fn((callback: () => void) => callback()),
      runOutsideAngular: vi.fn((callback: () => void) => callback())
    };

    return {
      gridsterItem,
      resizable: new GridsterResizable(gridsterItem as unknown as GridsterItem, gridster as unknown as Gridster, zone as unknown as NgZone)
    };
  }

  it('ignores late move events after resize helpers are torn down', () => {
    const { resizable } = createResizable();
    const directionFunction = vi.fn();
    (resizable as unknown as ResizableInternals).directionFunction = directionFunction;
    const event = {
      clientX: 100,
      clientY: 100,
      stopPropagation: vi.fn(),
      preventDefault: vi.fn()
    };

    expect(() => resizable.dragMove(event as unknown as MouseEvent)).not.toThrow();
    expect(directionFunction).not.toHaveBeenCalled();
    expect(event.stopPropagation).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('ignores late resize callbacks after helpers are already destroyed', () => {
    const { gridsterItem, resizable } = createResizable();

    expect(() => resizable.makeResize()).not.toThrow();
    expect(() => resizable.cancelResize()).not.toThrow();
    expect(gridsterItem.setSize).not.toHaveBeenCalled();
    expect(gridsterItem.checkItemChanges).not.toHaveBeenCalled();
  });
});

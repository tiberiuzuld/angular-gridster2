import { signal } from '@angular/core';

import { GridsterEmptyCell } from '../gridsterEmptyCell';

describe('gridsterEmptyCell service', () => {
  it('keeps default-sized drop items inside max grid bounds', () => {
    const gridster: any = {
      options: signal({ scale: 1 }),
      $options: signal({
        defaultItemCols: 6,
        defaultItemRows: 3,
        emptyCellDragMaxCols: 50,
        emptyCellDragMaxRows: 50,
        enableOccupiedCellDrop: false,
        maxCols: 12,
        maxRows: 25
      }),
      el: {
        scrollLeft: 0,
        scrollTop: 0,
        getBoundingClientRect: () =>
          ({
            left: 0,
            top: 0
          }) as ClientRect
      },
      gridRenderer: {
        getLeftMargin: () => 0,
        getTopMargin: () => 0
      },
      pixelsToPositionX: (x: number, roundingMethod: (x: number) => number) => roundingMethod(x / 100),
      pixelsToPositionY: (y: number, roundingMethod: (y: number) => number) => roundingMethod(y / 100),
      checkCollision: vi.fn(() => false)
    };
    const emptyCell = new GridsterEmptyCell(gridster);
    const event = {
      clientX: 700,
      clientY: 100,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn()
    } as unknown as MouseEvent;

    const item = emptyCell.getValidItemFromEvent(event);

    expect(item).toMatchObject({ x: 6, y: 1, cols: 6, rows: 3 });
    expect(gridster.checkCollision).toHaveBeenCalledWith(item);
  });
});

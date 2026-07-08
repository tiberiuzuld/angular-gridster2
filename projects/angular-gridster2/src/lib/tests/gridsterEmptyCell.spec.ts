import { signal } from '@angular/core';

import { DirTypes } from '../gridsterConfig';
import { GridsterEmptyCell } from '../gridsterEmptyCell';

function createEmptyCell(dirType: DirTypes): GridsterEmptyCell {
  const gridster: any = {
    options: signal({ scale: 1 }),
    $options: signal({ dirType }),
    el: { scrollLeft: 0 },
    gridRenderer: {
      getLeftMargin: () => 0
    }
  };

  return new GridsterEmptyCell(gridster);
}

describe('gridsterEmptyCell service', () => {
  const rect = {
    left: 0,
    right: 400
  } as ClientRect;

  it('measures empty-cell drop positions from the left in LTR mode', () => {
    const emptyCell = createEmptyCell(DirTypes.LTR);
    const event = { clientX: 350 } as MouseEvent;

    expect(emptyCell.getPixelsX(event, rect)).toBe(350);
  });

  it('measures empty-cell drop positions from the right in RTL mode', () => {
    const emptyCell = createEmptyCell(DirTypes.RTL);
    const event = { clientX: 350 } as MouseEvent;

    expect(emptyCell.getPixelsX(event, rect)).toBe(50);
  });
});

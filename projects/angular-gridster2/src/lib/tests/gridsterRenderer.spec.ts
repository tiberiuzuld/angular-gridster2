import { Renderer2 } from '@angular/core';

import { Gridster } from '../gridster';
import { DirTypes } from '../gridsterConfig';
import { GridsterRenderer } from '../gridsterRenderer';

function createRenderer() {
  return {
    setStyle: vi.fn()
  } as unknown as Renderer2;
}

describe('GridsterRenderer', () => {
  it('orders mobile items by their grid position', () => {
    const gridster = {
      mobile: true,
      curWidth: 600,
      columns: 12,
      $options: () => ({
        keepFixedHeightInMobile: false,
        keepFixedWidthInMobile: false,
        fixedColWidth: 100,
        fixedRowHeight: 100,
        margin: 10,
        useTransformPositioning: true,
        dirType: DirTypes.LTR
      })
    } as unknown as Gridster;
    const renderer = createRenderer();
    const el = document.createElement('gridster-item');

    new GridsterRenderer(gridster).updateItem(el, { x: 2, y: 3, cols: 1, rows: 1 }, renderer);

    expect(renderer.setStyle).toHaveBeenCalledWith(el, 'order', 38);
  });
});

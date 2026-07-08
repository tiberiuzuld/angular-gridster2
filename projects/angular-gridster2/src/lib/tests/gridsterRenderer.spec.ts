import { signal } from '@angular/core';

import { GridsterRenderer } from '../gridsterRenderer';

describe('gridsterRenderer service', () => {
  it('keeps display grid rows inside the usable width without outer margin', () => {
    const gridster: any = {
      $options: signal({
        margin: 20,
        outerMargin: false,
        useTransformPositioning: true
      }),
      gridColumns: new Array(24),
      curColWidth: 25,
      curRowHeight: 61
    };
    const renderer = new GridsterRenderer(gridster);

    expect(renderer.getGridRowStyle(0).width).toBe('580px');
  });
});

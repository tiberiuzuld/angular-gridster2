import { ChangeDetectorRef, NgZone } from '@angular/core';

import { Gridster } from '../gridster';
import { GridsterDraggable } from '../gridsterDraggable';
import { GridsterItem } from '../gridsterItem';

describe('gridsterDraggable service', () => {
  it('should reset drag position fields when a drag is cancelled', () => {
    const renderedItem = { x: 4, y: 5 };
    const sourceItem = { x: 1, y: 2 };
    const gridsterItem = {
      $item: () => renderedItem,
      item: () => sourceItem,
      setSize: vi.fn()
    } as unknown as GridsterItem;

    const draggable = new GridsterDraggable(gridsterItem, {} as unknown as Gridster, {} as unknown as NgZone, {} as unknown as ChangeDetectorRef);
    draggable.positionX = 4;
    draggable.positionY = 5;
    draggable.positionXBackup = 4;
    draggable.positionYBackup = 5;

    draggable.cancelDrag();

    expect(renderedItem).toEqual(sourceItem);
    expect(draggable.positionX).toBe(1);
    expect(draggable.positionY).toBe(2);
    expect(draggable.positionXBackup).toBe(1);
    expect(draggable.positionYBackup).toBe(2);
    expect(gridsterItem.setSize).toHaveBeenCalled();
  });
});

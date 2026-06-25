import { ChangeDetectorRef, NgZone } from '@angular/core';

import { Gridster } from '../gridster';
import { DirTypes } from '../gridsterConfig';
import { GridsterDraggable } from '../gridsterDraggable';
import { GridsterItem } from '../gridsterItem';
import { GridsterPush } from '../gridsterPush';
import { GridsterSwap } from '../gridsterSwap';

describe('gridsterDraggable service', () => {
  it('should reposition the dragged item when the grid scrolls without mouse movement', () => {
    const renderedItem = { x: 0, y: 0, cols: 1, rows: 1 };
    const sourceItem = { x: 0, y: 0, cols: 1, rows: 1 };
    const setCellPosition = vi.fn();
    const gridsterItem = {
      top: 0,
      left: 0,
      width: 100,
      height: 100,
      el: document.createElement('div'),
      renderer: {},
      $item: () => renderedItem,
      item: () => sourceItem
    } as unknown as GridsterItem;
    const gridster = {
      el: {
        scrollLeft: 0,
        scrollTop: 100,
        offsetLeft: 0,
        offsetTop: 0,
        scrollWidth: 1000,
        offsetWidth: 300
      },
      options: () => ({}),
      $options: () => ({
        dirType: DirTypes.LTR,
        disablePushOnDrag: false,
        draggable: {
          dropOverItems: false
        }
      }),
      pixelsToPositionX: (position: number) => Math.round(position / 100),
      pixelsToPositionY: (position: number) => Math.round(position / 100),
      checkGridCollision: () => false,
      checkCollision: () => false,
      gridRenderer: {
        setCellPosition
      },
      updateGrid: vi.fn(),
      previewStyle: vi.fn()
    } as unknown as Gridster;
    const zone = {
      run: (callback: () => void) => callback()
    } as unknown as NgZone;
    const draggable = new GridsterDraggable(gridsterItem, gridster, zone, {} as unknown as ChangeDetectorRef);
    draggable.originalClientX = 10;
    draggable.originalClientY = 10;
    draggable.diffLeft = 10;
    draggable.diffTop = 10;
    draggable.offsetLeft = 0;
    draggable.offsetTop = 0;
    draggable.left = 0;
    draggable.top = 0;
    draggable.width = 100;
    draggable.height = 100;
    draggable.lastMouse = { clientX: 10, clientY: 10 };
    draggable.path = [{ x: 0, y: 0 }];
    draggable.push = {
      fromWest: 'west',
      fromEast: 'east',
      fromNorth: 'north',
      fromSouth: 'south',
      pushItems: vi.fn(),
      checkPushBack: vi.fn()
    } as unknown as GridsterPush;
    draggable.swap = {
      swapItems: vi.fn()
    } as unknown as GridsterSwap;

    draggable.dragScroll();

    expect(renderedItem.y).toBe(1);
    expect(setCellPosition).toHaveBeenCalledWith(gridsterItem.renderer, gridsterItem.el, 0, 100);
  });
});

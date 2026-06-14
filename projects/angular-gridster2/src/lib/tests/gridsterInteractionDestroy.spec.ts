import type { ChangeDetectorRef, NgZone } from '@angular/core';

import type { Gridster } from '../gridster';
import { GridsterDraggable } from '../gridsterDraggable';
import type { GridsterItem } from '../gridsterItem';
import { GridsterResizable } from '../gridsterResizable';

function makeEvent(): MouseEvent {
  return {
    stopPropagation: vi.fn(),
    preventDefault: vi.fn()
  } as unknown as MouseEvent;
}

function makeGridster(): Gridster {
  return {
    previewStyle: vi.fn()
  } as unknown as Gridster;
}

function makeZone(): NgZone {
  return {
    runOutsideAngular: <T>(fn: () => T) => fn(),
    run: <T>(fn: () => T) => fn()
  } as unknown as NgZone;
}

describe('gridster interaction teardown', () => {
  it('ignores a late draggable stop event after destroy', () => {
    const draggable = new GridsterDraggable({} as GridsterItem, makeGridster(), makeZone(), { markForCheck: vi.fn() } as unknown as ChangeDetectorRef);
    const cleanup = [vi.fn(), vi.fn(), vi.fn(), vi.fn(), vi.fn(), vi.fn(), vi.fn(), vi.fn(), vi.fn()];
    draggable.mousedown = cleanup[0];
    draggable.touchstart = cleanup[1];
    draggable.mousemove = cleanup[2];
    draggable.mouseup = cleanup[3];
    draggable.mouseleave = cleanup[4];
    draggable.cancelOnBlur = cleanup[5];
    draggable.touchmove = cleanup[6];
    draggable.touchend = cleanup[7];
    draggable.touchcancel = cleanup[8];

    draggable.destroy();

    cleanup.forEach(listener => expect(listener).toHaveBeenCalledTimes(1));
    expect(() => draggable.dragStop(makeEvent())).not.toThrow();
  });

  it('ignores a late resizable stop event after destroy', () => {
    const resizable = new GridsterResizable({} as GridsterItem, makeGridster(), makeZone());
    const cleanup = [vi.fn(), vi.fn(), vi.fn(), vi.fn(), vi.fn(), vi.fn(), vi.fn()];
    resizable.mousemove = cleanup[0];
    resizable.mouseup = cleanup[1];
    resizable.mouseleave = cleanup[2];
    resizable.cancelOnBlur = cleanup[3];
    resizable.touchmove = cleanup[4];
    resizable.touchend = cleanup[5];
    resizable.touchcancel = cleanup[6];

    resizable.destroy();

    cleanup.forEach(listener => expect(listener).toHaveBeenCalledTimes(1));
    expect(() => resizable.dragStop(makeEvent())).not.toThrow();
  });
});

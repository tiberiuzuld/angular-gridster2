import { DirTypes } from '../gridsterConfig';
import { GridsterDraggable } from '../gridsterDraggable';

interface DraggableWithPrivate {
  getDirections(e: MouseEvent): string[];
}

function createDraggable(): GridsterDraggable {
  const gridsterEl = document.createElement('div');
  const itemEl = document.createElement('div');
  const removeListener = vi.fn();
  const renderer = {
    addClass: vi.fn(),
    listen: vi.fn(() => removeListener),
    removeClass: vi.fn()
  };
  const item = { cols: 1, rows: 1, x: 0, y: 0 };
  const gridster = {
    $options: () => ({
      dirType: DirTypes.LTR,
      margin: 10,
      outerMarginBottom: null,
      outerMarginLeft: null,
      outerMarginRight: null,
      outerMarginTop: null
    }),
    dragInProgress: false,
    el: gridsterEl,
    options: () => ({
      draggable: {}
    }),
    previewStyle: vi.fn(),
    renderer,
    updateGrid: vi.fn()
  };
  const gridsterItem = {
    $item: () => item,
    el: itemEl,
    gridster,
    height: 100,
    item: () => item,
    left: 10,
    renderer,
    top: 20,
    width: 100
  };
  const zone = {
    run: (callback: () => void) => callback(),
    runOutsideAngular: (callback: () => void) => callback()
  };
  const cdRef = {
    markForCheck: vi.fn()
  };

  return new GridsterDraggable(gridsterItem as never, gridster as never, zone as never, cdRef as never);
}

describe('gridster draggable', () => {
  it('starts each drag with the current pointer as the direction baseline', () => {
    const draggable = createDraggable();
    const draggablePrivate = draggable as unknown as DraggableWithPrivate;
    draggable.lastMouse.clientX = 1000;
    draggable.lastMouse.clientY = 600;

    draggable.dragStart(
      new MouseEvent('mousedown', {
        button: 0,
        clientX: 1100,
        clientY: 700
      })
    );

    expect(draggable.lastMouse).toEqual({
      clientX: 1100,
      clientY: 700
    });
    expect(
      draggablePrivate.getDirections(
        new MouseEvent('mousemove', {
          clientX: 1090,
          clientY: 700
        })
      )
    ).toEqual(['LEFT']);
  });
});

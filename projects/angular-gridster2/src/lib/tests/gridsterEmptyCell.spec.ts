import { GridsterEmptyCell } from '../gridsterEmptyCell';

function setElementGeometry(
  el: HTMLElement,
  geometry: {
    clientHeight: number;
    clientWidth: number;
    offsetHeight: number;
    offsetWidth: number;
    scrollHeight: number;
    scrollWidth: number;
  }
): void {
  for (const [key, value] of Object.entries(geometry)) {
    Object.defineProperty(el, key, { configurable: true, value });
  }
  el.getBoundingClientRect = () =>
    ({
      bottom: geometry.offsetHeight,
      height: geometry.offsetHeight,
      left: 0,
      right: geometry.offsetWidth,
      top: 0,
      width: geometry.offsetWidth
    }) as DOMRect;
}

function createMouseDownEvent(clientX: number, clientY: number): MouseEvent {
  const event = new MouseEvent('mousedown', {
    buttons: 1,
    clientX,
    clientY
  });
  vi.spyOn(event, 'preventDefault');
  vi.spyOn(event, 'stopPropagation');

  return event;
}

function createEmptyCell() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  setElementGeometry(el, {
    clientHeight: 200,
    clientWidth: 200,
    offsetHeight: 200,
    offsetWidth: 217,
    scrollHeight: 500,
    scrollWidth: 200
  });

  const removeListener = vi.fn();
  const gridster = {
    $options: () => ({
      draggable: {
        dragHandleClass: 'drag-handler',
        ignoreContentClass: 'gridster-item-content'
      }
    }),
    cdRef: {
      markForCheck: vi.fn()
    },
    el,
    movingItem: null,
    previewStyle: vi.fn(),
    renderer: {
      listen: vi.fn(() => removeListener)
    },
    zone: {
      runOutsideAngular: (callback: () => void) => callback()
    }
  };

  return {
    emptyCell: new GridsterEmptyCell(gridster as never),
    gridster,
    removeListener
  };
}

describe('gridster empty cell drag', () => {
  it('does not start empty cell drag when the mousedown starts on the vertical scrollbar', () => {
    const { emptyCell, gridster } = createEmptyCell();
    const event = createMouseDownEvent(210, 80);

    emptyCell.emptyCellMouseDown(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(event.stopPropagation).not.toHaveBeenCalled();
    expect(gridster.renderer.listen).not.toHaveBeenCalled();
    expect(gridster.movingItem).toBeNull();
  });

  it('still starts empty cell drag when the mousedown starts inside the grid content', () => {
    const { emptyCell, gridster } = createEmptyCell();
    const item = { cols: 1, rows: 1, x: 0, y: 0 };
    const event = createMouseDownEvent(100, 80);
    vi.spyOn(emptyCell, 'getValidItemFromEvent').mockReturnValue(item);

    emptyCell.emptyCellMouseDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(gridster.movingItem).toBe(item);
    expect(gridster.previewStyle).toHaveBeenCalled();
    expect(gridster.renderer.listen).toHaveBeenCalledTimes(4);
  });
});

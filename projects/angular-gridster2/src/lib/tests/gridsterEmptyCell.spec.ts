import { GridsterEmptyCell } from '../gridsterEmptyCell';

describe('GridsterEmptyCell hover preview', () => {
  let listeners: Record<string, (event?: MouseEvent) => void>;
  let cleanupByEvent: Record<string, ReturnType<typeof vi.fn>>;
  let gridster: {
    movingItem: { x: number; y: number; cols: number; rows: number } | null;
    dragInProgress: boolean;
    el: {
      scrollLeft: number;
      scrollTop: number;
      getBoundingClientRect: () => DOMRect;
    };
    options: ReturnType<typeof vi.fn>;
    $options: ReturnType<typeof vi.fn>;
    previewStyle: ReturnType<typeof vi.fn>;
    checkCollision: ReturnType<typeof vi.fn>;
    pixelsToPositionX: ReturnType<typeof vi.fn>;
    pixelsToPositionY: ReturnType<typeof vi.fn>;
    gridRenderer: { getLeftMargin: ReturnType<typeof vi.fn>; getTopMargin: ReturnType<typeof vi.fn> };
    renderer: { listen: ReturnType<typeof vi.fn> };
    zone: { runOutsideAngular: (callback: () => void) => void };
    cdRef: { markForCheck: ReturnType<typeof vi.fn> };
  };
  let emptyCell: GridsterEmptyCell;

  beforeEach(() => {
    listeners = {};
    cleanupByEvent = {};
    gridster = {
      movingItem: null,
      dragInProgress: false,
      el: {
        scrollLeft: 0,
        scrollTop: 0,
        getBoundingClientRect: () => ({ left: 0, top: 0 }) as DOMRect
      },
      options: vi.fn(() => ({ scale: 1 })),
      $options: vi.fn(() => ({
        enableEmptyCellHover: true,
        defaultItemCols: 2,
        defaultItemRows: 1,
        draggable: {
          ignoreContentClass: 'gridster-item-content',
          dragHandleClass: 'drag-handler'
        }
      })),
      previewStyle: vi.fn(),
      checkCollision: vi.fn(() => false),
      pixelsToPositionX: vi.fn((x: number, roundingMethod: (value: number) => number) => roundingMethod(x / 100)),
      pixelsToPositionY: vi.fn((y: number, roundingMethod: (value: number) => number) => roundingMethod(y / 100)),
      gridRenderer: {
        getLeftMargin: vi.fn(() => 0),
        getTopMargin: vi.fn(() => 0)
      },
      renderer: {
        listen: vi.fn((_target: unknown, eventName: string, callback: (event?: MouseEvent) => void) => {
          listeners[eventName] = callback;
          const cleanup = vi.fn();
          cleanupByEvent[eventName] = cleanup;
          return cleanup;
        })
      },
      zone: {
        runOutsideAngular: (callback: () => void) => callback()
      },
      cdRef: { markForCheck: vi.fn() }
    };
    emptyCell = new GridsterEmptyCell(gridster as never);
    emptyCell.updateOptions();
  });

  function move(clientX: number, clientY: number, buttons = 0): void {
    listeners.mousemove({
      clientX,
      clientY,
      buttons
    } as MouseEvent);
  }

  it('shows the ghost at defaultItemCols x defaultItemRows over a free cell', () => {
    move(150, 50);

    expect(gridster.movingItem).toEqual({ x: 1, y: 0, cols: 2, rows: 1 });
    expect(gridster.previewStyle).toHaveBeenCalledOnce();
    expect(gridster.pixelsToPositionX).toHaveBeenCalledWith(150, Math.floor, true);
    expect(gridster.pixelsToPositionY).toHaveBeenCalledWith(50, Math.floor, true);
  });

  it('does not update the preview when the hovered cell is unchanged', () => {
    move(150, 50);
    move(160, 40);

    expect(gridster.previewStyle).toHaveBeenCalledOnce();
  });

  it('hides the ghost when checkCollision rejects the cell', () => {
    move(150, 50);
    gridster.checkCollision.mockReturnValue(true);

    move(250, 50);

    expect(gridster.movingItem).toBeNull();
    expect(gridster.previewStyle).toHaveBeenCalledTimes(2);
  });

  it('hides the ghost on leave', () => {
    move(150, 50);
    listeners.mouseleave();

    expect(gridster.movingItem).toBeNull();
    expect(gridster.previewStyle).toHaveBeenCalledTimes(2);
  });

  it('hides the ghost when a button is held', () => {
    move(150, 50);
    move(150, 50, 1);

    expect(gridster.movingItem).toBeNull();
    expect(gridster.previewStyle).toHaveBeenCalledTimes(2);
  });

  it('does not steal the ghost when empty-cell drag owns it', () => {
    const dragItem = { x: 0, y: 0, cols: 1, rows: 1 };
    emptyCell.initialItem = dragItem;
    gridster.movingItem = dragItem;

    move(150, 50, 1);

    expect(gridster.movingItem).toBe(dragItem);
    expect(gridster.previewStyle).not.toHaveBeenCalled();
  });

  it('does not steal the ghost when item drag owns it', () => {
    const dragItem = { x: 0, y: 0, cols: 1, rows: 1 };
    gridster.dragInProgress = true;
    gridster.movingItem = dragItem;

    move(150, 50, 1);

    expect(gridster.movingItem).toBe(dragItem);
    expect(gridster.previewStyle).not.toHaveBeenCalled();
  });

  it('still allows empty-cell click while the hover ghost is visible', () => {
    const emptyCellClickCallback = vi.fn();
    gridster.options.mockReturnValue({ scale: 1, emptyCellClickCallback });
    gridster.checkCollision.mockReturnValue(false);
    move(150, 50);

    emptyCell.emptyCellClickCb({
      clientX: 150,
      clientY: 50,
      target: gridster.el,
      currentTarget: gridster.el,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn()
    } as unknown as MouseEvent);

    expect(emptyCellClickCallback).toHaveBeenCalledOnce();
  });

  it('removes hover listeners when the option is disabled', () => {
    gridster.$options.mockReturnValue({
      enableEmptyCellHover: false,
      defaultItemCols: 2,
      defaultItemRows: 1
    });
    emptyCell.updateOptions();

    expect(cleanupByEvent.mousemove).toHaveBeenCalledOnce();
    expect(cleanupByEvent.mouseleave).toHaveBeenCalledOnce();
  });
});

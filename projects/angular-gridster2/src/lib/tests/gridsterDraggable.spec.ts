import { GridsterDraggable } from '../gridsterDraggable';
import { DirTypes } from '../gridsterConfig';

describe('GridsterDraggable', () => {
  it('stops an active drag on contextmenu without suppressing the menu event', () => {
    const cleanupByEvent: Record<string, ReturnType<typeof vi.fn>> = {};
    let contextMenuCallback: ((event: MouseEvent) => void) | undefined;

    const renderer = {
      addClass: vi.fn(),
      removeClass: vi.fn(),
      listen: vi.fn((target: unknown, eventName: string, callback: (event: MouseEvent) => void) => {
        if (target === 'document' && eventName === 'contextmenu') {
          contextMenuCallback = callback;
        }
        const cleanup = vi.fn();
        cleanupByEvent[eventName] = cleanup;
        return cleanup;
      })
    };
    const item = { x: 0, y: 0, cols: 1, rows: 1 };
    const $item = { ...item };
    const gridster = {
      dragInProgress: false,
      movingItem: null,
      el: {
        offsetLeft: 0,
        offsetTop: 0,
        scrollLeft: 0,
        scrollTop: 0,
        scrollWidth: 500
      },
      options: vi.fn(() => ({
        draggable: {
          enabled: true
        }
      })),
      $options: vi.fn(() => ({
        margin: 0,
        outerMarginTop: null,
        outerMarginRight: null,
        outerMarginBottom: null,
        outerMarginLeft: null,
        dirType: DirTypes.LTR,
        draggable: {
          dropOverItems: false
        },
        disablePushOnDrag: false,
        pushItems: false,
        pushDirections: { north: true, east: true, south: true, west: true },
        swap: false
      })),
      previewStyle: vi.fn(),
      updateGrid: vi.fn(),
      checkGridCollision: vi.fn(() => false),
      checkCollision: vi.fn(() => false),
      findItemsWithItem: vi.fn(() => []),
      renderer
    };
    const gridsterItem = {
      gridster,
      renderer,
      el: document.createElement('div'),
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      item: vi.fn(() => item),
      $item: vi.fn(() => $item),
      setSize: vi.fn(),
      checkItemChanges: vi.fn()
    };
    const zone = {
      runOutsideAngular: (callback: () => void) => callback(),
      run: (callback: () => void) => callback()
    };
    const cdRef = { markForCheck: vi.fn() };
    const draggable = new GridsterDraggable(gridsterItem as never, gridster as never, zone as never, cdRef as never);
    const dragStartEvent = {
      which: 1,
      clientX: 10,
      clientY: 10,
      stopPropagation: vi.fn(),
      preventDefault: vi.fn()
    } as unknown as MouseEvent;
    const contextMenuEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn()
    } as unknown as MouseEvent;

    draggable.dragStart(dragStartEvent);
    contextMenuCallback?.(contextMenuEvent);

    expect(contextMenuCallback).toBeDefined();
    expect(contextMenuEvent.stopPropagation).not.toHaveBeenCalled();
    expect(contextMenuEvent.preventDefault).not.toHaveBeenCalled();
    expect(gridster.dragInProgress).toBe(false);
    expect(cleanupByEvent.contextmenu).toHaveBeenCalledOnce();
    expect(cleanupByEvent.mousemove).toHaveBeenCalledOnce();
    expect(cleanupByEvent.mouseup).toHaveBeenCalledOnce();
    expect(renderer.removeClass).toHaveBeenCalledWith(gridsterItem.el, 'gridster-item-moving');
    expect(gridsterItem.checkItemChanges).toHaveBeenCalledWith($item, item);
  });
});

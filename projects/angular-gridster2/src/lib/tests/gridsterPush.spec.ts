import { signal } from '@angular/core';

import type { Gridster } from '../gridster';
import type { GridsterItem } from '../gridsterItem';
import { GridsterPush } from '../gridsterPush';
import type { GridsterItemConfig } from '../gridsterItemConfig';

interface MockGridsterItem {
  $item: () => GridsterItemConfig;
  item: () => GridsterItemConfig;
  canBeDragged: () => boolean;
  setSize: ReturnType<typeof vi.fn>;
  checkItemChanges: ReturnType<typeof vi.fn>;
  gridster?: Gridster;
}

function collides(item: GridsterItemConfig, item2: GridsterItemConfig): boolean {
  return item.x < item2.x + item2.cols && item.x + item.cols > item2.x && item.y < item2.y + item2.rows && item.y + item.rows > item2.y;
}

function makeItem(x: number, y: number): MockGridsterItem {
  const source = { x, y, cols: 1, rows: 1 };
  const state = { ...source };
  return {
    $item: () => state,
    item: () => source,
    canBeDragged: () => true,
    setSize: vi.fn(),
    checkItemChanges: vi.fn((newItem: GridsterItemConfig) => {
      source.x = newItem.x;
      source.y = newItem.y;
    })
  };
}

describe('gridsterPush service', () => {
  it('does not move unrelated items when vertical push falls back to the dragged item gap', () => {
    const items = [makeItem(0, 0), makeItem(0, 1), makeItem(0, 2), makeItem(0, 3), makeItem(0, 4)];
    const draggedItem = items[3];
    const gridster = {
      $options: signal({
        pushItems: true,
        pushDirections: { north: true, east: false, south: true, west: false }
      }),
      checkGridCollision: (item: GridsterItemConfig) => item.x < 0 || item.y < 0 || item.x + item.cols > 1 || item.y + item.rows > 5,
      findItemsWithItem: (item: GridsterItemConfig) => items.filter(widget => widget.$item() !== item && collides(widget.$item(), item)),
      findItemWithItem: (item: GridsterItemConfig) => items.find(widget => widget.$item() !== item && collides(widget.$item(), item)) || false
    } as unknown as Gridster;
    items.forEach(item => (item.gridster = gridster));

    draggedItem.$item().y = 2;

    const push = new GridsterPush(draggedItem as unknown as GridsterItem);
    const pushed = push.pushItems(push.fromSouth);

    expect(pushed).toBe(true);
    expect(items.map(item => item.$item().y)).toEqual([0, 1, 3, 2, 4]);
  });
});

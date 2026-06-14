import { NO_ERRORS_SCHEMA, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gridster } from '../gridster';
import { GridsterItem } from '../gridsterItem';
import { GridsterItemConfig } from '../gridsterItemConfig';
import { GridsterPreview } from '../gridsterPreview';

function createItemComponent(item: GridsterItemConfig) {
  const $item = { ...item };
  const itemComponent = {
    $item: () => $item,
    item: () => item,
    setSize: vi.fn(),
    drag: {
      toggle: vi.fn()
    },
    resize: {
      toggle: vi.fn()
    },
    notPlaced: false
  } as unknown as GridsterItem;

  return { $item, itemComponent };
}

describe('gridster component', () => {
  let fixture: ComponentFixture<Gridster>;
  let gridsterComponent: Gridster;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [Gridster, GridsterItem, GridsterPreview],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Gridster);
    gridsterComponent = fixture.componentInstance;
    fixture.componentRef.setInput('options', {
      mobileBreakpoint: 0,
      minCols: 1,
      minRows: 1,
      maxCols: 100,
      maxRows: 100
    });
    fixture.detectChanges();
  });

  it('does not move an existing item that already has a valid position', () => {
    const firstItem = { x: 0, y: 0, cols: 1, rows: 1 };
    const checkedItem = { x: 5, y: 3, cols: 2, rows: 1 };
    const firstItemComponent = createItemComponent(firstItem);
    const checkedItemComponent = createItemComponent(checkedItem);

    gridsterComponent.grid = [firstItemComponent.itemComponent, checkedItemComponent.itemComponent];

    expect(gridsterComponent.getNextPossiblePosition(checkedItem)).toBe(true);
    expect(checkedItem).toEqual({ x: 5, y: 3, cols: 2, rows: 1 });
    expect(checkedItemComponent.$item).toEqual({ x: 5, y: 3, cols: 2, rows: 1 });
  });
});

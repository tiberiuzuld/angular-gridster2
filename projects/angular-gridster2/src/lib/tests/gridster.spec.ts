import { NO_ERRORS_SCHEMA, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gridster } from '../gridster';
import { CompactType, DisplayGrid, GridType } from '../gridsterConfig';
import { GridsterItem } from '../gridsterItem';
import { GridsterItemConfig } from '../gridsterItemConfig';
import { GridsterPreview } from '../gridsterPreview';

function createItemComponent(item: GridsterItemConfig) {
  const $item = { ...item };
  const itemChanged = vi.fn();
  const itemComponent = {
    $item: () => $item,
    item: () => item,
    itemChanged,
    setSize: vi.fn(),
    drag: {
      toggle: vi.fn()
    },
    resize: {
      toggle: vi.fn()
    },
    notPlaced: false
  } as unknown as GridsterItem;

  return { $item, itemChanged, itemComponent };
}

describe('gridster component', () => {
  let fixture: ComponentFixture<Gridster>;
  let gridsterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [Gridster, GridsterItem, GridsterPreview],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Gridster);
    gridsterComponent = fixture.componentInstance;
    gridsterComponent.options = signal({
      gridType: GridType.Fixed,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,

      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: true,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,

      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,

      ignoreMarginInRow: false,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      },
      swap: true,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.OnDragAndResize,
      disableWindowResize: false,
      disableWarnings: true,
      scrollToNewItems: false
    });
  });

  it('clamps loaded item dimensions to item min and max limits', () => {
    const item = { x: 0, y: 0, cols: 1, rows: 9, minItemCols: 3, maxItemRows: 4 };
    const { $item, itemChanged, itemComponent } = createItemComponent(item);

    gridsterComponent.addItem(itemComponent);

    expect(item.cols).toBe(3);
    expect(item.rows).toBe(4);
    expect($item.cols).toBe(3);
    expect($item.rows).toBe(4);
    expect(itemChanged).toHaveBeenCalledTimes(1);
    expect(itemComponent.notPlaced).toBe(false);
  });
});

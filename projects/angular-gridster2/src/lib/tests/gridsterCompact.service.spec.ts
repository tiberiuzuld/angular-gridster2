import { GridsterCompact } from '../gridsterCompact.service';
import {
  CompactType,
  DisplayGrid,
  GridsterComponent,
  GridsterItem,
  GridsterItemComponent,
  GridsterItemComponentInterface,
  GridsterModule,
  GridType
} from 'angular-gridster2';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GridsterUtils } from '../gridsterUtils.service';
import { GridsterPreviewComponent } from '../gridsterPreview.component';
import { GridsterRenderer } from '../gridsterRenderer.service';

function emptyCellClick(event: MouseEvent, item): void {}

function itemValidateCallback(
  item: GridsterItem,
  itemComponent: GridsterItemComponentInterface
): boolean {
  return false;
}

describe('gridsterCompact service', () => {
  let fixture: ComponentFixture<GridsterComponent>;
  let gridsterComponent;
  let gridsterCompact;

  let compactType = CompactType.None;
  let collision: boolean;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridsterComponent,
        GridsterItemComponent,
        GridsterPreviewComponent
      ],
      providers: [GridsterCompact, GridsterRenderer, GridsterUtils],
      imports: [GridsterModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(GridsterComponent);
    gridsterComponent = fixture.componentInstance;
    gridsterComponent.options = {
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
      emptyCellClickCallback: emptyCellClick.bind(this),
      emptyCellContextMenuCallback: emptyCellClick.bind(this),

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
      scrollToNewItems: true,

      itemValidateCallback: itemValidateCallback.bind(this)
    };

    gridsterComponent.grid = { $item: { y: 5, x: 5, rows: 30, cols: 30 } };

    gridsterComponent.ngOnInit();

    gridsterCompact = new GridsterCompact(gridsterComponent);
  }));

  it('should create gridsterComponent', () => {
    expect(gridsterComponent).toBeTruthy(
      'gridsterComponent has not been created'
    );
  });

  it('should check if checkCompactUp called', () => {
    gridsterComponent.options.compact = CompactType.CompactUp;

    gridsterCompact = new GridsterCompact(gridsterComponent);
    const spyCheckComponent = spyOn(gridsterCompact, 'checkCompact');
    gridsterCompact.checkCompact();
    expect(spyCheckComponent).toHaveBeenCalled();
  });

  it('should check if checkCompactleft called', () => {
    gridsterComponent.options.compact = CompactType.CompactLeft;

    const spyCheckComponent = spyOn(gridsterCompact, 'checkCompact');
    gridsterCompact.checkCompact();
    expect(spyCheckComponent).toHaveBeenCalled();
  });

  it('should check if checkCompactUp & checkCompactLeft called', () => {
    compactType = CompactType.CompactUpAndLeft;

    gridsterCompact = new GridsterCompact(gridsterComponent);
    const spyCheckComponent = spyOn(gridsterCompact, 'checkCompact');
    gridsterCompact.checkCompact();
    expect(spyCheckComponent).toHaveBeenCalled();
  });

  it('should check if checkCompactLeft & checkCompactUp called', () => {
    compactType = CompactType.CompactLeftAndUp;

    gridsterCompact = new GridsterCompact(gridsterComponent);
    const spyCheckComponent = spyOn(gridsterCompact, 'checkCompact');
    gridsterCompact.checkCompact();
    expect(spyCheckComponent).toHaveBeenCalled();
  });

  it('should check moveUpTillCollision when checkCollision returns true', () => {
    // collision = true;

    const itemComponent = { $item: { y: 5, x: 5, rows: 3, cols: 3 } };

    gridsterComponent.grid = { $item: { y: 5, x: 5, rows: 3, cols: 3 } };
    gridsterComponent.options.collision = true;
    gridsterComponent.options.itemValidateCallback =
      itemValidateCallback.bind(this);

    const result = gridsterCompact.moveTillCollision(itemComponent, 'y', -1);
    expect(result).toBe(false);
    const spyCheckMoveTillCollision = spyOn(
      gridsterCompact,
      'moveTillCollision'
    );
    const move = gridsterCompact.moveTillCollision(itemComponent, 'y', -1);
    expect(spyCheckMoveTillCollision).toHaveBeenCalled();
  });

  it('should check moveLeftTillCollision when checkCollision returns true', () => {
    collision = true;
    const itemComponent = { $item: { y: 0, x: 0 } };

    gridsterCompact = new GridsterCompact(gridsterComponent);
    expect(gridsterCompact.moveTillCollision(itemComponent, 'x', -1)).toBe(
      false
    );
  });

  it('should check if moveUpTillCollision called when compactType is compactUp', () => {
    compactType = CompactType.CompactUp;
    const itemComponent = { $item: { y: 5, x: 3, cols: 2, rows: 2 } };
    gridsterCompact = new GridsterCompact(gridsterComponent);
    expect(gridsterCompact.moveTillCollision(itemComponent, 'y', -1)).toBe(
      false
    );
    const spyCheckMoveTillCollision = spyOn(
      gridsterCompact,
      'moveTillCollision'
    );
    const move = gridsterCompact.moveTillCollision(itemComponent, 'y', -1);
    expect(spyCheckMoveTillCollision).toHaveBeenCalled();
  });

  it('should check if moveLeftTillCollision called when compactType is compactLeft', () => {
    compactType = CompactType.CompactLeft;
    const itemComponent = { $item: { y: 0, x: 0 } };
    gridsterCompact = new GridsterCompact(gridsterComponent);
    expect(gridsterCompact.moveTillCollision(itemComponent, 'x', -1)).toBe(
      false
    );
    const spyCheckMoveTillCollision = spyOn(
      gridsterCompact,
      'moveTillCollision'
    );
    const move = gridsterCompact.moveTillCollision(itemComponent, 'x', -1);
    expect(spyCheckMoveTillCollision).toHaveBeenCalled();
  });
});

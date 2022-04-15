import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { debounceTime, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { GridsterComponentInterface } from './gridster.interface';
import { GridsterCompact } from './gridsterCompact.service';

import { GridsterConfigService } from './gridsterConfig.constant';
import { GridsterConfig, GridType } from './gridsterConfig.interface';
import { GridsterConfigS } from './gridsterConfigS.interface';
import { GridsterEmptyCell } from './gridsterEmptyCell.service';
import {
  GridsterItem,
  GridsterItemComponentInterface
} from './gridsterItem.interface';
import { GridsterRenderer } from './gridsterRenderer.service';
import { GridsterUtils } from './gridsterUtils.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'gridster',
  templateUrl: './gridster.html',
  styleUrls: ['./gridster.css'],
  encapsulation: ViewEncapsulation.None
})
export class GridsterComponent
  implements OnInit, OnChanges, OnDestroy, GridsterComponentInterface
{
  @Input() options: GridsterConfig;
  movingItem: GridsterItem | null;
  el: HTMLElement;
  $options: GridsterConfigS;
  mobile: boolean;
  curWidth: number;
  curHeight: number;
  grid: GridsterItemComponentInterface[];
  columns = 0;
  rows = 0;
  curColWidth: number;
  curRowHeight: number;
  gridColumns = [];
  gridRows = [];
  windowResize: (() => void) | null;
  dragInProgress: boolean;
  emptyCell: GridsterEmptyCell;
  compact: GridsterCompact;
  gridRenderer: GridsterRenderer;
  previewStyle$: EventEmitter<GridsterItem | null> =
    new EventEmitter<GridsterItem | null>();

  calculateLayout$ = new Subject<void>();

  private resize$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(ElementRef) el: ElementRef,
    @Inject(Renderer2) public renderer: Renderer2,
    @Inject(ChangeDetectorRef) public cdRef: ChangeDetectorRef,
    @Inject(NgZone) public zone: NgZone
  ) {
    this.el = el.nativeElement;
    this.$options = JSON.parse(JSON.stringify(GridsterConfigService));
    this.mobile = false;
    this.curWidth = 0;
    this.curHeight = 0;
    this.grid = [];
    this.curColWidth = 0;
    this.curRowHeight = 0;
    this.dragInProgress = false;
    this.emptyCell = new GridsterEmptyCell(this);
    this.compact = new GridsterCompact(this);
    this.gridRenderer = new GridsterRenderer(this);
  }

  // ------ Function for swapWhileDragging option

  // identical to checkCollision() except that here we add boundaries.
  static checkCollisionTwoItemsForSwaping(
    item: GridsterItem,
    item2: GridsterItem
  ): boolean {
    // if the cols or rows of the items are 1 , doesnt make any sense to set a boundary. Only if the item is bigger we set a boundary
    const horizontalBoundaryItem1 = item.cols === 1 ? 0 : 1;
    const horizontalBoundaryItem2 = item2.cols === 1 ? 0 : 1;
    const verticalBoundaryItem1 = item.rows === 1 ? 0 : 1;
    const verticalBoundaryItem2 = item2.rows === 1 ? 0 : 1;
    return (
      item.x + horizontalBoundaryItem1 < item2.x + item2.cols &&
      item.x + item.cols > item2.x + horizontalBoundaryItem2 &&
      item.y + verticalBoundaryItem1 < item2.y + item2.rows &&
      item.y + item.rows > item2.y + verticalBoundaryItem2
    );
  }

  checkCollisionTwoItems(item: GridsterItem, item2: GridsterItem): boolean {
    const collision =
      item.x < item2.x + item2.cols &&
      item.x + item.cols > item2.x &&
      item.y < item2.y + item2.rows &&
      item.y + item.rows > item2.y;
    if (!collision) {
      return false;
    }
    if (!this.$options.allowMultiLayer) {
      return true;
    }
    const defaultLayerIndex = this.$options.defaultLayerIndex;
    const layerIndex =
      item.layerIndex === undefined ? defaultLayerIndex : item.layerIndex;
    const layerIndex2 =
      item2.layerIndex === undefined ? defaultLayerIndex : item2.layerIndex;
    return layerIndex === layerIndex2;
  }

  ngOnInit(): void {
    if (this.options.initCallback) {
      this.options.initCallback(this);
    }

    this.calculateLayout$
      .pipe(debounceTime(0), takeUntil(this.destroy$))
      .subscribe(() => this.calculateLayout());

    this.resize$
      .pipe(
        // Cancel previously scheduled DOM timer if `calculateLayout()` has been called
        // within this time range.
        switchMap(() => timer(100)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.resize());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.setOptions();
      this.options.api = {
        optionsChanged: this.optionsChanged,
        resize: this.onResize,
        getNextPossiblePosition: this.getNextPossiblePosition,
        getFirstPossiblePosition: this.getFirstPossiblePosition,
        getLastPossiblePosition: this.getLastPossiblePosition,
        getItemComponent: (item: GridsterItem) => this.getItemComponent(item)
      };
      this.columns = this.$options.minCols;
      this.rows = this.$options.minRows + this.$options.addEmptyRowsCount;
      this.setGridSize();
      this.calculateLayout();
    }
  }

  private resize(): void {
    let height;
    let width;
    if (this.$options.gridType === 'fit' && !this.mobile) {
      width = this.el.offsetWidth;
      height = this.el.offsetHeight;
    } else {
      width = this.el.clientWidth;
      height = this.el.clientHeight;
    }
    if (
      (width !== this.curWidth || height !== this.curHeight) &&
      this.checkIfToResize()
    ) {
      this.onResize();
    }
  }

  setOptions(): void {
    this.$options = GridsterUtils.merge(
      this.$options,
      this.options,
      this.$options
    );
    if (!this.$options.disableWindowResize && !this.windowResize) {
      this.windowResize = this.renderer.listen(
        'window',
        'resize',
        this.onResize
      );
    } else if (this.$options.disableWindowResize && this.windowResize) {
      this.windowResize();
      this.windowResize = null;
    }
    this.emptyCell.updateOptions();
  }

  optionsChanged = (): void => {
    this.setOptions();
    let widgetsIndex: number = this.grid.length - 1;
    let widget: GridsterItemComponentInterface;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      widget.updateOptions();
    }
    this.calculateLayout();
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.previewStyle$.complete();
    if (this.windowResize) {
      this.windowResize();
    }
    if (this.options && this.options.destroyCallback) {
      this.options.destroyCallback(this);
    }
    if (this.options && this.options.api) {
      this.options.api.resize = undefined;
      this.options.api.optionsChanged = undefined;
      this.options.api.getNextPossiblePosition = undefined;
      this.options.api = undefined;
    }
    this.emptyCell.destroy();
    this.emptyCell = null!;
    this.compact.destroy();
    this.compact = null!;
  }

  onResize = (): void => {
    if (this.el.clientWidth) {
      if (this.options.setGridSize) {
        // reset width/height so the size is recalculated afterwards
        this.renderer.setStyle(this.el, 'width', '');
        this.renderer.setStyle(this.el, 'height', '');
      }
      this.setGridSize();
      this.calculateLayout();
    }
  };

  checkIfToResize(): boolean {
    const clientWidth = this.el.clientWidth;
    const offsetWidth = this.el.offsetWidth;
    const scrollWidth = this.el.scrollWidth;
    const clientHeight = this.el.clientHeight;
    const offsetHeight = this.el.offsetHeight;
    const scrollHeight = this.el.scrollHeight;
    const verticalScrollPresent =
      clientWidth < offsetWidth &&
      scrollHeight > offsetHeight &&
      scrollHeight - offsetHeight < offsetWidth - clientWidth;
    const horizontalScrollPresent =
      clientHeight < offsetHeight &&
      scrollWidth > offsetWidth &&
      scrollWidth - offsetWidth < offsetHeight - clientHeight;
    if (verticalScrollPresent) {
      return false;
    }
    return !horizontalScrollPresent;
  }

  checkIfMobile(): boolean {
    if (this.$options.useBodyForBreakpoint) {
      return this.$options.mobileBreakpoint > document.body.clientWidth;
    } else {
      return this.$options.mobileBreakpoint > this.curWidth;
    }
  }

  setGridSize(): void {
    const el = this.el;
    let width;
    let height;
    if (
      this.$options.setGridSize ||
      (this.$options.gridType === GridType.Fit && !this.mobile)
    ) {
      width = el.offsetWidth;
      height = el.offsetHeight;
    } else {
      width = el.clientWidth;
      height = el.clientHeight;
    }
    this.curWidth = width;
    this.curHeight = height;
  }

  setGridDimensions(): void {
    this.setGridSize();
    if (!this.mobile && this.checkIfMobile()) {
      this.mobile = !this.mobile;
      this.renderer.addClass(this.el, 'mobile');
    } else if (this.mobile && !this.checkIfMobile()) {
      this.mobile = !this.mobile;
      this.renderer.removeClass(this.el, 'mobile');
    }
    let rows = this.$options.minRows;
    let columns = this.$options.minCols;

    let widgetsIndex = this.grid.length - 1;
    let widget;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      if (!widget.notPlaced) {
        rows = Math.max(rows, widget.$item.y + widget.$item.rows);
        columns = Math.max(columns, widget.$item.x + widget.$item.cols);
      }
    }
    rows += this.$options.addEmptyRowsCount;
    if (this.columns !== columns || this.rows !== rows) {
      this.columns = columns;
      this.rows = rows;
      if (this.options.gridSizeChangedCallback) {
        this.options.gridSizeChangedCallback(this);
      }
    }
  }

  private calculateLayout(): void {
    if (this.compact) {
      this.compact.checkCompact();
    }

    this.setGridDimensions();
    if (this.$options.outerMargin) {
      let marginWidth = -this.$options.margin;
      if (this.$options.outerMarginLeft !== null) {
        marginWidth += this.$options.outerMarginLeft;
        this.renderer.setStyle(
          this.el,
          'padding-left',
          this.$options.outerMarginLeft + 'px'
        );
      } else {
        marginWidth += this.$options.margin;
        this.renderer.setStyle(
          this.el,
          'padding-left',
          this.$options.margin + 'px'
        );
      }
      if (this.$options.outerMarginRight !== null) {
        marginWidth += this.$options.outerMarginRight;
        this.renderer.setStyle(
          this.el,
          'padding-right',
          this.$options.outerMarginRight + 'px'
        );
      } else {
        marginWidth += this.$options.margin;
        this.renderer.setStyle(
          this.el,
          'padding-right',
          this.$options.margin + 'px'
        );
      }
      this.curColWidth = (this.curWidth - marginWidth) / this.columns;
      let marginHeight = -this.$options.margin;
      if (this.$options.outerMarginTop !== null) {
        marginHeight += this.$options.outerMarginTop;
        this.renderer.setStyle(
          this.el,
          'padding-top',
          this.$options.outerMarginTop + 'px'
        );
      } else {
        marginHeight += this.$options.margin;
        this.renderer.setStyle(
          this.el,
          'padding-top',
          this.$options.margin + 'px'
        );
      }
      if (this.$options.outerMarginBottom !== null) {
        marginHeight += this.$options.outerMarginBottom;
        this.renderer.setStyle(
          this.el,
          'padding-bottom',
          this.$options.outerMarginBottom + 'px'
        );
      } else {
        marginHeight += this.$options.margin;
        this.renderer.setStyle(
          this.el,
          'padding-bottom',
          this.$options.margin + 'px'
        );
      }
      this.curRowHeight =
        ((this.curHeight - marginHeight) / this.rows) *
        this.$options.rowHeightRatio;
    } else {
      this.curColWidth = (this.curWidth + this.$options.margin) / this.columns;
      this.curRowHeight =
        ((this.curHeight + this.$options.margin) / this.rows) *
        this.$options.rowHeightRatio;
      this.renderer.setStyle(this.el, 'padding-left', 0 + 'px');
      this.renderer.setStyle(this.el, 'padding-right', 0 + 'px');
      this.renderer.setStyle(this.el, 'padding-top', 0 + 'px');
      this.renderer.setStyle(this.el, 'padding-bottom', 0 + 'px');
    }
    this.gridRenderer.updateGridster();

    if (this.$options.setGridSize) {
      this.renderer.addClass(this.el, 'gridSize');
      if (!this.mobile) {
        this.renderer.setStyle(
          this.el,
          'width',
          this.columns * this.curColWidth + this.$options.margin + 'px'
        );
        this.renderer.setStyle(
          this.el,
          'height',
          this.rows * this.curRowHeight + this.$options.margin + 'px'
        );
      }
    } else {
      this.renderer.removeClass(this.el, 'gridSize');
      this.renderer.setStyle(this.el, 'width', '');
      this.renderer.setStyle(this.el, 'height', '');
    }
    this.updateGrid();

    let widgetsIndex: number = this.grid.length - 1;
    let widget: GridsterItemComponentInterface;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      widget.setSize();
      widget.drag.toggle();
      widget.resize.toggle();
    }

    this.resize$.next();
  }

  updateGrid(): void {
    if (this.$options.displayGrid === 'always' && !this.mobile) {
      this.renderer.addClass(this.el, 'display-grid');
    } else if (
      this.$options.displayGrid === 'onDrag&Resize' &&
      this.dragInProgress
    ) {
      this.renderer.addClass(this.el, 'display-grid');
    } else if (
      this.$options.displayGrid === 'none' ||
      !this.dragInProgress ||
      this.mobile
    ) {
      this.renderer.removeClass(this.el, 'display-grid');
    }
    this.setGridDimensions();
    this.gridColumns.length = GridsterComponent.getNewArrayLength(
      this.columns,
      this.curWidth,
      this.curColWidth
    );
    this.gridRows.length = GridsterComponent.getNewArrayLength(
      this.rows,
      this.curHeight,
      this.curRowHeight
    );
    this.cdRef.markForCheck();
  }

  addItem(itemComponent: GridsterItemComponentInterface): void {
    if (itemComponent.$item.cols === undefined) {
      itemComponent.$item.cols = this.$options.defaultItemCols;
      itemComponent.item.cols = itemComponent.$item.cols;
      itemComponent.itemChanged();
    }
    if (itemComponent.$item.rows === undefined) {
      itemComponent.$item.rows = this.$options.defaultItemRows;
      itemComponent.item.rows = itemComponent.$item.rows;
      itemComponent.itemChanged();
    }
    if (itemComponent.$item.x === -1 || itemComponent.$item.y === -1) {
      this.autoPositionItem(itemComponent);
    } else if (this.checkCollision(itemComponent.$item)) {
      if (!this.$options.disableWarnings) {
        itemComponent.notPlaced = true;
        console.warn(
          "Can't be placed in the bounds of the dashboard, trying to auto position!/n" +
            JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y'])
        );
      }
      if (!this.$options.disableAutoPositionOnConflict) {
        this.autoPositionItem(itemComponent);
      } else {
        itemComponent.notPlaced = true;
      }
    }
    this.grid.push(itemComponent);
    this.calculateLayout$.next();
  }

  removeItem(itemComponent: GridsterItemComponentInterface): void {
    this.grid.splice(this.grid.indexOf(itemComponent), 1);
    this.calculateLayout$.next();
    if (this.options.itemRemovedCallback) {
      this.options.itemRemovedCallback(itemComponent.item, itemComponent);
    }
  }

  checkCollision(item: GridsterItem): GridsterItemComponentInterface | boolean {
    let collision: GridsterItemComponentInterface | boolean = false;
    if (this.options.itemValidateCallback) {
      collision = !this.options.itemValidateCallback(item);
    }
    if (!collision && this.checkGridCollision(item)) {
      collision = true;
    }
    if (!collision) {
      const c = this.findItemWithItem(item);
      if (c) {
        collision = c;
      }
    }
    return collision;
  }

  checkGridCollision(item: GridsterItem): boolean {
    const noNegativePosition = item.y > -1 && item.x > -1;
    const maxGridCols = item.cols + item.x <= this.$options.maxCols;
    const maxGridRows = item.rows + item.y <= this.$options.maxRows;
    const maxItemCols =
      item.maxItemCols === undefined
        ? this.$options.maxItemCols
        : item.maxItemCols;
    const minItemCols =
      item.minItemCols === undefined
        ? this.$options.minItemCols
        : item.minItemCols;
    const maxItemRows =
      item.maxItemRows === undefined
        ? this.$options.maxItemRows
        : item.maxItemRows;
    const minItemRows =
      item.minItemRows === undefined
        ? this.$options.minItemRows
        : item.minItemRows;
    const inColsLimits = item.cols <= maxItemCols && item.cols >= minItemCols;
    const inRowsLimits = item.rows <= maxItemRows && item.rows >= minItemRows;
    const minAreaLimit =
      item.minItemArea === undefined
        ? this.$options.minItemArea
        : item.minItemArea;
    const maxAreaLimit =
      item.maxItemArea === undefined
        ? this.$options.maxItemArea
        : item.maxItemArea;
    const area = item.cols * item.rows;
    const inMinArea = minAreaLimit <= area;
    const inMaxArea = maxAreaLimit >= area;
    return !(
      noNegativePosition &&
      maxGridCols &&
      maxGridRows &&
      inColsLimits &&
      inRowsLimits &&
      inMinArea &&
      inMaxArea
    );
  }

  findItemWithItem(
    item: GridsterItem
  ): GridsterItemComponentInterface | boolean {
    let widgetsIndex = 0;
    let widget: GridsterItemComponentInterface;
    for (; widgetsIndex < this.grid.length; widgetsIndex++) {
      widget = this.grid[widgetsIndex];
      if (
        widget.$item !== item &&
        this.checkCollisionTwoItems(widget.$item, item)
      ) {
        return widget;
      }
    }
    return false;
  }

  findItemsWithItem(item: GridsterItem): Array<GridsterItemComponentInterface> {
    const a: Array<GridsterItemComponentInterface> = [];
    let widgetsIndex = 0;
    let widget: GridsterItemComponentInterface;
    for (; widgetsIndex < this.grid.length; widgetsIndex++) {
      widget = this.grid[widgetsIndex];
      if (
        widget.$item !== item &&
        this.checkCollisionTwoItems(widget.$item, item)
      ) {
        a.push(widget);
      }
    }
    return a;
  }

  autoPositionItem(itemComponent: GridsterItemComponentInterface): void {
    if (this.getNextPossiblePosition(itemComponent.$item)) {
      itemComponent.notPlaced = false;
      itemComponent.item.x = itemComponent.$item.x;
      itemComponent.item.y = itemComponent.$item.y;
      itemComponent.itemChanged();
    } else {
      itemComponent.notPlaced = true;
      if (!this.$options.disableWarnings) {
        console.warn(
          "Can't be placed in the bounds of the dashboard!/n" +
            JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y'])
        );
      }
    }
  }

  getNextPossiblePosition = (
    newItem: GridsterItem,
    startingFrom: { y?: number; x?: number } = {}
  ): boolean => {
    if (newItem.cols === -1) {
      newItem.cols = this.$options.defaultItemCols;
    }
    if (newItem.rows === -1) {
      newItem.rows = this.$options.defaultItemRows;
    }
    this.setGridDimensions();
    let rowsIndex = startingFrom.y || 0;
    let colsIndex;
    for (; rowsIndex < this.rows; rowsIndex++) {
      newItem.y = rowsIndex;
      colsIndex = startingFrom.x || 0;
      for (; colsIndex < this.columns; colsIndex++) {
        newItem.x = colsIndex;
        if (!this.checkCollision(newItem)) {
          return true;
        }
      }
    }
    const canAddToRows = this.$options.maxRows >= this.rows + newItem.rows;
    const canAddToColumns =
      this.$options.maxCols >= this.columns + newItem.cols;
    const addToRows = this.rows <= this.columns && canAddToRows;
    if (!addToRows && canAddToColumns) {
      newItem.x = this.columns;
      newItem.y = 0;
      return true;
    } else if (canAddToRows) {
      newItem.y = this.rows;
      newItem.x = 0;
      return true;
    }
    return false;
  };

  getFirstPossiblePosition = (item: GridsterItem): GridsterItem => {
    const tmpItem = Object.assign({}, item);
    this.getNextPossiblePosition(tmpItem);
    return tmpItem;
  };

  getLastPossiblePosition = (item: GridsterItem): GridsterItem => {
    let farthestItem: { y: number; x: number } = { y: 0, x: 0 };
    farthestItem = this.grid.reduce(
      (
        prev: { y: number; x: number },
        curr: GridsterItemComponentInterface
      ) => {
        const currCoords = {
          y: curr.$item.y + curr.$item.rows - 1,
          x: curr.$item.x + curr.$item.cols - 1
        };
        if (GridsterUtils.compareItems(prev, currCoords) === 1) {
          return currCoords;
        } else {
          return prev;
        }
      },
      farthestItem
    );

    const tmpItem = Object.assign({}, item);
    this.getNextPossiblePosition(tmpItem, farthestItem);
    return tmpItem;
  };

  pixelsToPositionX(
    x: number,
    roundingMethod: (x: number) => number,
    noLimit?: boolean
  ): number {
    const position = roundingMethod(x / this.curColWidth);
    if (noLimit) {
      return position;
    } else {
      return Math.max(position, 0);
    }
  }

  pixelsToPositionY(
    y: number,
    roundingMethod: (x: number) => number,
    noLimit?: boolean
  ): number {
    const position = roundingMethod(y / this.curRowHeight);
    if (noLimit) {
      return position;
    } else {
      return Math.max(position, 0);
    }
  }

  positionXToPixels(x: number): number {
    return x * this.curColWidth;
  }

  positionYToPixels(y: number): number {
    return y * this.curRowHeight;
  }

  getItemComponent(
    item: GridsterItem
  ): GridsterItemComponentInterface | undefined {
    return this.grid.find(c => c.item === item);
  }

  // ------ Functions for swapWhileDragging option

  // identical to checkCollision() except that this function calls findItemWithItemForSwaping() instead of findItemWithItem()
  checkCollisionForSwaping(
    item: GridsterItem
  ): GridsterItemComponentInterface | boolean {
    let collision: GridsterItemComponentInterface | boolean = false;
    if (this.options.itemValidateCallback) {
      collision = !this.options.itemValidateCallback(item);
    }
    if (!collision && this.checkGridCollision(item)) {
      collision = true;
    }
    if (!collision) {
      const c = this.findItemWithItemForSwapping(item);
      if (c) {
        collision = c;
      }
    }
    return collision;
  }

  // identical to findItemWithItem() except that this function calls checkCollisionTwoItemsForSwaping() instead of checkCollisionTwoItems()
  findItemWithItemForSwapping(
    item: GridsterItem
  ): GridsterItemComponentInterface | boolean {
    let widgetsIndex: number = this.grid.length - 1;
    let widget: GridsterItemComponentInterface;
    for (; widgetsIndex > -1; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      if (
        widget.$item !== item &&
        GridsterComponent.checkCollisionTwoItemsForSwaping(widget.$item, item)
      ) {
        return widget;
      }
    }
    return false;
  }

  previewStyle(drag = false): void {
    if (this.movingItem) {
      if (this.compact && drag) {
        this.compact.checkCompactItem(this.movingItem);
      }
      this.previewStyle$.next(this.movingItem);
    } else {
      this.previewStyle$.next(null);
    }
  }

  // ------ End of functions for swapWhileDragging option

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private static getNewArrayLength(
    length: number,
    overallSize: number,
    size: number
  ): number {
    const newLength = Math.max(length, Math.floor(overallSize / size));

    if (newLength < 0) {
      return 0;
    }

    if (Number.isFinite(newLength)) {
      return Math.floor(newLength);
    }

    return 0;
  }
}

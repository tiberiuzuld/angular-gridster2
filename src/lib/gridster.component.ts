import {ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges} from '@angular/core';

import {GridsterConfigService} from './gridsterConfig.constant';
import {GridsterConfig} from './gridsterConfig.interface';
import {GridsterUtils} from './gridsterUtils.service';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterGridComponent} from './gridsterGrid.component';
import {GridsterEmptyCell} from './gridsterEmptyCell.service';
import {GridsterCompact} from './gridsterCompact.service';
import {GridsterConfigS} from './gridsterConfigS.interface';
import {GridsterItemS} from './gridsterItemS.interface';
import {GridsterComponentInterface} from './gridster.interface';

@Component({
  selector: 'gridster',
  templateUrl: './gridster.html',
  styleUrls: ['./gridster.css']
})
export class GridsterComponent implements OnInit, OnChanges, OnDestroy, GridsterComponentInterface {
  @Input() options: GridsterConfig;
  calculateLayoutDebounce: Function;
  movingItem: GridsterItemS;
  previewStyle: Function;
  el: any;
  $options: GridsterConfigS;
  mobile: boolean;
  curWidth: number;
  curHeight: number;
  grid: Array<GridsterItemComponent>;
  columns: number;
  rows: number;
  curColWidth: number;
  curRowHeight: number;
  windowResize: Function | null;
  gridLines: GridsterGridComponent;
  dragInProgress: boolean;
  emptyCell: GridsterEmptyCell;
  compact: GridsterCompact;

  constructor(el: ElementRef, public renderer: Renderer2, public cdRef: ChangeDetectorRef) {
    this.el = el.nativeElement;
    this.$options = JSON.parse(JSON.stringify(GridsterConfigService));
    this.mobile = false;
    this.curWidth = 0;
    this.curHeight = 0;
    this.grid = [];
    this.curColWidth = 0;
    this.curRowHeight = 0;
    this.dragInProgress = false;
    this.$options.draggable.stop = undefined;
    this.$options.draggable.start = undefined;
    this.$options.resizable.stop = undefined;
    this.$options.resizable.start = undefined;
    this.$options.itemChangeCallback = undefined;
    this.$options.itemResizeCallback = undefined;
    this.$options.itemInitCallback = undefined;
    this.$options.itemRemovedCallback = undefined;
    this.$options.emptyCellClickCallback = undefined;
    this.$options.emptyCellContextMenuCallback = undefined;
    this.$options.emptyCellDropCallback = undefined;
    this.$options.emptyCellDragCallback = undefined;
    this.emptyCell = new GridsterEmptyCell(this);
    this.compact = new GridsterCompact(this);
  }

  static checkCollisionTwoItems(item: GridsterItemS, item2: GridsterItemS): boolean {
    return item.x < item2.x + item2.cols
      && item.x + item.cols > item2.x
      && item.y < item2.y + item2.rows
      && item.y + item.rows > item2.y;
  }

  ngOnInit(): void {
    if (this.options.initCallback) {
      this.options.initCallback(this);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      this.setOptions();
      this.options.api = {
        optionsChanged: this.optionsChanged.bind(this),
        resize: this.onResize.bind(this),
        getNextPossiblePosition: this.getNextPossiblePosition.bind(this)
      };
      this.columns = this.$options.minCols;
      this.rows = this.$options.minRows;
      this.setGridSize();
      this.calculateLayoutDebounce = GridsterUtils.debounce(this.calculateLayout.bind(this), 5);
      this.calculateLayoutDebounce();
    }
  }

  resize(): void {
    let height;
    let width;
    if (this.$options.gridType === 'fit' && !this.mobile) {
      width = this.el.offsetWidth;
      height = this.el.offsetHeight;
    } else {
      width = this.el.clientWidth;
      height = this.el.clientHeight;
    }
    if ((width !== this.curWidth || height !== this.curHeight) && this.checkIfToResize()) {
      this.onResize();
    }
  }

  setOptions(): void {
    this.$options = GridsterUtils.merge(this.$options, this.options, this.$options);
    if (!this.$options.disableWindowResize && !this.windowResize) {
      this.windowResize = this.renderer.listen('window', 'resize', this.onResize.bind(this));
    } else if (this.$options.disableWindowResize && this.windowResize) {
      this.windowResize();
      this.windowResize = null;
    }
    this.emptyCell.updateOptions();
  }

  optionsChanged(): void {
    this.setOptions();
    let widgetsIndex: number = this.grid.length - 1, widget: GridsterItemComponent;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      widget.updateOptions();
    }
    this.calculateLayout();
  }

  ngOnDestroy(): void {
    if (this.windowResize) {
      this.windowResize();
    }
    if (this.options.destroyCallback) {
      this.options.destroyCallback(this);
    }
    if (this.options.api) {
      this.options.api.resize = undefined;
      this.options.api.optionsChanged = undefined;
      this.options.api.getNextPossiblePosition = undefined;
      this.options.api = undefined;
    }
    this.emptyCell.destroy();
    delete this.emptyCell;
    this.compact.destroy();
    delete this.compact;
  }

  onResize(): void {
    this.setGridSize();
    this.calculateLayoutDebounce();
  }

  checkIfToResize(): boolean {
    const clientWidth = this.el.clientWidth;
    const offsetWidth = this.el.offsetWidth;
    const scrollWidth = this.el.scrollWidth;
    const clientHeight = this.el.clientHeight;
    const offsetHeight = this.el.offsetHeight;
    const scrollHeight = this.el.scrollHeight;
    const verticalScrollPresent = clientWidth < offsetWidth && scrollHeight > offsetHeight
      && scrollHeight - offsetHeight < offsetWidth - clientWidth;
    const horizontalScrollPresent = clientHeight < offsetHeight
      && scrollWidth > offsetWidth && scrollWidth - offsetWidth < offsetHeight - clientHeight;
    if (verticalScrollPresent) {
      return false;
    }
    return !horizontalScrollPresent;
  }

  setGridSize(): void {
    let width = this.el.clientWidth;
    let height = this.el.clientHeight;
    if (this.$options.gridType === 'fit' && !this.mobile) {
      width = this.el.offsetWidth;
      height = this.el.offsetHeight;
    } else {
      width = this.el.clientWidth;
      height = this.el.clientHeight;
    }
    this.curWidth = width;
    this.curHeight = height;
  }

  setGridDimensions(): void {
    this.setGridSize();
    if (!this.mobile && this.$options.mobileBreakpoint > this.curWidth) {
      this.mobile = !this.mobile;
      this.renderer.addClass(this.el, 'mobile');
    } else if (this.mobile && this.$options.mobileBreakpoint < this.curWidth) {
      this.mobile = !this.mobile;
      this.renderer.removeClass(this.el, 'mobile');
    }
    let rows = this.$options.minRows, columns = this.$options.minCols;

    let widgetsIndex = this.grid.length - 1;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      rows = Math.max(rows, this.grid[widgetsIndex].$item.y + this.grid[widgetsIndex].$item.rows);
      columns = Math.max(columns, this.grid[widgetsIndex].$item.x + this.grid[widgetsIndex].$item.cols);
    }

    this.columns = columns;
    this.rows = rows;
  }

  calculateLayout(): void {
    // check to compact
    if (this.compact) {
      this.compact.checkCompact();
    }

    this.setGridDimensions();
    if (this.$options.outerMargin) {
      this.curColWidth = Math.floor((this.curWidth - this.$options.margin) / this.columns);
      this.curRowHeight = Math.floor((this.curHeight - this.$options.margin) / this.rows);
    } else {
      this.curColWidth = Math.floor((this.curWidth + this.$options.margin) / this.columns);
      this.curRowHeight = Math.floor((this.curHeight + this.$options.margin) / this.rows);
    }
    let addClass = '';
    let removeClass1 = '';
    let removeClass2 = '';
    let removeClass3 = '';
    if (this.$options.gridType === 'fit') {
      addClass = 'fit';
      removeClass1 = 'scrollVertical';
      removeClass2 = 'scrollHorizontal';
      removeClass3 = 'fixed';
    } else if (this.$options.gridType === 'scrollVertical') {
      this.curRowHeight = this.curColWidth;
      addClass = 'scrollVertical';
      removeClass1 = 'fit';
      removeClass2 = 'scrollHorizontal';
      removeClass3 = 'fixed';
    } else if (this.$options.gridType === 'scrollHorizontal') {
      this.curColWidth = this.curRowHeight;
      addClass = 'scrollHorizontal';
      removeClass1 = 'fit';
      removeClass2 = 'scrollVertical';
      removeClass3 = 'fixed';
    } else if (this.$options.gridType === 'fixed') {
      this.curColWidth = this.$options.fixedColWidth + this.$options.margin;
      this.curRowHeight = this.$options.fixedRowHeight + this.$options.margin;
      addClass = 'fixed';
      removeClass1 = 'fit';
      removeClass2 = 'scrollVertical';
      removeClass3 = 'scrollHorizontal';
    } else if (this.$options.gridType === 'verticalFixed') {
      this.curRowHeight = this.$options.fixedRowHeight + this.$options.margin;
      addClass = 'scrollVertical';
      removeClass1 = 'fit';
      removeClass2 = 'scrollHorizontal';
      removeClass3 = 'fixed';
    } else if (this.$options.gridType === 'horizontalFixed') {
      this.curColWidth = this.$options.fixedColWidth + this.$options.margin;
      addClass = 'scrollHorizontal';
      removeClass1 = 'fit';
      removeClass2 = 'scrollVertical';
      removeClass3 = 'fixed';
    }

    this.renderer.addClass(this.el, addClass);
    this.renderer.removeClass(this.el, removeClass1);
    this.renderer.removeClass(this.el, removeClass2);
    this.renderer.removeClass(this.el, removeClass3);

    if (this.gridLines) {
      this.gridLines.updateGrid();
    }

    let widgetsIndex: number = this.grid.length - 1, widget: GridsterItemComponent;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      widget.setSize(false);
      widget.drag.toggle();
      widget.resize.toggle();
    }

    setTimeout(this.resize.bind(this), 100);
  }

  addItem(itemComponent: GridsterItemComponent): void {
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
        console.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
          JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
      }

      this.autoPositionItem(itemComponent);
    }
    this.grid.push(itemComponent);
    this.calculateLayoutDebounce();
    if (itemComponent.$item.initCallback) {
      itemComponent.$item.initCallback(itemComponent.item, itemComponent);
    }
    if (this.$options.itemInitCallback) {
      this.$options.itemInitCallback(itemComponent.item, itemComponent);
    }
  }

  removeItem(itemComponent: GridsterItemComponent): void {
    this.grid.splice(this.grid.indexOf(itemComponent), 1);
    this.calculateLayoutDebounce();
    if (this.$options.itemRemovedCallback) {
      this.$options.itemRemovedCallback(itemComponent.item, itemComponent);
    }
  }

  checkCollision(item: GridsterItemS): GridsterItemComponent | boolean {
    return this.checkGridCollision(item) || this.findItemWithItem(item);
  }

  checkGridCollision(item: GridsterItemS): boolean {
    const noNegativePosition = item.y > -1 && item.x > -1;
    const maxGridCols = item.cols + item.x <= this.$options.maxCols;
    const maxGridRows = item.rows + item.y <= this.$options.maxRows;
    const maxItemCols = item.maxItemCols === undefined ? this.$options.maxItemCols : item.maxItemCols;
    const minItemCols = item.minItemCols === undefined ? this.$options.minItemCols : item.minItemCols;
    const maxItemRows = item.maxItemRows === undefined ? this.$options.maxItemRows : item.maxItemRows;
    const minItemRows = item.minItemRows === undefined ? this.$options.minItemRows : item.minItemRows;
    const inColsLimits = item.cols <= maxItemCols && item.cols >= minItemCols;
    const inRowsLimits = item.rows <= maxItemRows && item.rows >= minItemRows;
    const minAreaLimit = item.minItemArea === undefined ? this.$options.minItemArea : item.minItemArea;
    const maxAreaLimit = item.maxItemArea === undefined ? this.$options.maxItemArea : item.maxItemArea;
    const area = item.cols * item.rows;
    const inMinArea = minAreaLimit <= area;
    const inMaxArea = maxAreaLimit >= area;
    return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits && inMinArea && inMaxArea);
  }

  findItemWithItem(item: GridsterItemS): GridsterItemComponent | boolean {
    let widgetsIndex: number = this.grid.length - 1, widget: GridsterItemComponent;
    for (; widgetsIndex > -1; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      if (widget.$item !== item && GridsterComponent.checkCollisionTwoItems(widget.$item, item)) {
        return widget;
      }
    }
    return false;
  }

  findItemsWithItem(item: GridsterItemS): Array<GridsterItemComponent> {
    const a: Array<GridsterItemComponent> = [];
    let widgetsIndex: number = this.grid.length - 1, widget: GridsterItemComponent;
    for (; widgetsIndex > -1; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      if (widget.$item !== item && GridsterComponent.checkCollisionTwoItems(widget.$item, item)) {
        a.push(widget);
      }
    }
    return a;
  }

  autoPositionItem(itemComponent: GridsterItemComponent): void {
    if (this.getNextPossiblePosition(itemComponent.$item)) {
      itemComponent.item.x = itemComponent.$item.x;
      itemComponent.item.y = itemComponent.$item.y;
      itemComponent.itemChanged();
    } else {
      itemComponent.notPlaced = true;
      if (!this.$options.disableWarnings) {
        console.warn('Can\'t be placed in the bounds of the dashboard!/n' +
          JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
      }
    }
  }

  getNextPossiblePosition(newItem: GridsterItemS): boolean {
    if (newItem.cols === -1) {
      newItem.cols = this.$options.defaultItemCols;
    }
    if (newItem.rows === -1) {
      newItem.rows = this.$options.defaultItemRows;
    }
    this.setGridDimensions();
    let rowsIndex = 0, colsIndex;
    for (; rowsIndex < this.rows; rowsIndex++) {
      newItem.y = rowsIndex;
      colsIndex = 0;
      for (; colsIndex < this.columns; colsIndex++) {
        newItem.x = colsIndex;
        if (!this.checkCollision(newItem)) {
          return true;
        }
      }
    }
    const canAddToRows = this.$options.maxRows >= this.rows + newItem.rows;
    const canAddToColumns = this.$options.maxCols >= this.columns + newItem.cols;
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
  }

  pixelsToPosition(x: number, y: number, roundingMethod: Function): [number, number] {
    return [this.pixelsToPositionX(x, roundingMethod), this.pixelsToPositionY(y, roundingMethod)];
  }

  pixelsToPositionX(x: number, roundingMethod: Function): number {
    return Math.max(roundingMethod(x / this.curColWidth), 0);
  }

  pixelsToPositionY(y: number, roundingMethod: Function): number {
    return Math.max(roundingMethod(y / this.curRowHeight), 0);
  }

  positionXToPixels(x: number): number {
    return x * this.curColWidth;
  }

  positionYToPixels(y: number): number {
    return y * this.curRowHeight;
  }
}

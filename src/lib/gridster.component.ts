import {Component, OnInit, ElementRef, Input, OnDestroy, Renderer2, DoCheck} from '@angular/core';
import {GridsterConfigService} from './gridsterConfig.constant';
import {GridsterConfig} from './gridsterConfig.interface';
import {GridsterUtils} from './gridsterUtils.service';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterGridComponent} from './gridsterGrid.component';

@Component({
  selector: 'gridster',
  templateUrl: './gridster.html',
  styleUrls: ['./gridster.css']
})
export class GridsterComponent implements OnInit, OnDestroy, DoCheck {
  @Input() options: GridsterConfig;
  calculateLayoutDebounce: Function;
  onResizeFunction: (event: any) => void;
  movingItem: GridsterItemComponent;
  previewStyle: Function;
  el: any;
  $options: GridsterConfig;
  mobile: boolean;
  curWidth: number;
  curHeight: number;
  scrollBarPresent: boolean;
  grid: Array<GridsterItemComponent>;
  columns: number;
  rows: number;
  curColWidth: number;
  curRowHeight: number;
  windowResize: Function;
  gridLines: GridsterGridComponent;
  private cleanCallback: any;

  constructor(el: ElementRef, public renderer: Renderer2) {
    this.el = el.nativeElement;
    this.$options = JSON.parse(JSON.stringify(GridsterConfigService));
    this.mobile = false;
    this.curWidth = 0;
    this.curHeight = 0;
    this.scrollBarPresent = false;
    this.grid = [];
    this.curColWidth = 0;
    this.curRowHeight = 0;
    this.$options.draggable.stop = undefined;
    this.$options.resizable.stop = undefined;
    this.$options.itemChangeCallback = undefined;
    this.$options.itemResizeCallback = undefined;
  }

  ngOnInit(): void {
    this.options.optionsChanged = this.optionsChanged.bind(this);
    this.$options = GridsterUtils.merge(this.$options, this.options, this.$options);
    this.columns = GridsterConfigService.minCols;
    this.rows = GridsterConfigService.minRows;
    this.setGridSize();
    this.calculateLayoutDebounce = GridsterUtils.debounce(this.calculateLayout.bind(this), 5);
    this.calculateLayoutDebounce();
    this.onResizeFunction = this.onResize.bind(this);
    this.windowResize = this.renderer.listen('window', 'resize', this.onResizeFunction);
  }

  ngDoCheck(): void {
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

  optionsChanged(): void {
    this.$options = GridsterUtils.merge(this.$options, this.options, this.$options);
    let widgetsIndex: number = this.grid.length - 1, widget: GridsterItemComponent;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      widget.updateOptions();
    }
    this.calculateLayout();
  }

  ngOnDestroy(): void {
    this.windowResize();
    if (typeof this.cleanCallback === 'function') {
      this.cleanCallback();
    }
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
    // check to compact up
    this.checkCompactUp();
    // check to compact left
    this.checkCompactLeft();
    this.setGridDimensions();
    if (this.$options.outerMargin) {
      this.curColWidth = Math.floor((this.curWidth - this.$options.margin) / this.columns);
      this.curRowHeight = Math.floor((this.curHeight - this.$options.margin) / this.rows);
    } else {
      this.curColWidth = Math.floor((this.curWidth + this.$options.margin) / this.columns);
      this.curRowHeight = Math.floor((this.curHeight + this.$options.margin) / this.rows);
    }
    let addClass: string;
    let removeClass1: string;
    let removeClass2: string;
    let removeClass3: string;
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
      this.curColWidth = this.$options.fixedColWidth;
      this.curRowHeight = this.$options.fixedRowHeight;
      addClass = 'fixed';
      removeClass1 = 'fit';
      removeClass2 = 'scrollVertical';
      removeClass3 = 'scrollHorizontal';
    }

    this.renderer.addClass(this.el, addClass);
    this.renderer.removeClass(this.el, removeClass1);
    this.renderer.removeClass(this.el, removeClass2);
    this.renderer.removeClass(this.el, removeClass3);

    if (!this.mobile && this.$options.mobileBreakpoint > this.curWidth) {
      this.mobile = !this.mobile;
      this.renderer.addClass(this.el, 'mobile');
    } else if (this.mobile && this.$options.mobileBreakpoint < this.curWidth) {
      this.mobile = !this.mobile;
      this.renderer.removeClass(this.el, 'mobile');
    }
    this.gridLines.updateGrid(!!this.movingItem);

    let widgetsIndex: number = this.grid.length - 1, widget: GridsterItemComponent;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      widget.setSize(false);
      widget.drag.toggle(this.$options.draggable.enabled);
      widget.resize.toggle(this.$options.resizable.enabled);
    }

    setTimeout(this.ngDoCheck.bind(this), 100);
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
    if (itemComponent.$item.x === undefined || itemComponent.$item.y === undefined) {
      this.autoPositionItem(itemComponent);
    } else if (this.checkCollision(itemComponent)) {
      console.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
        JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
      itemComponent.$item.x = undefined;
      itemComponent.$item.y = undefined;
      this.autoPositionItem(itemComponent);
    }
    this.grid.push(itemComponent);
    this.calculateLayoutDebounce();
    if (itemComponent.$item.initCallback) {
      itemComponent.$item.initCallback(itemComponent);
    }
  }

  removeItem(itemComponent: GridsterItemComponent): void {
    this.grid.splice(this.grid.indexOf(itemComponent), 1);
    this.calculateLayoutDebounce();
  }

  checkCollision(itemComponent: GridsterItemComponent, ignoreItem?: GridsterItemComponent): GridsterItemComponent | boolean {
    if (this.checkGridCollision(itemComponent)) {
      return true;
    }
    return this.findItemWithItem(itemComponent, ignoreItem);
  }

  checkGridCollision(itemComponent: GridsterItemComponent): boolean {
    const noNegativePosition = itemComponent.$item.y > -1 && itemComponent.$item.x > -1;
    const maxGridCols = itemComponent.$item.cols + itemComponent.$item.x <= this.$options.maxCols;
    const maxGridRows = itemComponent.$item.rows + itemComponent.$item.y <= this.$options.maxRows;
    const maxItemCols = itemComponent.$item.maxItemCols === undefined ? this.$options.maxItemCols : itemComponent.$item.maxItemCols;
    const minItemCols = itemComponent.$item.minItemCols === undefined ? this.$options.minItemCols : itemComponent.$item.minItemCols;
    const maxItemRows = itemComponent.$item.maxItemRows === undefined ? this.$options.maxItemRows : itemComponent.$item.maxItemRows;
    const minItemRows = itemComponent.$item.minItemRows === undefined ? this.$options.minItemRows : itemComponent.$item.minItemRows;
    const inColsLimits = itemComponent.$item.cols <= maxItemCols && itemComponent.$item.cols >= minItemCols;
    const inRowsLimits = itemComponent.$item.rows <= maxItemRows && itemComponent.$item.rows >= minItemRows;
    return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits);
  }

  findItemWithItem(itemComponent: GridsterItemComponent, ignoreItem?: GridsterItemComponent): GridsterItemComponent {
    let widgetsIndex: number = this.grid.length - 1, widget: GridsterItemComponent;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.grid[widgetsIndex];
      if (widget !== itemComponent && widget !== ignoreItem
        && widget.$item.x < itemComponent.$item.x + itemComponent.$item.cols
        && widget.$item.x + widget.$item.cols > itemComponent.$item.x
        && widget.$item.y < itemComponent.$item.y + itemComponent.$item.rows
        && widget.$item.y + widget.$item.rows > itemComponent.$item.y) {
        return widget;
      }
    }
  }

  autoPositionItem(itemComponent: GridsterItemComponent): void {
    this.setGridDimensions();
    let rowsIndex = 0, colsIndex;
    for (; rowsIndex < this.rows; rowsIndex++) {
      itemComponent.$item.y = rowsIndex;
      colsIndex = 0;
      for (; colsIndex < this.columns; colsIndex++) {
        itemComponent.$item.x = colsIndex;
        if (!this.checkCollision(itemComponent)) {
          itemComponent.item.x = itemComponent.$item.x;
          itemComponent.item.y = itemComponent.$item.y;
          itemComponent.itemChanged();
          return;
        }
      }
    }
    if (this.rows >= this.columns && this.$options.maxCols > this.columns) {
      itemComponent.$item.x = this.columns;
      itemComponent.$item.y = 0;
      itemComponent.item.x = itemComponent.$item.x;
      itemComponent.item.y = itemComponent.$item.y;
      itemComponent.itemChanged();
    } else if (this.$options.maxRows > this.rows) {
      itemComponent.$item.y = this.rows;
      itemComponent.$item.x = 0;
      itemComponent.item.x = itemComponent.$item.x;
      itemComponent.item.y = itemComponent.$item.y;
      itemComponent.itemChanged();
    } else {
      console.warn('Can\'t be placed in the bounds of the dashboard!/n' +
        JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
    }
  }

  pixelsToPosition(x: number, y: number, roundingMethod: Function): [number, number] {
    return [this.pixelsToPositionX(x, roundingMethod), this.pixelsToPositionY(y, roundingMethod)];
  }

  pixelsToPositionX(x: number, roundingMethod: Function): number {
    return roundingMethod(x / this.curColWidth);
  }

  pixelsToPositionY(y: number, roundingMethod: Function): number {
    return roundingMethod(y / this.curRowHeight);
  }

  positionXToPixels(x: number): number {
    return x * this.curColWidth;
  }

  positionYToPixels(y: number): number {
    return y * this.curRowHeight;
  }

  checkCompactUp(): boolean {
    if (this.$options.compactUp) {
      let widgetMovedUp = false, widget: GridsterItemComponent, moved: boolean;
      const l = this.grid.length;
      for (let i = 0; i < l; i++) {
        widget = this.grid[i];
        moved = this.moveUpTillCollision(widget);
        if (moved) {
          widgetMovedUp = true;
          widget.itemChanged();
        }
      }
      if (widgetMovedUp) {
        this.checkCompactUp();
        return widgetMovedUp;
      }
    }
  }

  moveUpTillCollision(itemComponent: GridsterItemComponent): boolean {
    itemComponent.$item.y -= 1;
    if (this.checkCollision(itemComponent)) {
      itemComponent.$item.y += 1;
      return false;
    } else {
      this.moveUpTillCollision(itemComponent);
      return true;
    }
  }

  checkCompactLeft(): boolean {
    if (this.$options.compactLeft) {
      let widgetMovedUp = false, widget: GridsterItemComponent, moved: boolean;
      const l = this.grid.length;
      for (let i = 0; i < l; i++) {
        widget = this.grid[i];
        moved = this.moveLeftTillCollision(widget);
        if (moved) {
          widgetMovedUp = true;
          widget.itemChanged();
        }
      }
      if (widgetMovedUp) {
        this.checkCompactLeft();
        return widgetMovedUp;
      }
    }
  }

  moveLeftTillCollision(itemComponent: GridsterItemComponent): boolean {
    itemComponent.$item.x -= 1;
    if (this.checkCollision(itemComponent)) {
      itemComponent.$item.x += 1;
      return false;
    } else {
      this.moveUpTillCollision(itemComponent);
      return true;
    }
  }
}

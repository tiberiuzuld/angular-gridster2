import {Component, OnInit, ElementRef, Input, OnDestroy} from '@angular/core';
import {GridsterConfigService} from './gridsterConfig.constant';
import {GridsterConfig} from './gridsterConfig.interface';
import {GridsterUtils} from './gridsterUtils.service';
import {GridsterItem} from './gridsterItem.interface';
import {addResizeListener, removeResizeListener} from './detectElementResize';

@Component({
  selector: 'gridster',
  template: '<ng-content></ng-content><gridster-preview></gridster-preview>',
  styleUrls: ['./gridster.css']
})
export class GridsterComponent implements OnInit, OnDestroy {
  @Input() options: GridsterConfig;
  detectScrollBarLayout: () => void;
  calculateLayoutDebounce: Function;
  onResizeFunction: EventListenerObject;
  movingItem: GridsterItem;
  previewStyle: Function;
  state: {
    element: HTMLElement
    mobile: boolean
    curWidth: number
    curHeight: number,
    options: GridsterConfig,
    scrollBarPresent: boolean,
    grid: Array<GridsterItem>,
    columns: number,
    rows: number,
    curColWidth: number,
    curRowHeight: number
  };
  private cleanCallback: any;

  constructor(private el: ElementRef) {
    this.state = {
      element: el.nativeElement,
      mobile: false,
      curWidth: 0,
      curHeight: 0,
      options: JSON.parse(JSON.stringify(GridsterConfigService)),
      scrollBarPresent: false,
      grid: [],
      columns: GridsterConfigService.minCols,
      rows: GridsterConfigService.minRows,
      curColWidth: 0,
      curRowHeight: 0
    };
  };

  ngOnInit() {
    this.options.optionsChanged = this.optionsChanged.bind(this);
    this.state.options = GridsterUtils.merge(this.state.options, this.options);
    this.setGridSize();
    this.detectScrollBarLayout = GridsterUtils.debounce(this.detectScrollBar.bind(this), 50);
    this.calculateLayoutDebounce = GridsterUtils.debounce(this.calculateLayout.bind(this), 5);
    this.state.element.addEventListener('transitionend', this.detectScrollBarLayout);
    this.calculateLayoutDebounce();
    this.onResizeFunction = this.onResize.bind(this);
    addResizeListener(this.state.element, this.onResizeFunction);
  };

  optionsChanged() {
    this.state.options = GridsterUtils.merge(this.state.options, this.options);
    this.calculateLayout();
  }

  ngOnDestroy() {
    removeResizeListener(this.state.element, this.onResizeFunction);
    if (typeof this.cleanCallback === 'function') {
      this.cleanCallback();
    }
  };

  onResize() {
    this.setGridSize();
    this.calculateLayoutDebounce();
  };

  detectScrollBar() {
    const verticalScrollPresent = this.state.element.clientWidth < this.state.element.offsetWidth &&
      this.state.element.offsetHeight - this.state.element.clientHeight <
      this.state.element.scrollWidth - this.state.element.offsetWidth;
    const horizontalScrollPresent = this.state.element.clientHeight < this.state.element.offsetHeight &&
      this.state.element.offsetWidth - this.state.element.clientWidth <
      this.state.element.scrollHeight - this.state.element.offsetHeight;
    if (this.state.scrollBarPresent && !verticalScrollPresent && !horizontalScrollPresent) {
      this.state.scrollBarPresent = !this.state.scrollBarPresent;
      this.onResize();
    } else if (!this.state.scrollBarPresent && (verticalScrollPresent || horizontalScrollPresent)) {
      this.state.scrollBarPresent = !this.state.scrollBarPresent;
      this.onResize();
    }
  };

  setGridSize() {
    if (this.state.options.gridType === 'fit' && !this.state.mobile) {
      this.state.curWidth = this.state.element.offsetWidth;
      this.state.curHeight = this.state.element.offsetHeight;
    } else {
      this.state.curWidth = this.state.element.clientWidth;
      this.state.curHeight = this.state.element.clientHeight;
    }
  };

  setGridDimensions() {
    let rows = this.state.options.minRows, columns = this.state.options.minCols;

    let widgetsIndex = this.state.grid.length - 1;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      rows = Math.max(rows, this.state.grid[widgetsIndex].y + this.state.grid[widgetsIndex].rows);
      columns = Math.max(columns, this.state.grid[widgetsIndex].x + this.state.grid[widgetsIndex].cols);
    }

    this.state.columns = columns;
    this.state.rows = rows;
  };

  calculateLayout() {
    // check to compact up
    this.checkCompactUp();
    // check to compact left
    this.checkCompactLeft();
    this.setGridDimensions();
    if (this.state.options.outerMargin) {
      this.state.curColWidth = Math.floor((this.state.curWidth - this.state.options.margin) / this.state.columns);
      this.state.curRowHeight = Math.floor((this.state.curHeight - this.state.options.margin) / this.state.rows);
    } else {
      this.state.curColWidth = Math.floor((this.state.curWidth + this.state.options.margin) / this.state.columns);
      this.state.curRowHeight = Math.floor((this.state.curHeight + this.state.options.margin) / this.state.rows);
    }
    if (this.state.options.gridType === 'fit') {
      this.state.element.classList.add('fit');
      this.state.element.classList.remove('scrollVertical');
      this.state.element.classList.remove('scrollHorizontal');
      this.state.element.classList.remove('fixed');
    } else if (this.state.options.gridType === 'scrollVertical') {
      this.state.curRowHeight = this.state.curColWidth;
      this.state.element.classList.add('scrollVertical');
      this.state.element.classList.remove('fit');
      this.state.element.classList.remove('scrollHorizontal');
      this.state.element.classList.remove('fixed');
    } else if (this.state.options.gridType === 'scrollHorizontal') {
      this.state.curColWidth = this.state.curRowHeight;
      this.state.element.classList.add('scrollHorizontal');
      this.state.element.classList.remove('fit');
      this.state.element.classList.remove('scrollVertical');
      this.state.element.classList.remove('fixed');
    } else if (this.state.options.gridType === 'fixed') {
      this.state.curColWidth = this.state.options.fixedColWidth;
      this.state.curRowHeight = this.state.options.fixedRowHeight;
      this.state.element.classList.add('fixed');
      this.state.element.classList.remove('fit');
      this.state.element.classList.remove('scrollVertical');
      this.state.element.classList.remove('scrollHorizontal');
    }

    if (!this.state.mobile && this.state.options.mobileBreakpoint > this.state.curWidth) {
      this.state.mobile = !this.state.mobile;
      this.state.element.classList.add('mobile');
    } else if (this.state.mobile && this.state.options.mobileBreakpoint < this.state.curWidth) {
      this.state.mobile = !this.state.mobile;
      this.state.element.classList.remove('mobile');
    }

    let widgetsIndex = this.state.grid.length - 1;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      this.state.grid[widgetsIndex].setSize();
      this.state.grid[widgetsIndex].drag.toggle(this.state.options.draggable.enabled);
      this.state.grid[widgetsIndex].resize.toggle(this.state.options.resizable.enabled);
    }

    this.detectScrollBarLayout();
  };

  addItem(item: GridsterItem) {
    if (item.cols === undefined) {
      item.cols = this.state.options.defaultItemCols;
    }
    if (item.rows === undefined) {
      item.rows = this.state.options.defaultItemRows;
    }
    if (item.x === undefined || item.y === undefined) {
      this.autoPositionItem(item);
    } else if (this.checkCollision(item)) {
      console.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
        JSON.stringify(item, ['cols', 'rows', 'x', 'y', 'id']));
      item.x = undefined;
      item.y = undefined;
      this.autoPositionItem(item);
    }
    this.state.grid.push(item);
    this.calculateLayoutDebounce();
    if (item.initCallback) {
      item.initCallback(item);
    }
  }

  removeItem(item: GridsterItem) {
    this.state.grid.splice(this.state.grid.indexOf(item), 1);
    this.calculateLayoutDebounce();
  }

  checkCollision(item: GridsterItem): GridsterItem {
    const noNegativePosition = item.y > -1 && item.x > -1;
    const maxGridCols = item.cols + item.x <= this.state.options.maxCols;
    const maxGridRows = item.rows + item.y <= this.state.options.maxRows;
    const maxItemCols = item.maxItemCols === undefined ? this.state.options.maxItemCols : item.maxItemCols;
    const minItemCols = item.minItemCols === undefined ? this.state.options.minItemCols : item.minItemCols;
    const maxItemRows = item.maxItemRows === undefined ? this.state.options.maxItemRows : item.maxItemRows;
    const minItemRows = item.minItemRows === undefined ? this.state.options.minItemRows : item.minItemRows;
    const inColsLimits = item.cols <= maxItemCols && item.cols >= minItemCols;
    const inRowsLimits = item.rows <= maxItemRows && item.rows >= minItemRows;
    if (!(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits)) {
      return true;
    }
    return this.findItemWithItem(item);
  }

  findItemWithItem(item: GridsterItem): GridsterItem {
    let widgetsIndex = this.state.grid.length - 1, widget;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.state.grid[widgetsIndex];
      if (widget !== item && widget.x < item.x + item.cols && widget.x + widget.cols > item.x &&
        widget.y < item.y + item.rows && widget.y + widget.rows > item.y) {
        return widget;
      }
    }
  };

  autoPositionItem(item: GridsterItem) {
    this.setGridDimensions();
    let rowsIndex = 0, colsIndex;
    for (; rowsIndex < this.state.rows; rowsIndex++) {
      item.y = rowsIndex;
      colsIndex = 0;
      for (; colsIndex < this.state.columns; colsIndex++) {
        item.x = colsIndex;
        if (!this.checkCollision(item)) {
          return;
        }
      }
    }
    if (this.state.rows >= this.state.columns && this.state.options.maxCols > this.state.columns) {
      item.x = this.state.columns;
      item.y = 0;
    } else if (this.state.options.maxRows > this.state.rows) {
      item.y = this.state.rows;
      item.x = 0;
    } else {
      console.warn('Can\'t be placed in the bounds of the dashboard!/n' +
        JSON.stringify(item, ['cols', 'rows', 'x', 'y', 'id']));
    }
  }

  pixelsToPosition(x: number, y: number, roundingMethod: Function): [number, number] {
    return [roundingMethod(Math.abs(x) / this.state.curColWidth), roundingMethod(Math.abs(y) / this.state.curRowHeight)];
  };

  positionXToPixels(x: number): number {
    return x * this.state.curColWidth;
  }

  positionYToPixels(y: number): number {
    return y * this.state.curRowHeight;
  }

  checkCompactUp(): Boolean {
    if (this.state.options.compactUp) {
      let widgetMovedUp = false, widget, moved;
      const l = this.state.grid.length;
      for (let i = 0; i < l; i++) {
        widget = this.state.grid[i];
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

  moveUpTillCollision(item: GridsterItem): Boolean {
    item.y -= 1;
    if (this.checkCollision(item)) {
      item.y += 1;
      return false;
    } else {
      this.moveUpTillCollision(item);
      return true;
    }
  }

  checkCompactLeft(): Boolean {
    if (this.state.options.compactLeft) {
      let widgetMovedUp = false, widget, moved;
      const l = this.state.grid.length;
      for (let i = 0; i < l; i++) {
        widget = this.state.grid[i];
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

  moveLeftTillCollision(item: GridsterItem): Boolean {
    item.x -= 1;
    if (this.checkCollision(item)) {
      item.x += 1;
      return false;
    } else {
      this.moveUpTillCollision(item);
      return true;
    }
  }
}

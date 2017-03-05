import {Component, OnInit, ElementRef, Input, OnDestroy} from '@angular/core';
import {GridsterConfigService, GridsterConfig} from './gridsterConfig.service';
import _ from 'lodash';
import {isUndefined} from 'util';
// import * as detectElementResize from 'javascript-detect-element-resize';


@Component({
  selector: 'tz-gridster',
  templateUrl: './gridster.html',
  styleUrls: ['./gridster.css']
})
export class GridsterComponent implements OnInit, OnDestroy {
  @Input() options: GridsterConfig;
  detectScrollBarLayout: Function;
  calculateLayoutDebounce: Function;
  state: {
    element: HTMLDivElement
    mobile: boolean
    curWidth: number
    curHeight: number,
    options: GridsterConfig,
    scrollBarPresent: boolean,
    grid: Array<{ // TODO replace with gridsterItem definition
      x: number,
      y: number,
      rows: number,
      cols: number,
      setSize: Function,
      drag: {
        toggle: Function
      },
      resize: {
        toggle: Function
      }
    }>,
    columns: number,
    rows: number,
    curColWidth: number,
    curRowHeight: number
  };

  constructor(el: ElementRef) {
    this.state = {
      element: el.nativeElement,
      mobile: false,
      curWidth: 0,
      curHeight: 0,
      options: _.merge({}, GridsterConfigService),
      scrollBarPresent: false,
      grid: [],
      columns: GridsterConfigService.minCols,
      rows: GridsterConfigService.minRows,
      curColWidth: 0,
      curRowHeight: 0
    };
  };

  ngOnInit() {
    this.state.options = _.merge(this.state.options, this.options);
    this.setGridSize();
    this.detectScrollBarLayout = _.debounce(this.detectScrollBar, 10);
    this.calculateLayoutDebounce = _.debounce(this.calculateLayout, 5);
    // this.state.element.addEventListener('transitionend', this.detectScrollBarLayout);
    this.calculateLayoutDebounce();
    // detectElementResize.addResizeListener(this.element, this.onResize);
  };

  ngOnDestroy() {
    // detectElementResize.removeResizeListener(this.element, this.onResize);
  };

  onResize() {
    this.setGridSize();
    // gridster.calculateLayout();
  };

  detectScrollBar() {
    if (this.state.scrollBarPresent && this.state.element.scrollHeight <= this.state.element.offsetHeight &&
      this.state.element.offsetWidth - this.state.element.clientWidth >=
      this.state.element.scrollHeight - this.state.element.offsetHeight) {
      this.state.scrollBarPresent = !this.state.scrollBarPresent;
      this.onResize();
    } else if (!this.state.scrollBarPresent && this.state.element.scrollHeight > this.state.element.offsetHeight &&
      this.state.element.offsetWidth - this.state.element.clientWidth <
      this.state.element.scrollHeight - this.state.element.offsetHeight) {

      this.state.scrollBarPresent = !this.state.scrollBarPresent;
      this.onResize();
    }

    if (this.state.scrollBarPresent && this.state.element.scrollWidth <= this.state.element.offsetWidth &&
      this.state.element.offsetHeight - this.state.element.clientHeight >=
      this.state.element.scrollWidth - this.state.element.offsetWidth) {

      this.state.scrollBarPresent = !this.state.scrollBarPresent;
      this.onResize();
    } else if (!this.state.scrollBarPresent && this.state.element.scrollWidth > this.state.element.offsetWidth &&
      this.state.element.offsetHeight - this.state.element.clientHeight <
      this.state.element.scrollWidth - this.state.element.offsetWidth) {
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
    } else if (this.state.options.gridType === 'scrollVertical') {
      this.state.curRowHeight = this.state.curColWidth;
      this.state.element.classList.add('scrollVertical');
      this.state.element.classList.remove('fit');
      this.state.element.classList.remove('scrollHorizontal');
    } else if (this.state.options.gridType === 'scrollHorizontal') {
      this.state.curColWidth = this.state.curRowHeight;
      this.state.element.classList.add('scrollHorizontal');
      this.state.element.classList.remove('fit');
      this.state.element.classList.remove('scrollVertical');
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

  addItem(item) {
    if (isUndefined(item.cols)) {
      item.cols = this.state.options.defaultItemCols;
    }
    if (isUndefined(item.rows)) {
      item.rows = this.state.options.defaultItemRows;
    }
    if (isUndefined(item.x) || isUndefined(item.y)) {
      this.autoPositionItem(item);
    } else if (this.checkCollision(item)) {
      item.x = undefined;
      item.y = undefined;
      // $log.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!', item);
      this.autoPositionItem(item);
    }
    this.state.grid.push(item);
    this.calculateLayout();
    if (item.initCallback) {
      item.initCallback(item);
    }
  };

  removeItem = function (item) {
    this.state.grid.splice(this.state.grid.indexOf(item), 1);
    this.calculateLayout();
  };

  checkCollision = function (item) {
    if (!(item.y > -1 && item.x > -1 && item.cols + item.x <= this.state.options.maxCols &&
      item.rows + item.y <= this.state.options.maxRows)) {
      return true;
    }
    return this.findItemWithItem(item);
  };

  findItemWithItem = function (item) {
    let widgetsIndex = this.state.grid.length - 1, widget;
    for (; widgetsIndex >= 0; widgetsIndex--) {
      widget = this.state.grid[widgetsIndex];
      if (widget !== item && widget.x < item.x + item.cols && widget.x + widget.cols > item.x &&
        widget.y < item.y + item.rows && widget.y + widget.rows > item.y) {
        return widget;
      }
    }
  };

  autoPositionItem = function (item) {
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
    if (this.rows >= this.columns && this.maxCols > this.columns) {
      item.x = this.columns;
      item.y = 0;
    } else if (this.maxRows > this.rows) {
      item.y = this.rows;
      item.x = 0;
    } else {
      // $log.warn('Can\'t be placed in the bounds of the dashboard!', item);
    }
  };

  pixelsToPosition = function (x, y) {
    if (this.state.options.outerMargin) {
      x -= this.state.options.margin;
      y -= this.state.options.margin;
    }

    return [Math.abs(Math.round(x / this.state.curColWidth)), Math.abs(Math.round(y / this.state.curRowHeight))];
  };

  checkCompactUp = function () {
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
  };

  moveUpTillCollision(widget) {
    widget.y -= 1;
    if (this.checkCollision(widget)) {
      widget.y += 1;
      return false;
    } else {
      this.moveUpTillCollision(widget);
      return true;
    }
  };

  checkCompactLeft = function () {
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
  };

  moveLeftTillCollision(widget) {
    widget.x -= 1;
    if (this.checkCollision(widget)) {
      widget.x += 1;
      return false;
    } else {
      this.moveUpTillCollision(widget);
      return true;
    }
  };
}

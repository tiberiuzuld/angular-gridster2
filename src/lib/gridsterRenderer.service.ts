import {Injectable, Renderer2} from '@angular/core';

import {GridsterComponentInterface} from './gridster.interface';
import {GridRenderer, GridType} from './gridsterConfig.interface';
import {GridsterItemS} from './gridsterItemS.interface';

@Injectable()
export class GridsterRenderer {

  constructor(private gridster: GridsterComponentInterface) {
  }

  destroy(): void {
    delete this.gridster;
  }

  updateItem(el: any, item: GridsterItemS, renderer: Renderer2) {
    if (this.gridster.$options.gridRenderer === GridRenderer.Absolute) {
      renderer.setStyle(el, 'grid-column-start', null);
      renderer.setStyle(el, 'grid-column-end', null);
      renderer.setStyle(el, 'grid-row-start', null);
      renderer.setStyle(el, 'grid-row-end', null);
      if (this.gridster.mobile) {
        renderer.setStyle(el, 'transform', null);
        renderer.setStyle(el, 'width', null);
        renderer.setStyle(el, 'height', '25%');
        renderer.setStyle(el, 'margin-bottom', this.gridster.$options.margin + 'px');
      } else {
        const x = Math.round(this.gridster.curColWidth * item.x);
        const y = Math.round(this.gridster.curRowHeight * item.y);
        const width = this.gridster.curColWidth * item.cols - this.gridster.$options.margin;
        const height = (this.gridster.curRowHeight * item.rows - this.gridster.$options.margin);
        const transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
        renderer.setStyle(el, 'transform', transform);
        renderer.setStyle(el, 'width', width + 'px');
        renderer.setStyle(el, 'height', height + 'px');
        renderer.setStyle(el, 'margin-bottom', null);
      }
    } else {
      renderer.setStyle(el, 'transform', null);
      renderer.setStyle(el, 'width', null);
      renderer.setStyle(el, 'height', null);
      if (this.gridster.mobile) {
        renderer.setStyle(el, 'grid-column-start', null);
        renderer.setStyle(el, 'grid-column-end', null);
        renderer.setStyle(el, 'grid-row-start', null);
        renderer.setStyle(el, 'grid-row-end', null);
      } else {
        renderer.setStyle(el, 'grid-column-start', (item.x + 1));
        renderer.setStyle(el, 'grid-column-end', ((item.x + 1) + item.cols));
        renderer.setStyle(el, 'grid-row-start', (item.y + 1));
        renderer.setStyle(el, 'grid-row-end', ((item.y + 1) + item.rows));
      }
    }
  }

  updateGridster() {
    this.gridster.renderer.addClass(this.gridster.el, this.gridster.$options.gridRenderer);
    this.gridster.renderer.removeClass(this.gridster.el, this.gridster.$options.gridRenderer === GridRenderer.Grid ? GridRenderer.Absolute : GridRenderer.Grid);

    if (this.gridster.$options.gridRenderer === GridRenderer.Grid) {
      this.gridster.renderer.setStyle(this.gridster.el, 'grid-gap', this.gridster.$options.margin + 'px');
    } else {
      this.gridster.renderer.setStyle(this.gridster.el, 'grid-gap', null);
    }
    let addClass = '';
    let removeClass1 = '';
    let removeClass2 = '';
    let removeClass3 = '';
    if (this.gridster.$options.gridType === GridType.Fit) {
      if (this.gridster.$options.gridRenderer === GridRenderer.Grid) {
        this.setGridsterRowsColumns('1fr', '1fr');
      } else {
        this.setGridsterRowsColumns(null, null);
      }
      addClass = GridType.Fit;
      removeClass1 = GridType.ScrollVertical;
      removeClass2 = GridType.ScrollHorizontal;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.ScrollVertical) {
      this.gridster.curRowHeight = this.gridster.curColWidth;
      if (this.gridster.$options.gridRenderer === GridRenderer.Grid) {
        this.setGridsterRowsColumns((this.gridster.curRowHeight - this.gridster.$options.margin) + 'px', '1fr');
      } else {
        this.setGridsterRowsColumns(null, null);
      }
      addClass = GridType.ScrollVertical;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollHorizontal;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.ScrollHorizontal) {
      this.gridster.curColWidth = this.gridster.curRowHeight;
      if (this.gridster.$options.gridRenderer === GridRenderer.Grid) {
        this.setGridsterRowsColumns('1fr', (this.gridster.curColWidth - this.gridster.$options.margin) + 'px');
      } else {
        this.setGridsterRowsColumns(null, null);
      }
      addClass = GridType.ScrollHorizontal;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollVertical;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.Fixed) {
      this.gridster.curColWidth = this.gridster.$options.fixedColWidth + this.gridster.$options.margin;
      this.gridster.curRowHeight = this.gridster.$options.fixedRowHeight + this.gridster.$options.margin;
      if (this.gridster.$options.gridRenderer === GridRenderer.Grid) {
        this.setGridsterRowsColumns(this.gridster.$options.fixedRowHeight + 'px', this.gridster.$options.fixedColWidth + 'px');
      } else {
        this.setGridsterRowsColumns(null, null);
      }
      addClass = GridType.Fixed;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollVertical;
      removeClass3 = GridType.ScrollHorizontal;
    } else if (this.gridster.$options.gridType === GridType.VerticalFixed) {
      this.gridster.curRowHeight = this.gridster.$options.fixedRowHeight + this.gridster.$options.margin;
      if (this.gridster.$options.gridRenderer === GridRenderer.Grid) {
        this.setGridsterRowsColumns(this.gridster.$options.fixedRowHeight + 'px', '1fr');
      } else {
        this.setGridsterRowsColumns(null, null);
      }
      addClass = GridType.ScrollVertical;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollHorizontal;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.HorizontalFixed) {
      this.gridster.curColWidth = this.gridster.$options.fixedColWidth + this.gridster.$options.margin;
      if (this.gridster.$options.gridRenderer === GridRenderer.Grid) {
        this.setGridsterRowsColumns('1fr', this.gridster.$options.fixedColWidth + 'px');
      } else {
        this.setGridsterRowsColumns(null, null);
      }
      addClass = GridType.ScrollHorizontal;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollVertical;
      removeClass3 = GridType.Fixed;
    }

    if (this.gridster.mobile) {
      this.gridster.renderer.setStyle(this.gridster.el, 'grid-auto-rows', null);
      this.gridster.renderer.setStyle(this.gridster.el, 'grid-auto-columns', null);
      this.gridster.renderer.removeClass(this.gridster.el, addClass);
    } else {
      this.gridster.renderer.addClass(this.gridster.el, addClass);
    }
    this.gridster.renderer.removeClass(this.gridster.el, removeClass1);
    this.gridster.renderer.removeClass(this.gridster.el, removeClass2);
    this.gridster.renderer.removeClass(this.gridster.el, removeClass3);
  }

  setGridsterRowsColumns(rows, columns): void {
    this.gridster.renderer.setStyle(this.gridster.el, 'grid-auto-rows', rows);
    this.gridster.renderer.setStyle(this.gridster.el, 'grid-auto-columns', columns);
  }

  getGridColumnStyle(i) {
    if (this.gridster.$options.gridRenderer === GridRenderer.Absolute) {
      return {
        transform: 'translateX(' + this.gridster.curColWidth * i + 'px)',
        width: this.gridster.curColWidth - this.gridster.$options.margin + 'px',
        height: this.gridster.gridRows.length * this.gridster.curRowHeight - this.gridster.$options.margin + 'px'
      };
    } else {
      return {
        gridColumn: (i + 1),
        gridRowStart: 1,
        gridRowEnd: this.gridster.gridRows.length + 1
      };
    }
  }

  getGridRowStyle(i) {
    if (this.gridster.$options.gridRenderer === GridRenderer.Absolute) {
      return {
        transform: 'translateY(' + this.gridster.curRowHeight * i + 'px)',
        width: this.gridster.gridColumns.length * this.gridster.curColWidth - this.gridster.$options.margin + 'px',
        height: this.gridster.curRowHeight - this.gridster.$options.margin + 'px'
      };
    } else {
      return {
        gridRow: (i + 1),
        gridColumnStart: 1,
        gridColumnEnd: this.gridster.gridColumns.length + 1
      };
    }
  }
}

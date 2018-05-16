import {Injectable, Renderer2} from '@angular/core';

import {GridsterComponentInterface} from './gridster.interface';
import {GridType} from './gridsterConfig.interface';
import {GridsterItem} from './gridsterItem.interface';

@Injectable()
export class GridsterRenderer {

  constructor(private gridster: GridsterComponentInterface) {
  }

  destroy(): void {
    delete this.gridster;
  }

  updateItem(el: any, item: GridsterItem, renderer: Renderer2) {
    if (this.gridster.mobile) {
      renderer.setStyle(el, 'transform', '');
      if (this.gridster.$options.keepFixedHeightInMobile) {
        renderer.setStyle(el, 'height', (item.rows * this.gridster.$options.fixedRowHeight) + 'px');
      } else {
        renderer.setStyle(el, 'height', (this.gridster.curWidth / 2 * item.rows) + 'px');
      }
      if (this.gridster.$options.keepFixedWidthInMobile) {
        renderer.setStyle(el, 'width', this.gridster.$options.fixedColWidth + 'px');
      } else {
        renderer.setStyle(el, 'width', '');
      }

      renderer.setStyle(el, 'margin-bottom', this.gridster.$options.margin + 'px');
      renderer.setStyle(el, 'margin-right', '');
    } else {
      const x = Math.round(this.gridster.curColWidth * item.x);
      const y = Math.round(this.gridster.curRowHeight * item.y);
      const width = this.gridster.curColWidth * item.cols - this.gridster.$options.margin;
      const height = (this.gridster.curRowHeight * item.rows - this.gridster.$options.margin);
      const transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      renderer.setStyle(el, 'transform', transform);
      renderer.setStyle(el, 'width', width + 'px');
      renderer.setStyle(el, 'height', height + 'px');
      let marginBottom: string | null = null;
      let marginRight: string | null = null;
      if (this.gridster.$options.outerMargin) {
        if (this.gridster.rows === item.rows + item.y) {
          if (this.gridster.$options.outerMarginBottom !== null) {
            marginBottom = this.gridster.$options.outerMarginBottom + 'px';
          } else {
            marginBottom = this.gridster.$options.margin + 'px';
          }
        }
        if (this.gridster.columns === item.cols + item.x) {
          if (this.gridster.$options.outerMarginBottom !== null) {
            marginRight = this.gridster.$options.outerMarginRight + 'px';
          } else {
            marginRight = this.gridster.$options.margin + 'px';
          }
        }
      }

      renderer.setStyle(el, 'margin-bottom', marginBottom);
      renderer.setStyle(el, 'margin-right', marginRight);
    }
  }

  updateGridster() {
    let addClass = '';
    let removeClass1 = '';
    let removeClass2 = '';
    let removeClass3 = '';
    if (this.gridster.$options.gridType === GridType.Fit) {
      addClass = GridType.Fit;
      removeClass1 = GridType.ScrollVertical;
      removeClass2 = GridType.ScrollHorizontal;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.ScrollVertical) {
      this.gridster.curRowHeight = this.gridster.curColWidth;
      addClass = GridType.ScrollVertical;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollHorizontal;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.ScrollHorizontal) {
      this.gridster.curColWidth = this.gridster.curRowHeight;
      addClass = GridType.ScrollHorizontal;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollVertical;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.Fixed) {
      this.gridster.curColWidth = this.gridster.$options.fixedColWidth +
        (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
      this.gridster.curRowHeight = this.gridster.$options.fixedRowHeight +
        (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
      addClass = GridType.Fixed;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollVertical;
      removeClass3 = GridType.ScrollHorizontal;
    } else if (this.gridster.$options.gridType === GridType.VerticalFixed) {
      this.gridster.curRowHeight = this.gridster.$options.fixedRowHeight +
        (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
      addClass = GridType.ScrollVertical;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollHorizontal;
      removeClass3 = GridType.Fixed;
    } else if (this.gridster.$options.gridType === GridType.HorizontalFixed) {
      this.gridster.curColWidth = this.gridster.$options.fixedColWidth +
        (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
      addClass = GridType.ScrollHorizontal;
      removeClass1 = GridType.Fit;
      removeClass2 = GridType.ScrollVertical;
      removeClass3 = GridType.Fixed;
    }

    if (this.gridster.mobile) {
      this.gridster.renderer.removeClass(this.gridster.el, addClass);
    } else {
      this.gridster.renderer.addClass(this.gridster.el, addClass);
    }
    this.gridster.renderer.removeClass(this.gridster.el, removeClass1);
    this.gridster.renderer.removeClass(this.gridster.el, removeClass2);
    this.gridster.renderer.removeClass(this.gridster.el, removeClass3);
  }

  getGridColumnStyle(i: number) {
    return {
      transform: 'translateX(' + this.gridster.curColWidth * i + 'px)',
      width: this.gridster.curColWidth - this.gridster.$options.margin + 'px',
      height: this.gridster.gridRows.length * this.gridster.curRowHeight - this.gridster.$options.margin + 'px'
    };
  }

  getGridRowStyle(i: number) {
    return {
      transform: 'translateY(' + this.gridster.curRowHeight * i + 'px)',
      width: this.gridster.gridColumns.length * this.gridster.curColWidth - this.gridster.$options.margin + 'px',
      height: this.gridster.curRowHeight - this.gridster.$options.margin + 'px'
    };
  }
}

import {Component, ElementRef, Host, OnDestroy, Renderer2, ViewEncapsulation} from '@angular/core';

import {GridsterComponent} from './gridster.component';

@Component({
  selector: 'gridster-preview',
  template: '',
  styleUrls: ['./gridsterPreview.css'],
  encapsulation: ViewEncapsulation.None
})
export class GridsterPreviewComponent implements OnDestroy {
  el: any;
  gridster: GridsterComponent;

  constructor(el: ElementRef, @Host() gridster: GridsterComponent, public renderer: Renderer2) {
    this.el = el.nativeElement;
    this.gridster = gridster;
    this.gridster.previewStyle = this.previewStyle.bind(this);
  }

  ngOnDestroy(): void {
    delete this.el;
    delete this.gridster.previewStyle;
    delete this.gridster;
  }

  previewStyle(drag?: boolean): void {
    if (!this.gridster.movingItem) {
      this.renderer.setStyle(this.el, 'display', 'none');
    } else {
      if (this.gridster.compact && drag) {
        this.gridster.compact.checkCompactItem(this.gridster.movingItem);
      }
      let margin: string;
      const curRowHeight = this.gridster.curRowHeight;
      const curColWidth = this.gridster.curColWidth;
      if (this.gridster.$options.outerMargin) {
        if (this.gridster.$options.outerMarginTop !== null) {
          margin = this.gridster.$options.outerMarginTop + 'px ';
        } else {
          margin = this.gridster.$options.margin + 'px ';
        }
        if (this.gridster.$options.outerMarginRight !== null) {
          margin += this.gridster.$options.outerMarginRight + 'px ';
        } else {
          margin += this.gridster.$options.margin + 'px ';
        }
        if (this.gridster.$options.outerMarginBottom !== null) {
          margin += this.gridster.$options.outerMarginBottom + 'px ';
        } else {
          margin += this.gridster.$options.margin + 'px ';
        }
        if (this.gridster.$options.outerMarginLeft !== null) {
          margin += this.gridster.$options.outerMarginLeft + 'px';
        } else {
          margin += this.gridster.$options.margin + 'px';
        }
      } else {
        margin = 0 + 'px';
      }
      this.renderer.setStyle(this.el, 'display', 'block');
      this.renderer.setStyle(this.el, 'height', (this.gridster.movingItem.rows * curRowHeight - this.gridster.$options.margin) + 'px');
      this.renderer.setStyle(this.el, 'width', (this.gridster.movingItem.cols * curColWidth - this.gridster.$options.margin) + 'px');
      this.renderer.setStyle(this.el, 'top', (this.gridster.movingItem.y * curRowHeight) + 'px');
      this.renderer.setStyle(this.el, 'left', (this.gridster.movingItem.x * curColWidth) + 'px');
      this.renderer.setStyle(this.el, 'margin', margin);
    }
  }
}

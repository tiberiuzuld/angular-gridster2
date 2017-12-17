import {Component, ElementRef, Host, OnDestroy, Renderer2} from '@angular/core';

import {GridsterComponent} from './gridster.component';

@Component({
  selector: 'gridster-preview',
  template: '',
  styleUrls: ['./gridsterPreview.css']
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

  previewStyle(): void {
    if (!this.gridster.movingItem) {
      this.renderer.setStyle(this.el, 'display', 'none');
    } else {
      let margin = 0;
      const curRowHeight = this.gridster.curRowHeight;
      const curColWidth = this.gridster.curColWidth;
      if (this.gridster.$options.outerMargin) {
        margin = this.gridster.$options.margin;
      }
      this.renderer.setStyle(this.el, 'display', 'block');
      this.renderer.setStyle(this.el, 'height', (this.gridster.movingItem.rows * curRowHeight - margin) + 'px');
      this.renderer.setStyle(this.el, 'width', (this.gridster.movingItem.cols * curColWidth - margin) + 'px');
      this.renderer.setStyle(this.el, 'top', (this.gridster.movingItem.y * curRowHeight + margin) + 'px');
      this.renderer.setStyle(this.el, 'left', (this.gridster.movingItem.x * curColWidth + margin) + 'px');
      this.renderer.setStyle(this.el, 'marginBottom', margin + 'px');
    }
  }
}

import {Component, ElementRef, Host, Renderer2} from '@angular/core';
import {GridsterComponent} from './gridster.component';

@Component({
  selector: 'gridster-preview',
  template: '',
  styleUrls: ['./gridsterPreview.css']
})
export class GridsterPreviewComponent {
  el: any;
  gridster: GridsterComponent;

  constructor(el: ElementRef, @Host() gridster: GridsterComponent, public renderer: Renderer2) {
    this.el = el.nativeElement;
    this.gridster = gridster;
    this.gridster.previewStyle = this.previewStyle.bind(this);
  }

  previewStyle() {
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
      this.renderer.setStyle(this.el, 'height', (this.gridster.movingItem.$item.rows * curRowHeight - margin) + 'px');
      this.renderer.setStyle(this.el, 'width', (this.gridster.movingItem.$item.cols * curColWidth - margin) + 'px');
      this.renderer.setStyle(this.el, 'top', (this.gridster.movingItem.$item.y * curRowHeight + margin) + 'px');
      this.renderer.setStyle(this.el, 'left', (this.gridster.movingItem.$item.x * curColWidth + margin) + 'px');
      this.renderer.setStyle(this.el, 'marginBottom', margin + 'px');
    }
  }
}

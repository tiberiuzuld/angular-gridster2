import {Component, ElementRef, Host} from '@angular/core';
import {GridsterComponent} from './gridster.component';

@Component({
  selector: 'gridster-preview',
  template: ''
})
export class GridsterPreviewComponent {
  element: HTMLElement;
  gridster: GridsterComponent;

  constructor(el: ElementRef, @Host() gridster: GridsterComponent) {
    this.element = el.nativeElement;
    this.gridster = gridster;
    this.gridster.previewStyle = this.previewStyle.bind(this);
  }

  previewStyle() {
    if (!this.gridster.movingItem) {
      this.element.style.display = 'none';
    } else {
      let margin = 0;
      const curRowHeight = this.gridster.state.curRowHeight;
      const curColWidth = this.gridster.state.curColWidth;
      if (this.gridster.options.outerMargin) {
        margin = this.gridster.state.options.margin;
      }
      this.element.style.display = 'block';
      this.element.style.height = (this.gridster.movingItem.rows * curRowHeight - margin) + 'px';
      this.element.style.width = (this.gridster.movingItem.cols * curColWidth - margin) + 'px';
      this.element.style.top = (this.gridster.movingItem.y * curRowHeight + margin) + 'px';
      this.element.style.left = (this.gridster.movingItem.x * curColWidth + margin) + 'px';
      this.element.style.marginBottom = margin + 'px';
    }
  }
}

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
      this.renderer.setStyle(this.el, 'display', null);
    } else {
      if (this.gridster.compact && drag) {
        this.gridster.compact.checkCompactItem(this.gridster.movingItem);
      }
      this.renderer.setStyle(this.el, 'display', 'block');
      this.renderer.setStyle(this.el, 'grid-column-start', (this.gridster.movingItem.x + 1));
      this.renderer.setStyle(this.el, 'grid-column-end', ((this.gridster.movingItem.x + 1) + this.gridster.movingItem.cols));
      this.renderer.setStyle(this.el, 'grid-row-start', (this.gridster.movingItem.y + 1));
      this.renderer.setStyle(this.el, 'grid-row-end', ((this.gridster.movingItem.y + 1) + this.gridster.movingItem.rows));
    }
  }
}

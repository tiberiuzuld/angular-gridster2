import {Component, ElementRef, Host, OnDestroy, Renderer2, ViewEncapsulation, Inject} from '@angular/core';

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

  constructor(@Inject(ElementRef)  el: ElementRef,  gridster: GridsterComponent, @Inject(Renderer2) public renderer: Renderer2) {
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
      this.renderer.setStyle(this.el, 'display', '');
    } else {
      if (this.gridster.compact && drag) {
        this.gridster.compact.checkCompactItem(this.gridster.movingItem);
      }
      this.renderer.setStyle(this.el, 'display', 'block');
      this.gridster.gridRenderer.updateItem(this.el, this.gridster.movingItem, this.renderer);
    }
  }
}

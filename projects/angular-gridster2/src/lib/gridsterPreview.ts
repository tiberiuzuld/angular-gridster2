import { Component, ElementRef, inject, Renderer2, ViewEncapsulation } from '@angular/core';
import { Gridster } from './gridster';
import { GridsterItemConfig } from './gridsterItemConfig';

@Component({
  selector: 'gridster-preview',
  template: '',
  styleUrl: './gridsterPreview.css',
  encapsulation: ViewEncapsulation.None
})
export class GridsterPreview {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly gridster = inject(Gridster);
  private readonly renderer = inject(Renderer2);

  previewStyle(item: GridsterItemConfig | null): void {
    if (item) {
      this.renderer.setStyle(this.el, 'display', 'block');
      this.gridster.gridRenderer.updateItem(this.el, item, this.renderer);
    } else {
      this.renderer.setStyle(this.el, 'display', '');
    }
  }
}

import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { GridsterItem } from './gridsterItem.interface';
import { GridsterRenderer } from './gridsterRenderer.service';

@Component({
  selector: 'gridster-preview',
  template: '',
  styleUrl: './gridsterPreview.css',
  encapsulation: ViewEncapsulation.None
})
export class GridsterPreviewComponent {
  @Input() gridRenderer: GridsterRenderer;
  private el: HTMLElement;

  constructor(
    el: ElementRef,
    private renderer: Renderer2
  ) {
    this.el = el.nativeElement;
  }

  previewStyle(item: GridsterItem | null): void {
    if (item) {
      this.renderer.setStyle(this.el, 'display', 'block');
      this.gridRenderer.updateItem(this.el, item, this.renderer);
    } else {
      this.renderer.setStyle(this.el, 'display', '');
    }
  }
}

import {
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { GridsterItem } from './gridsterItem.interface';
import { GridsterRenderer } from './gridsterRenderer.service';

@Component({
    selector: 'gridster-preview',
    template: '',
    styleUrls: ['./gridsterPreview.css'],
    encapsulation: ViewEncapsulation.None,
})
export class GridsterPreviewComponent implements OnInit, OnDestroy {
    @Input() previ;

    ewStyle$: EventEmitter<GridsterItem | null>;

    @Input() gridRenderer: GridsterRenderer;

    private el: HTMLElement;

    private sub: Subscription;

    constructor(
        @Inject(ElementRef) el: ElementRef,
        @Inject(Renderer2) private renderer: Renderer2,
    ) {
        this.el = el.nativeElement;
    }

    ngOnInit(): void {
        this.sub = this.previewStyle$.subscribe((options) => this.previewStyle(options));
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
        // @ts-ignore
        delete this.el;
    }

    private previewStyle(item: GridsterItem | null): void {
        if (item) {
            this.renderer.setStyle(this.el, 'display', 'block');
            this.gridRenderer.updateItem(this.el, item, this.renderer);
        } else {
            this.renderer.setStyle(this.el, 'display', '');
        }
    }
}

import { ChangeDetectionStrategy, Component, EventEmitter, input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { GridsterItemConfig } from 'angular-gridster2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget-a',
  template: '{{widget().type}}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class WidgetA implements OnInit, OnDestroy {
  widget = input.required<GridsterItemConfig>();
  resizeEvent = input.required<EventEmitter<GridsterItemConfig>>();

  resizeSub: Subscription;

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent().subscribe(widget => {
      if (widget === this.widget()) {
        // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        console.log(widget);
      }
    });
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }
}

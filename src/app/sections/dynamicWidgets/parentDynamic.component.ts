import { ChangeDetectionStrategy, Component, EventEmitter, input, ViewEncapsulation } from '@angular/core';
import { GridsterItemConfig } from 'angular-gridster2';
import { WidgetAComponent } from './widgetA.component';
import { WidgetBComponent } from './widgetB.component';
import { WidgetCComponent } from './widgetC.component';

@Component({
  selector: 'app-parent-dynamic',
  templateUrl: './parentDynamic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [WidgetAComponent, WidgetBComponent, WidgetCComponent]
})
export class ParentDynamicComponent {
  widget = input.required<GridsterItemConfig>();
  resizeEvent = input.required<EventEmitter<GridsterItemConfig>>();
}

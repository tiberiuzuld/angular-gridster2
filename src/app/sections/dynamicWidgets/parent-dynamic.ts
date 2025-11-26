import { ChangeDetectionStrategy, Component, EventEmitter, input, ViewEncapsulation } from '@angular/core';
import { GridsterItemConfig } from 'angular-gridster2';
import { WidgetA } from './widget-a';
import { WidgetB } from './widget-b';
import { WidgetC } from './widget-c';

@Component({
  selector: 'app-parent-dynamic',
  templateUrl: './parent-dynamic.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [WidgetA, WidgetB, WidgetC]
})
export class ParentDynamic {
  widget = input.required<GridsterItemConfig>();
  resizeEvent = input.required<EventEmitter<GridsterItemConfig>>();
}

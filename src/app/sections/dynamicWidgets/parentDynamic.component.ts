import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { WidgetAComponent } from './widgetA.component';
import { WidgetBComponent } from './widgetB.component';
import { WidgetCComponent } from './widgetC.component';

@Component({
  selector: 'app-parent-dynamic',
  templateUrl: './parentDynamic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgIf, WidgetAComponent, WidgetBComponent, WidgetCComponent]
})
export class ParentDynamicComponent {
  @Input()
  widget;
  @Input()
  resizeEvent;
}

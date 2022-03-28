import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-parent-dynamic',
  templateUrl: './parentDynamic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ParentDynamicComponent {
  @Input()
  widget;
  @Input()
  resizeEvent;
}

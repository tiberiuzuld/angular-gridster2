import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-track-by-item',
  template: `
    <div class="button-holder">
      <div style="font-size: 30px">ID: {{ id }}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class TrackByItem implements OnInit {
  @Input() id: string;

  ngOnInit(): void {
    console.info(`Init ${this.id}`);
  }
}

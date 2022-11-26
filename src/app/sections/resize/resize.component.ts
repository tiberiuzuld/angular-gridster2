import { NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import {
  DisplayGrid,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridsterItemComponentInterface,
  GridType,
  Resizable
} from 'angular-gridster2';
import { MarkdownModule } from 'ngx-markdown';

interface SafeResizable extends Resizable {
  handles: {
    s: boolean;
    e: boolean;
    n: boolean;
    w: boolean;
    se: boolean;
    ne: boolean;
    sw: boolean;
    nw: boolean;
  };
}

interface Safe extends GridsterConfig {
  resizable: SafeResizable;
}

@Component({
  selector: 'app-resize',
  templateUrl: './resize.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,

    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,

    MarkdownModule,

    GridsterComponent,
    GridsterItemComponent
  ]
})
export class ResizeComponent implements OnInit {
  options: Safe;
  dashboard: Array<GridsterItem>;

  static eventStop(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
    event: MouseEvent
  ): void {
    console.info('eventStop', item, itemComponent, event);
  }

  static eventStart(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
    event: MouseEvent
  ): void {
    console.info('eventStart', item, itemComponent, event);
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      resizable: {
        delayStart: 0,
        enabled: true,
        start: ResizeComponent.eventStart,
        stop: ResizeComponent.eventStop,
        handles: {
          s: true,
          e: true,
          n: true,
          w: true,
          se: true,
          ne: true,
          sw: true,
          nw: true
        }
      }
    };

    this.dashboard = [
      { cols: 2, rows: 1, y: 0, x: 0 },
      { cols: 2, rows: 2, y: 0, x: 2 },
      { cols: 1, rows: 1, y: 0, x: 4 },
      { cols: 3, rows: 2, y: 1, x: 4 },
      { cols: 1, rows: 1, y: 4, x: 5 },
      { cols: 1, rows: 1, y: 2, x: 1 },
      { cols: 2, rows: 2, y: 5, x: 5 },
      { cols: 2, rows: 2, y: 3, x: 2 },
      { cols: 2, rows: 1, y: 2, x: 2 },
      { cols: 1, rows: 1, y: 3, x: 4 },
      { cols: 1, rows: 1, y: 0, x: 6 }
    ];
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event: MouseEvent | TouchEvent, item): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void {
    this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
  }
}

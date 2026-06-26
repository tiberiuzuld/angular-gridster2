import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

import { DisplayGrid, Gridster, GridsterConfig, GridsterItem, GridsterItemConfig, GridType } from 'angular-gridster2';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-resize',
  templateUrl: './resize.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    MarkdownComponent,
    GridsterItem,
    Gridster,
    MatIcon,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatLabel,
    MatMiniFabButton,
    MatInput
  ]
})
export class Resize {
  options: GridsterConfig = {
    gridType: GridType.Fit,
    displayGrid: DisplayGrid.Always,
    resizable: {
      delayStart: 0,
      enabled: true,
      start: Resize.eventStart,
      stop: Resize.eventStop,
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
  dashboard: GridsterItemConfig[] = [
    { cols: 2, rows: 1, y: 0, x: 0, id: 1 },
    { cols: 2, rows: 2, y: 0, x: 2, id: 2 },
    { cols: 1, rows: 1, y: 0, x: 4, id: 3 },
    { cols: 3, rows: 2, y: 1, x: 4, id: 4 },
    { cols: 1, rows: 1, y: 4, x: 5, id: 5 },
    { cols: 1, rows: 1, y: 2, x: 1, id: 6 },
    { cols: 2, rows: 2, y: 5, x: 5, id: 7 },
    { cols: 2, rows: 2, y: 3, x: 2, id: 8 },
    { cols: 2, rows: 1, y: 2, x: 2, id: 9 },
    { cols: 1, rows: 1, y: 3, x: 4, id: 10 },
    { cols: 1, rows: 1, y: 0, x: 6, id: 11 }
  ];

  static eventStop(item: GridsterItemConfig, itemComponent: GridsterItem, event: MouseEvent): void {
    console.info('eventStop', item, itemComponent, event);
  }

  static eventStart(item: GridsterItemConfig, itemComponent: GridsterItem, event: MouseEvent): void {
    console.info('eventStart', item, itemComponent, event);
  }

  changedOptions(): void {
    this.options = Object.assign({}, this.options);
  }

  removeItem($event: MouseEvent | TouchEvent, item: GridsterItemConfig): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void {
    this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1, id: this.dashboard.at(-1)?.id + 1 });
  }
}

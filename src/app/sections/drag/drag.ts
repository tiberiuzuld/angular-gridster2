import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DisplayGrid, Gridster, GridsterConfig, GridsterItemConfig, GridsterItem, GridType } from 'angular-gridster2';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-drag',
  templateUrl: './drag.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule, MarkdownModule, Gridster, GridsterItem]
})
export class Drag implements OnInit {
  options: GridsterConfig;
  dashboard: GridsterItemConfig[];

  static eventStart(item: GridsterItemConfig, itemComponent: GridsterItem, event: MouseEvent): void {
    console.info('eventStart', item, itemComponent, event);
  }

  static eventStop(item: GridsterItemConfig, itemComponent: GridsterItem, event: MouseEvent): void {
    console.info('eventStop', item, itemComponent, event);
  }

  static overlapEvent(source: GridsterItemConfig, target: GridsterItemConfig, grid: Gridster): void {
    console.log('overlap', source, target, grid);
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      pushItems: true,
      swap: false,
      draggable: {
        delayStart: 0,
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: false,
        dragHandleClass: 'drag-handler',
        stop: Drag.eventStop,
        start: Drag.eventStart,
        dropOverItems: false,
        dropOverItemsCallback: Drag.overlapEvent
      },
      resizable: {
        enabled: true
      }
    };

    this.dashboard = [
      { cols: 2, rows: 1, y: 0, x: 0, id: 1 },
      { cols: 2, rows: 2, y: 0, x: 2, hasContent: true, id: 2 },
      { cols: 1, rows: 1, y: 0, x: 4, id: 3 },
      { cols: 1, rows: 1, y: 2, x: 5, id: 4 },
      { cols: 1, rows: 1, y: 1, x: 0, id: 5 },
      { cols: 1, rows: 1, y: 1, x: 0, id: 6 },
      {
        cols: 2,
        rows: 2,
        y: 3,
        x: 5,
        minItemRows: 2,
        minItemCols: 2,
        label: 'Min rows & cols = 2',
        id: 7
      },
      {
        cols: 2,
        rows: 2,
        y: 2,
        x: 0,
        maxItemRows: 2,
        maxItemCols: 2,
        label: 'Max rows & cols = 2',
        id: 8
      },
      {
        cols: 2,
        rows: 1,
        y: 2,
        x: 2,
        dragEnabled: true,
        resizeEnabled: true,
        label: 'Drag&Resize Enabled',
        id: 9
      },
      {
        cols: 1,
        rows: 1,
        y: 2,
        x: 4,
        dragEnabled: false,
        resizeEnabled: false,
        label: 'Drag&Resize Disabled',
        id: 10
      },
      { cols: 1, rows: 1, y: 2, x: 6, id: 11 }
    ];
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
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

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DisplayGrid, Gridster, GridsterConfig, GridsterItemConfig, GridsterItem, GridType } from 'angular-gridster2';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-grid-sizes',
  templateUrl: './grid-sizes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatButtonModule, MatIconModule, MatInputModule, MarkdownModule, Gridster, GridsterItem]
})
export class GridSizes {
  options: GridsterConfig = {
    gridType: GridType.Fit,
    displayGrid: DisplayGrid.Always,
    pushItems: true,
    draggable: {
      enabled: true
    },
    resizable: {
      enabled: true
    },
    minCols: 1,
    maxCols: 100,
    minRows: 1,
    maxRows: 100,
    maxItemCols: 100,
    minItemCols: 1,
    maxItemRows: 100,
    minItemRows: 1,
    maxItemArea: 2500,
    minItemArea: 1,
    defaultItemCols: 1,
    defaultItemRows: 1,
    addEmptyRowsCount: 2
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

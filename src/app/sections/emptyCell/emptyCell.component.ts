import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DisplayGrid, Gridster, GridsterConfig, GridsterItemConfig, GridsterItem, GridType } from 'angular-gridster2';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-empty-cell',
  templateUrl: './emptyCell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule, MarkdownModule, Gridster, GridsterItem]
})
export class EmptyCellComponent implements OnInit {
  options: GridsterConfig;
  dashboard: GridsterItemConfig[];

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellClickCallback: this.emptyCellClick.bind(this),
      emptyCellContextMenuCallback: this.emptyCellClick.bind(this),
      emptyCellDropCallback: this.emptyCellClick.bind(this),
      emptyCellDragCallback: this.emptyCellClick.bind(this),
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50
    };

    this.dashboard = [
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
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  emptyCellClick(event: MouseEvent, item: GridsterItemConfig): void {
    console.info('empty cell click', event, item);
    item.id = this.dashboard.at(-1)?.id + 1;
    this.dashboard.push(item);
  }

  removeItem($event: MouseEvent | TouchEvent, item: GridsterItemConfig): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void {
    this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1, id: this.dashboard.at(-1)?.id + 1 });
  }

  dragStartHandler(ev: DragEvent): void {
    if (ev.dataTransfer) {
      ev.dataTransfer.setData('text/plain', 'Drag Me Button');
      ev.dataTransfer.dropEffect = 'copy';
    }
  }
}

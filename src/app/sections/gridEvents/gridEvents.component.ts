import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DisplayGrid, Gridster, GridsterConfig, GridsterItemConfig, GridsterItem, GridType } from 'angular-gridster2';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-grid-events',
  templateUrl: './gridEvents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonModule, MatIconModule, MarkdownModule, Gridster, GridsterItem]
})
export class GridEventsComponent implements OnInit {
  options: GridsterConfig;
  dashboard: GridsterItemConfig[];
  remove: boolean;

  static itemChange(item: GridsterItemConfig, itemComponent: GridsterItem): void {
    console.info('itemChanged', item, itemComponent);
  }

  static itemResize(item: GridsterItemConfig, itemComponent: GridsterItem): void {
    console.info('itemResized', item, itemComponent);
  }

  static itemInit(item: GridsterItemConfig, itemComponent: GridsterItem): void {
    console.info('itemInitialized', item, itemComponent);
  }

  static itemRemoved(item: GridsterItemConfig, itemComponent: GridsterItem): void {
    console.info('itemRemoved', item, itemComponent);
  }

  static itemValidate(item: GridsterItemConfig): boolean {
    return item.cols > 0 && item.rows > 0;
  }

  static gridInit(grid: Gridster): void {
    console.info('gridInit', grid);
  }

  static gridDestroy(grid: Gridster): void {
    console.info('gridDestroy', grid);
  }

  static gridSizeChanged(grid: Gridster): void {
    console.info('gridSizeChanged', grid);
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      initCallback: GridEventsComponent.gridInit,
      destroyCallback: GridEventsComponent.gridDestroy,
      gridSizeChangedCallback: GridEventsComponent.gridSizeChanged,
      itemChangeCallback: GridEventsComponent.itemChange,
      itemResizeCallback: GridEventsComponent.itemResize,
      itemInitCallback: GridEventsComponent.itemInit,
      itemRemovedCallback: GridEventsComponent.itemRemoved,
      itemValidateCallback: GridEventsComponent.itemValidate,
      pushItems: true,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      }
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

  removeItem($event: MouseEvent | TouchEvent, item: GridsterItemConfig): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void {
    this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1, id: this.dashboard.at(-1)?.id + 1 });
  }

  destroy(): void {
    this.remove = !this.remove;
  }
}

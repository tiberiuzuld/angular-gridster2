import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

import {
  DisplayGrid,
  GridsterComponentInterface,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType
} from '../../../lib';

@Component({
  selector: 'gridster-grid-events',
  templateUrl: './gridEvents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GridEventsComponent implements OnInit {
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  remove: boolean;

  static itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
    console.info('itemChanged', item, itemComponent);
  }

  static itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
    console.info('itemResized', item, itemComponent);
  }

  static itemInit(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
    console.info('itemInitialized', item, itemComponent);
  }

  static itemRemoved(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
    console.info('itemRemoved', item, itemComponent);
  }

  static gridInit(grid: GridsterComponentInterface) {
    console.info('gridInit', grid);
  }

  static gridDestroy(grid: GridsterComponentInterface) {
    console.info('gridDestroy', grid);
  }

  ngOnInit() {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      initCallback: GridEventsComponent.gridInit,
      destroyCallback: GridEventsComponent.gridDestroy,
      itemChangeCallback: GridEventsComponent.itemChange,
      itemResizeCallback: GridEventsComponent.itemResize,
      itemInitCallback: GridEventsComponent.itemInit,
      itemRemovedCallback: GridEventsComponent.itemRemoved,
      pushItems: true,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      }
    };

    this.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0},
      {cols: 2, rows: 2, y: 0, x: 2},
      {cols: 1, rows: 1, y: 0, x: 4},
      {cols: 3, rows: 2, y: 1, x: 4},
      {cols: 1, rows: 1, y: 4, x: 5},
      {cols: 1, rows: 1, y: 2, x: 1},
      {cols: 2, rows: 2, y: 5, x: 5},
      {cols: 2, rows: 2, y: 3, x: 2},
      {cols: 2, rows: 1, y: 2, x: 2},
      {cols: 1, rows: 1, y: 3, x: 4},
      {cols: 1, rows: 1, y: 0, x: 6}
    ];
  }

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    this.dashboard.push({});
  }

  destroy() {
    this.remove = !this.remove;
  }
}

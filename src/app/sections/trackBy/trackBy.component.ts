import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  CompactType,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType
} from 'angular-gridster2';

@Component({
  selector: 'app-trackby',
  templateUrl: './trackBy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TrackByComponent implements OnInit {
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  dashboardOriginal: Array<GridsterItem>;

  static itemInit(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    console.info('itemInitialized', item, itemComponent);
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      compactType: CompactType.None,
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
      defaultItemRows: 1
    };

    this.dashboard = [
      {
        cols: 2,
        rows: 1,
        y: 0,
        x: 0,
        initCallback: TrackByComponent.itemInit,
        minItemCols: 1,
        maxItemCols: 100,
        maxItemRows: 100,
        minItemRows: 1,
        minItemArea: 1,
        maxItemArea: 2500,
        dragEnabled: true,
        resizeEnabled: true,
        compactEnabled: true,
        id: 0
      },
      { cols: 2, rows: 2, y: 0, x: 2, id: 1 },
      { cols: 1, rows: 1, y: 0, x: 4, id: 2 },
      { cols: 3, rows: 2, y: 1, x: 4, id: 3 },
      { cols: 1, rows: 1, y: 2, x: 1, id: 4 }
    ];
    this.dashboardOriginal = this.dashboard.map(x => ({ ...x }));
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  reset(): void {
    this.dashboard = this.dashboardOriginal.map(x => ({ ...x }));
  }

  trackBy(index: number, item: GridsterItem): number {
    return item.id;
  }

  addItem(): void {
    this.dashboard.push({
      x: 0,
      y: 0,
      cols: 1,
      rows: 1,
      id: this.dashboard.length
    });
  }

  removeItem($event: MouseEvent | TouchEvent, item): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }
}

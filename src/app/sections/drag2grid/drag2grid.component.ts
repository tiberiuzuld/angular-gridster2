import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

import {DisplayGrid, GridsterConfig, GridsterItem, GridType} from '../../../lib';

@Component({
  selector: 'gridster-drag-grid',
  templateUrl: './drag2grid.component.html',
  styleUrls: ['./drag2grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DragGridComponent implements OnInit {
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  options2: GridsterConfig;
  dashboard2: Array<GridsterItem>;

  ngOnInit() {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      pushItems: true,
      swap: false,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true
      }
    };

    this.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0},
      {cols: 1, rows: 1, y: 0, x: 2},
      {cols: 1, rows: 1, y: 1, x: 1},
      {cols: 1, rows: 1, y: 1, x: 0}
    ];

    this.options2 = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      pushItems: true,
      swap: false,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true
      }
    };

    this.dashboard2 = [
      {cols: 2, rows: 1, y: 0, x: 0},
      {cols: 1, rows: 1, y: 0, x: 2},
      {cols: 1, rows: 1, y: 1, x: 1},
      {cols: 1, rows: 1, y: 1, x: 0}
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

  changedOptions2() {
    if (this.options2.api && this.options2.api.optionsChanged) {
      this.options2.api.optionsChanged();
    }
  }

  removeItem2($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard2.splice(this.dashboard2.indexOf(item), 1);
  }

  addItem2() {
    this.dashboard2.push({});
  }
}

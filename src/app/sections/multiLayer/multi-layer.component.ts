/**
 * Created by YISH on 2020/02/28.
 */
import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DisplayGrid, GridsterConfig, GridsterItem, GridType} from 'angular-gridster2';

@Component({
  selector: 'app-swap',
  templateUrl: './multi-layer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MultiLayerComponent implements OnInit {
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;

  // noinspection DuplicatedCode
  ngOnInit() {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      pushItems: false,
      swap: true,
      allowMultiLayer: true,
      defaultLayerIndex: 1,
      baseLayerIndex: 2,
      maxLayerIndex: 2,
      swapWhileDragging: false,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      }
    };

    this.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0, layerIndex: 2},
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
  bringToFront(item: GridsterItem) {
    if (item.layerIndex === undefined) {
      item.layerIndex = 2;
    } else {
      item.layerIndex += 1;
    }
  }
  sendToBack(item: GridsterItem) {
    if (item.layerIndex === undefined) {
      item.layerIndex = 0;
    } else {
      item.layerIndex -= 1;
    }
  }

  removeItem($event, item: GridsterItem) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    this.dashboard.push({x: 0, y: 0, cols: 2, rows: 1});
  }
}

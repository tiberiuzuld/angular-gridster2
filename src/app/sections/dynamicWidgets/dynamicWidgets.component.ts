import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType
} from 'angular-gridster2';

@Component({
  selector: 'app-dynamic-widgets',
  templateUrl: './dynamicWidgets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DynamicWidgetsComponent implements OnInit {
  options: GridsterConfig;
  dashboard: GridsterItem[];
  resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      scrollToNewItems: false,
      disableWarnings: false,
      ignoreMarginInRow: false,
      itemResizeCallback: item => {
        // update DB with new size
        // send the update to widgets
        this.resizeEvent.emit(item);
      }
    };

    this.dashboard = [
      { cols: 2, rows: 1, y: 0, x: 0, type: 'widgetA' },
      { cols: 2, rows: 2, y: 0, x: 2, type: 'widgetB' },
      { cols: 2, rows: 1, y: 1, x: 0, type: 'widgetC' }
    ];
  }
}

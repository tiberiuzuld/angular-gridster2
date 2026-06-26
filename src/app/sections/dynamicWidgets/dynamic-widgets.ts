import { Component, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { DisplayGrid, Gridster, GridsterConfig, GridsterItem, GridsterItemConfig, GridType } from 'angular-gridster2';
import { MarkdownComponent } from 'ngx-markdown';
import { ParentDynamic } from './parent-dynamic';

@Component({
  selector: 'app-dynamic-widgets',
  templateUrl: './dynamic-widgets.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MarkdownComponent, Gridster, GridsterItem, ParentDynamic, MatButton, MatIcon]
})
export class DynamicWidgets implements OnDestroy {
  options: GridsterConfig = {
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
  dashboard: GridsterItemConfig[] = [
    { cols: 2, rows: 1, y: 0, x: 0, type: 'widgetA', id: 1 },
    { cols: 2, rows: 2, y: 0, x: 2, type: 'widgetB', id: 2 },
    { cols: 2, rows: 1, y: 1, x: 0, type: 'widgetC', id: 3 }
  ];
  resizeEvent = new EventEmitter<GridsterItemConfig>();

  ngOnDestroy(): void {
    this.resizeEvent.complete();
  }
}

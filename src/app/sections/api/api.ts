import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CompactType, Gridster, GridsterConfig, GridsterItem, GridsterItemConfig, GridsterPush, GridType } from 'angular-gridster2';
import { MarkdownModule } from 'ngx-markdown';
import { GridsterApi } from '../../../../projects/angular-gridster2/src/lib/gridsterConfig';

@Component({
  selector: 'app-api',
  templateUrl: './api.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonModule, MatIconModule, MarkdownModule, Gridster, GridsterItem]
})
export class Api {
  options: GridsterConfig = {
    initCallback: (gridster, gridsterApi) => (this.gridApi = gridsterApi),
    gridType: GridType.Fit,
    compactType: CompactType.None,
    pushItems: true,
    draggable: {
      enabled: true
    },
    resizable: {
      enabled: true
    }
  };
  dashboard: GridsterItemConfig[] = [
    { cols: 2, rows: 1, y: 0, x: 0, initCallback: this.initItem.bind(this), id: 1 },
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
  itemToPush: GridsterItem;
  gridApi: GridsterApi;

  removeItem($event: MouseEvent | TouchEvent, item: GridsterItemConfig): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void {
    this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1, id: this.dashboard.at(-1)?.id + 1 });
  }

  initItem(item: GridsterItemConfig, itemComponent: GridsterItem): void {
    this.itemToPush = itemComponent;
  }

  pushItem(): void {
    const push = new GridsterPush(this.itemToPush); // init the service
    this.itemToPush.$item().rows += 4; // move/resize your item
    if (push.pushItems(push.fromNorth)) {
      // push items from a direction
      push.checkPushBack(); // check for items can restore to original position
      push.setPushedItems(); // save the items pushed
      this.itemToPush.setSize();
      this.itemToPush.checkItemChanges(this.itemToPush.$item(), this.itemToPush.item());
    } else {
      this.itemToPush.$item().rows -= 4;
      push.restoreItems(); // restore to initial state the pushed items
    }
    push.destroy(); // destroy push instance
    // similar for GridsterPushResize and GridsterSwap
  }

  getItemComponent(): void {
    if (this.gridApi) {
      console.log(this.gridApi.getItemComponent(this.dashboard[0]));
    }
  }
}

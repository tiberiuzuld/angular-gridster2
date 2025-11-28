import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CompactType, DisplayGrid, Gridster, GridsterConfig, GridsterItemConfig, GridsterItem, GridType } from 'angular-gridster2';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-items',
  templateUrl: './items.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatInputModule, MatSelectModule, MarkdownModule, GridsterItem, Gridster]
})
export class Items {
  options: GridsterConfig = {
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
  dashboard: GridsterItemConfig[] = [
    {
      id: 1,
      cols: 4,
      rows: 3,
      y: 0,
      x: 0,
      initCallback: Items.itemInit,
      itemAspectRatio: 4 / 3,
      minItemCols: 1,
      maxItemCols: 100,
      maxItemRows: 100,
      minItemRows: 1,
      minItemArea: 1,
      maxItemArea: 2500,
      dragEnabled: true,
      resizeEnabled: true,
      compactEnabled: true,
      resizableHandles: {
        s: true,
        e: true,
        n: true,
        w: true,
        se: true,
        ne: true,
        sw: true,
        nw: true
      }
    },
    { id: 2, cols: 1, rows: 1, y: 20, x: 20 }
  ];

  itemConfig: GridsterItemConfig = {
    cols: 4,
    rows: 3,
    y: 0,
    x: 0,
    itemAspectRatio: 4 / 3,
    minItemCols: 1,
    maxItemCols: 100,
    maxItemRows: 100,
    minItemRows: 1,
    minItemArea: 1,
    maxItemArea: 2500,
    dragEnabled: true,
    resizeEnabled: true,
    compactEnabled: true,
    resizableHandles: {
      s: true,
      e: true,
      n: true,
      w: true,
      se: true,
      ne: true,
      sw: true,
      nw: true
    }
  };

  static itemInit(item: GridsterItemConfig, itemComponent: GridsterItem): void {
    console.info('itemInitialized', item, itemComponent);
  }

  changedAspectRatio() {
    if (this.itemConfig.itemAspectRatio === 1) {
      this.itemConfig.rows = this.itemConfig.cols;
    } else if (this.itemConfig.itemAspectRatio === 4 / 3) {
      this.itemConfig.cols = 4;
      this.itemConfig.rows = 3;
    } else if (this.itemConfig.itemAspectRatio === 16 / 9) {
      this.itemConfig.cols = 16;
      this.itemConfig.rows = 9;
    }
    this.changedItemConfig();
  }

  changedItemConfig(): void {
    this.dashboard[0] = { id: this.dashboard[0].id, ...this.itemConfig };
  }

  changeGridConfig(): void {
    this.options = Object.assign({}, this.options);
  }

  removeItem($event: MouseEvent | TouchEvent, item: GridsterItemConfig): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void {
    this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
  }
}

import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';

@Injectable()
export class GridsterPush {
  static pushItems(gridsterItem: GridsterItemComponent) {
    if (gridsterItem.gridster.$options.pushItems) {
      this.push(gridsterItem);
    }
  }

  private static push(gridsterItem: GridsterItemComponent) {
    let gridsterItemCollision = gridsterItem.gridster.findItemWithItem(gridsterItem);
    if (gridsterItemCollision && gridsterItemCollision.$item.y <= gridsterItem.$item.y + gridsterItem.$item.rows) {
      gridsterItemCollision.$item.y += 1;
      gridsterItemCollision.setSize(true);
      GridsterPush.pushItems(gridsterItemCollision);
    }

  }
}

import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';

@Injectable()
export class GridsterSwap {
  static GridsterSwap(gridsterItem: GridsterItemComponent, elemPosition) {
    const position = gridsterItem.gridster.pixelsToPosition(elemPosition[0], elemPosition[1], Math.round);
    let x = gridsterItem.$item.x;
    let y = gridsterItem.$item.y;
    gridsterItem.$item.x = position[0];
    gridsterItem.$item.y = position[1];
    const swapItem = gridsterItem.gridster.findItemWithItem(gridsterItem);
    gridsterItem.$item.x = x;
    gridsterItem.$item.y = y;
    if (!swapItem) {
      return;
    }
    x = swapItem.$item.x;
    y = swapItem.$item.y;
    swapItem.$item.x = gridsterItem.$item.x;
    swapItem.$item.y = gridsterItem.$item.y;
    gridsterItem.$item.x = position[0];
    gridsterItem.$item.y = position[1];
    if (gridsterItem.gridster.checkCollision(swapItem) || gridsterItem.gridster.checkCollision(gridsterItem)) {
      gridsterItem.$item.x = swapItem.$item.x;
      gridsterItem.$item.y = swapItem.$item.y;
      swapItem.$item.x = x;
      swapItem.$item.y = y;
    } else {
      swapItem.setSize(true);
      swapItem.checkItemChanges(swapItem, {x: x, y: y, cols: swapItem.$item.cols, rows: swapItem.$item.rows});
    }
  }
}

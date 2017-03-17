import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';

@Injectable()
export class GridsterSwap {
  static GridsterSwap(gridsterItem: GridsterItemComponent, elemPosition) {
    const position = gridsterItem.gridster.pixelsToPosition(elemPosition[0], elemPosition[1]);
    let x = gridsterItem.state.item.x;
    let y = gridsterItem.state.item.y;
    gridsterItem.state.item.x = position[0];
    gridsterItem.state.item.y = position[1];
    const swapItem = gridsterItem.gridster.findItemWithItem(gridsterItem.state.item);
    gridsterItem.state.item.x = x;
    gridsterItem.state.item.y = y;
    if (!swapItem) {
      return;
    }
    x = swapItem.x;
    y = swapItem.y;
    swapItem.x = gridsterItem.state.item.x;
    swapItem.y = gridsterItem.state.item.y;
    gridsterItem.state.item.x = position[0];
    gridsterItem.state.item.y = position[1];
    if (gridsterItem.gridster.checkCollision(swapItem) || gridsterItem.gridster.checkCollision(gridsterItem.state.item)) {
      gridsterItem.state.item.x = swapItem.x;
      gridsterItem.state.item.y = swapItem.y;
      swapItem.x = x;
      swapItem.y = y;
    } else {
      swapItem.setSize(true);
      swapItem.checkItemChanges(swapItem, {x: x, y: y, cols: swapItem.cols, rows: swapItem.rows});
    }
  }
}

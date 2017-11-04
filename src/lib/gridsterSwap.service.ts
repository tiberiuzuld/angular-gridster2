import {Injectable} from '@angular/core';

import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterComponent} from './gridster.component';

@Injectable()
export class GridsterSwap {
  private swapedItem: GridsterItemComponent | undefined;
  private gridsterItem: GridsterItemComponent;
  private gridster: GridsterComponent;

  constructor(gridsterItem: GridsterItemComponent) {
    this.gridsterItem = gridsterItem;
    this.gridster = gridsterItem.gridster;
  }

  swapItems(): void {
    if (this.gridster.$options.swap) {
      this.checkSwapBack();
      this.checkSwap(this.gridsterItem);
    }
  }

  checkSwapBack(): void {
    if (this.swapedItem) {
      const x: number = this.swapedItem.$item.x;
      const y: number = this.swapedItem.$item.y;
      this.swapedItem.$item.x = this.swapedItem.item.x || 0;
      this.swapedItem.$item.y = this.swapedItem.item.y || 0;
      if (this.gridster.checkCollision(this.swapedItem.$item)) {
        this.swapedItem.$item.x = x;
        this.swapedItem.$item.y = y;
      } else {
        this.swapedItem.setSize(true);
        this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
        this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
        this.swapedItem = undefined;
      }

    }
  }

  restoreSwapItem(): void {
    if (this.swapedItem) {
      this.swapedItem.$item.x = this.swapedItem.item.x || 0;
      this.swapedItem.$item.y = this.swapedItem.item.y || 0;
      this.swapedItem.setSize(true);
      this.swapedItem = undefined;
    }
  }

  setSwapItem(): void {
    if (this.swapedItem) {
      this.swapedItem.checkItemChanges(this.swapedItem.$item, this.swapedItem.item);
      this.swapedItem = undefined;
    }
  }

  checkSwap(pushedBy: GridsterItemComponent): void {
    const gridsterItemCollision: any = this.gridster.checkCollision(pushedBy.$item);
    if (gridsterItemCollision && gridsterItemCollision !== true && gridsterItemCollision.canBeDragged()) {
      const gridsterItemCollide: GridsterItemComponent = gridsterItemCollision;
      const copyCollisionX = gridsterItemCollide.$item.x;
      const copyCollisionY = gridsterItemCollide.$item.y;
      const copyX = pushedBy.$item.x;
      const copyY = pushedBy.$item.y;
      gridsterItemCollide.$item.x = pushedBy.item.x || 0;
      gridsterItemCollide.$item.y = pushedBy.item.y || 0;
      pushedBy.$item.x = gridsterItemCollide.item.x || 0;
      pushedBy.$item.y = gridsterItemCollide.item.y || 0;
      if (this.gridster.checkCollision(gridsterItemCollide.$item) || this.gridster.checkCollision(pushedBy.$item)) {
        pushedBy.$item.x = copyX;
        pushedBy.$item.y = copyY;
        gridsterItemCollide.$item.x = copyCollisionX;
        gridsterItemCollide.$item.y = copyCollisionY;
      } else {
        gridsterItemCollide.setSize(true);
        this.swapedItem = gridsterItemCollide;
      }
    }
  }
}

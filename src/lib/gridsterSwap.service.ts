import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterComponent} from './gridster.component';

@Injectable()
export class GridsterSwap {
  private swapedItem: GridsterItemComponent;
  private gridsterItem: GridsterItemComponent;
  private gridster: GridsterComponent;

  constructor(gridsterItem: GridsterItemComponent, gridster: GridsterComponent) {
    this.gridsterItem = gridsterItem;
    this.gridster = gridster;
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
      this.swapedItem.$item.x = this.swapedItem.item.x;
      this.swapedItem.$item.y = this.swapedItem.item.y;
      if (this.gridster.checkCollision(this.swapedItem)) {
        this.swapedItem.$item.x = x;
        this.swapedItem.$item.y = y;
      } else {
        this.swapedItem.setSize(true);
        this.gridsterItem.$item.x = this.gridsterItem.item.x;
        this.gridsterItem.$item.y = this.gridsterItem.item.y;
        this.swapedItem = undefined;
      }

    }
  }

  restoreSwapItem(): void {
    if (this.swapedItem) {
      this.swapedItem.$item.x = this.swapedItem.item.x;
      this.swapedItem.$item.y = this.swapedItem.item.y;
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
    const gridsterItemCollision: any = this.gridster.checkCollision(pushedBy);
    if (gridsterItemCollision && gridsterItemCollision !== true) {
      const gridsterItemCollide: GridsterItemComponent = gridsterItemCollision;
      gridsterItemCollide.$item.x = pushedBy.item.x;
      gridsterItemCollide.$item.y = pushedBy.item.y;
      pushedBy.$item.x = gridsterItemCollide.item.x;
      pushedBy.$item.y = gridsterItemCollide.item.y;
      if (this.gridster.checkCollision(gridsterItemCollide) || this.gridster.checkCollision(pushedBy)) {
        pushedBy.$item.x = gridsterItemCollide.$item.x;
        pushedBy.$item.y = gridsterItemCollide.$item.y;
        gridsterItemCollide.$item.x = gridsterItemCollide.item.x;
        gridsterItemCollide.$item.y = gridsterItemCollide.item.y;
      } else {
        gridsterItemCollide.setSize(true);
        this.swapedItem = gridsterItemCollide;
      }
    }
  }
}

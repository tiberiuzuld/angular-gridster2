import { GridsterItemComponentInterface } from './gridsterItem.interface';
import { GridsterComponentInterface } from './gridster.interface';

export class GridsterSwap {
  private swapedItem: GridsterItemComponentInterface | undefined;
  private gridsterItem: GridsterItemComponentInterface;
  private gridster: GridsterComponentInterface;

  constructor(gridsterItem: GridsterItemComponentInterface) {
    this.gridsterItem = gridsterItem;
    this.gridster = gridsterItem.gridster;
  }

  destroy(): void {
    this.gridster = this.gridsterItem = this.swapedItem = null!;
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
        this.swapedItem.setSize();
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
      this.swapedItem.setSize();
      this.swapedItem = undefined;
    }
  }

  setSwapItem(): void {
    if (this.swapedItem) {
      this.swapedItem.checkItemChanges(
        this.swapedItem.$item,
        this.swapedItem.item
      );
      this.swapedItem = undefined;
    }
  }

  checkSwap(pushedBy: GridsterItemComponentInterface): void {
    let gridsterItemCollision;
    if (this.gridster.$options.swapWhileDragging) {
      gridsterItemCollision = this.gridster.checkCollisionForSwaping(
        pushedBy.$item
      );
    } else {
      gridsterItemCollision = this.gridster.checkCollision(pushedBy.$item);
    }
    if (
      gridsterItemCollision &&
      gridsterItemCollision !== true &&
      gridsterItemCollision.canBeDragged()
    ) {
      const gridsterItemCollide: GridsterItemComponentInterface =
        gridsterItemCollision;
      const copyCollisionX = gridsterItemCollide.$item.x;
      const copyCollisionY = gridsterItemCollide.$item.y;
      const copyX = pushedBy.$item.x;
      const copyY = pushedBy.$item.y;
      const diffX = copyX - copyCollisionX;
      const diffY = copyY - copyCollisionY;
      gridsterItemCollide.$item.x = pushedBy.item.x - diffX;
      gridsterItemCollide.$item.y = pushedBy.item.y - diffY;
      pushedBy.$item.x = gridsterItemCollide.item.x + diffX;
      pushedBy.$item.y = gridsterItemCollide.item.y + diffY;
      if (
        this.gridster.checkCollision(gridsterItemCollide.$item) ||
        this.gridster.checkCollision(pushedBy.$item)
      ) {
        pushedBy.$item.x = copyX;
        pushedBy.$item.y = copyY;
        gridsterItemCollide.$item.x = copyCollisionX;
        gridsterItemCollide.$item.y = copyCollisionY;
      } else {
        gridsterItemCollide.setSize();
        this.swapedItem = gridsterItemCollide;
        if (this.gridster.$options.swapWhileDragging) {
          this.gridsterItem.checkItemChanges(
            this.gridsterItem.$item,
            this.gridsterItem.item
          );
          this.setSwapItem();
        }
      }
    }
  }
}

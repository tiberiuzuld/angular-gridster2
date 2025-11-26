import { Gridster } from './gridster';
import { GridsterItem } from './gridsterItem';

export class GridsterSwap {
  private swapedItem: GridsterItem | undefined;
  private gridster: Gridster;

  constructor(private gridsterItem: GridsterItem) {
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
      const $item = this.swapedItem.$item();
      const item = this.swapedItem.item();
      const x: number = $item.x;
      const y: number = $item.y;
      $item.x = item.x || 0;
      $item.y = item.y || 0;
      if (this.gridster.checkCollision($item)) {
        $item.x = x;
        $item.y = y;
      } else {
        this.swapedItem.setSize();
        this.gridsterItem.$item().x = this.gridsterItem.item().x || 0;
        this.gridsterItem.$item().y = this.gridsterItem.item().y || 0;
        this.swapedItem = undefined;
      }
    }
  }

  restoreSwapItem(): void {
    if (this.swapedItem) {
      const $item = this.swapedItem.$item();
      const item = this.swapedItem.item();
      $item.x = item.x || 0;
      $item.y = item.y || 0;
      this.swapedItem.setSize();
      this.swapedItem = undefined;
    }
  }

  setSwapItem(): void {
    if (this.swapedItem) {
      this.swapedItem.checkItemChanges(this.swapedItem.$item(), this.swapedItem.item());
      this.swapedItem = undefined;
    }
  }

  checkSwap(pushedBy: GridsterItem): void {
    const $item = pushedBy.$item();
    const item = pushedBy.item();
    let gridsterItemCollision;
    if (this.gridster.$options.swapWhileDragging) {
      gridsterItemCollision = this.gridster.checkCollisionForSwaping($item);
    } else {
      gridsterItemCollision = this.gridster.checkCollision($item);
    }
    if (gridsterItemCollision && gridsterItemCollision !== true && gridsterItemCollision.canBeDragged()) {
      const gridsterItemCollide: GridsterItem = gridsterItemCollision;
      const collide$item = gridsterItemCollide.$item();
      const copyX = $item.x;
      const copyCollisionX = collide$item.x;
      const copyCollisionY = collide$item.y;
      const copyY = $item.y;
      const diffX = copyX - copyCollisionX;
      const diffY = copyY - copyCollisionY;
      collide$item.x = item.x - diffX;
      collide$item.y = item.y - diffY;
      $item.x = gridsterItemCollide.item().x + diffX;
      $item.y = gridsterItemCollide.item().y + diffY;
      if (this.gridster.checkCollision(collide$item) || this.gridster.checkCollision($item)) {
        $item.x = copyX;
        $item.y = copyY;
        collide$item.x = copyCollisionX;
        collide$item.y = copyCollisionY;
      } else {
        gridsterItemCollide.setSize();
        this.swapedItem = gridsterItemCollide;
        if (this.gridster.$options.swapWhileDragging) {
          this.gridsterItem.checkItemChanges(this.gridsterItem.$item(), this.gridsterItem.item());
          this.setSwapItem();
        }
      }
    }
  }
}

import { Gridster } from './gridster';
import { GridsterItem } from './gridsterItem';
import { GridsterItemConfig } from './gridsterItemConfig';

export class GridsterPushResize {
  public fromSouth: string = 'fromSouth';
  public fromNorth: string = 'fromNorth';
  public fromEast: string = 'fromEast';
  public fromWest: string = 'fromWest';
  private pushedItems: GridsterItem[] = [];
  private pushedItemsPath: GridsterItemConfig[][] = [];
  private gridster: Gridster;
  private tryPattern: {
    fromEast: (gridsterItemCollide: GridsterItem, gridsterItem: GridsterItem, direction: string) => boolean;
    fromWest: (gridsterItemCollide: GridsterItem, gridsterItem: GridsterItem, direction: string) => boolean;
    fromNorth: (gridsterItemCollide: GridsterItem, gridsterItem: GridsterItem, direction: string) => boolean;
    fromSouth: (gridsterItemCollide: GridsterItem, gridsterItem: GridsterItem, direction: string) => boolean;
  } = {
    fromEast: this.tryWest,
    fromWest: this.tryEast,
    fromNorth: this.trySouth,
    fromSouth: this.tryNorth
  };

  constructor(private gridsterItem: GridsterItem) {
    this.gridster = gridsterItem.gridster;
  }

  destroy(): void {
    this.gridster = this.gridsterItem = null!;
  }

  pushItems(direction: string): boolean {
    if (this.gridster.$options.pushResizeItems) {
      return this.push(this.gridsterItem, direction);
    } else {
      return false;
    }
  }

  restoreItems(): void {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItem;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      const $item = pushedItem.$item();
      const item = pushedItem.item();
      $item.x = item.x || 0;
      $item.y = item.y || 0;
      $item.cols = item.cols || 1;
      $item.row = item.row || 1;
      pushedItem.setSize();
    }
    this.pushedItems = [];
    this.pushedItemsPath = [];
  }

  setPushedItems(): void {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItem;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.checkItemChanges(pushedItem.$item(), pushedItem.item());
    }
    this.pushedItems = [];
    this.pushedItemsPath = [];
  }

  checkPushBack(): void {
    let i: number = this.pushedItems.length - 1;
    let change = false;
    for (; i > -1; i--) {
      if (this.checkPushedItem(this.pushedItems[i], i)) {
        change = true;
      }
    }
    if (change) {
      this.checkPushBack();
    }
  }

  private push(gridsterItem: GridsterItem, direction: string): boolean {
    const gridsterItemCollision: GridsterItem | boolean = this.gridster.checkCollision(gridsterItem.$item());
    if (
      gridsterItemCollision &&
      gridsterItemCollision !== true &&
      gridsterItemCollision !== this.gridsterItem &&
      gridsterItemCollision.canBeResized()
    ) {
      if (this.tryPattern[direction].call(this, gridsterItemCollision, gridsterItem, direction)) {
        return true;
      }
    } else if (gridsterItemCollision === false) {
      return true;
    }
    return false;
  }

  private trySouth(gridsterItemCollide: GridsterItem, gridsterItem: GridsterItem, direction: string): boolean {
    const $item = gridsterItemCollide.$item();
    const backUpY = $item.y;
    const backUpRows = $item.rows;
    $item.y = gridsterItem.$item().y + gridsterItem.$item().rows;
    $item.rows = backUpRows + backUpY - $item.y;
    if (!this.gridster.checkCollisionTwoItems($item, gridsterItem.$item()) && !this.gridster.checkGridCollision($item)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      $item.y = backUpY;
      $item.rows = backUpRows;
    }
    return false;
  }

  private tryNorth(gridsterItemCollide: GridsterItem, gridsterItem: GridsterItem, direction: string): boolean {
    const $item = gridsterItemCollide.$item();
    const backUpRows = $item.rows;
    $item.rows = gridsterItem.$item().y - $item.y;
    if (!this.gridster.checkCollisionTwoItems($item, gridsterItem.$item()) && !this.gridster.checkGridCollision($item)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      $item.rows = backUpRows;
    }
    return false;
  }

  private tryEast(gridsterItemCollide: GridsterItem, gridsterItem: GridsterItem, direction: string): boolean {
    const $item = gridsterItemCollide.$item();
    const backUpX = $item.x;
    const backUpCols = $item.cols;
    $item.x = gridsterItem.$item().x + gridsterItem.$item().cols;
    $item.cols = backUpCols + backUpX - $item.x;
    if (!this.gridster.checkCollisionTwoItems($item, gridsterItem.$item()) && !this.gridster.checkGridCollision($item)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      $item.x = backUpX;
      $item.cols = backUpCols;
    }
    return false;
  }

  private tryWest(gridsterItemCollide: GridsterItem, gridsterItem: GridsterItem, direction: string): boolean {
    const $item = gridsterItemCollide.$item();
    const backUpCols = $item.cols;
    $item.cols = gridsterItem.$item().x - $item.x;
    if (!this.gridster.checkCollisionTwoItems($item, gridsterItem.$item()) && !this.gridster.checkGridCollision($item)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      $item.cols = backUpCols;
    }
    return false;
  }

  private addToPushed(gridsterItem: GridsterItem): void {
    const item = gridsterItem.item();
    const $item = gridsterItem.$item();
    if (this.pushedItems.indexOf(gridsterItem) < 0) {
      this.pushedItems.push(gridsterItem);
      this.pushedItemsPath.push([
        {
          x: item.x || 0,
          y: item.y || 0,
          cols: item.cols || 0,
          rows: item.rows || 0
        },
        {
          x: $item.x,
          y: $item.y,
          cols: $item.cols,
          rows: $item.rows
        }
      ]);
    } else {
      const i = this.pushedItems.indexOf(gridsterItem);
      this.pushedItemsPath[i].push({
        x: $item.x,
        y: $item.y,
        cols: $item.cols,
        rows: $item.rows
      });
    }
  }

  private removeFromPushed(i: number): void {
    if (i > -1) {
      this.pushedItems.splice(i, 1);
      this.pushedItemsPath.splice(i, 1);
    }
  }

  private checkPushedItem(pushedItem: GridsterItem, i: number): boolean {
    const path = this.pushedItemsPath[i];
    const $item = pushedItem.$item();
    for (let j = path.length - 2; j > -1; j--) {
      const lastPosition = path[j];
      const x = $item.x;
      const y = $item.y;
      const cols = $item.cols;
      const rows = $item.rows;
      $item.x = lastPosition.x;
      $item.y = lastPosition.y;
      $item.cols = lastPosition.cols;
      $item.rows = lastPosition.rows;
      if (!this.gridster.findItemWithItem($item)) {
        pushedItem.setSize();
        path.splice(j + 1, path.length - 1 - j);
      } else {
        $item.x = x;
        $item.y = y;
        $item.cols = cols;
        $item.rows = rows;
      }
    }
    if (path.length < 2) {
      this.removeFromPushed(i);
      return true;
    }
    return false;
  }
}

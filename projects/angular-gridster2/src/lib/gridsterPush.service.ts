import { GridsterItemComponentInterface } from './gridsterItem.interface';
import { GridsterComponentInterface } from './gridster.interface';

export class GridsterPush {
  public fromSouth: string;
  public fromNorth: string;
  public fromEast: string;
  public fromWest: string;
  private pushedItems: GridsterItemComponentInterface[];
  private pushedItemsTemp: GridsterItemComponentInterface[];
  private pushedItemsTempPath: { x: number; y: number }[][];
  private pushedItemsPath: { x: number; y: number }[][];
  private gridsterItem: GridsterItemComponentInterface;
  private gridster: GridsterComponentInterface;
  private pushedItemsOrder: GridsterItemComponentInterface[];
  private tryPattern: {
    fromEast: ((
      gridsterItemCollide: GridsterItemComponentInterface,
      gridsterItem: GridsterItemComponentInterface
    ) => boolean)[];
    fromWest: ((
      gridsterItemCollide: GridsterItemComponentInterface,
      gridsterItem: GridsterItemComponentInterface
    ) => boolean)[];
    fromNorth: ((
      gridsterItemCollide: GridsterItemComponentInterface,
      gridsterItem: GridsterItemComponentInterface
    ) => boolean)[];
    fromSouth: ((
      gridsterItemCollide: GridsterItemComponentInterface,
      gridsterItem: GridsterItemComponentInterface
    ) => boolean)[];
  };
  private iteration = 0;

  constructor(gridsterItem: GridsterItemComponentInterface) {
    this.pushedItems = [];
    this.pushedItemsTemp = [];
    this.pushedItemsTempPath = [];
    this.pushedItemsPath = [];
    this.gridsterItem = gridsterItem;
    this.gridster = gridsterItem.gridster;
    this.tryPattern = {
      fromEast: [this.tryWest, this.trySouth, this.tryNorth, this.tryEast],
      fromWest: [this.tryEast, this.trySouth, this.tryNorth, this.tryWest],
      fromNorth: [this.trySouth, this.tryEast, this.tryWest, this.tryNorth],
      fromSouth: [this.tryNorth, this.tryEast, this.tryWest, this.trySouth]
    };
    this.fromSouth = 'fromSouth';
    this.fromNorth = 'fromNorth';
    this.fromEast = 'fromEast';
    this.fromWest = 'fromWest';
  }

  destroy(): void {
    this.gridster = this.gridsterItem = null!;
  }

  pushItems(direction: string, disable?: boolean): boolean {
    if (this.gridster.$options.pushItems && !disable) {
      this.pushedItemsOrder = [];
      this.iteration = 0;
      const pushed = this.push(this.gridsterItem, direction);
      if (!pushed) {
        this.restoreTempItems();
      }
      this.pushedItemsOrder = [];
      this.pushedItemsTemp = [];
      this.pushedItemsTempPath = [];
      return pushed;
    } else {
      return false;
    }
  }

  restoreTempItems(): void {
    let i = this.pushedItemsTemp.length - 1;
    for (; i > -1; i--) {
      this.removeFromTempPushed(this.pushedItemsTemp[i]);
    }
  }

  restoreItems(): void {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponentInterface;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.$item.x = pushedItem.item.x || 0;
      pushedItem.$item.y = pushedItem.item.y || 0;
      pushedItem.setSize();
    }
    this.pushedItems = [];
    this.pushedItemsPath = [];
  }

  setPushedItems(): void {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponentInterface;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
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

  private push(
    gridsterItem: GridsterItemComponentInterface,
    direction: string
  ): boolean {
    if (this.iteration > 100) {
      console.warn('max iteration reached');
      return false;
    }
    if (this.gridster.checkGridCollision(gridsterItem.$item)) {
      return false;
    }
    if (direction === '') {
      return false;
    }
    const conflicts: GridsterItemComponentInterface[] =
      this.gridster.findItemsWithItem(gridsterItem.$item);
    const invert = direction === this.fromNorth || direction === this.fromWest;
    // sort the list of conflicts in order of [y,x]. Invert when the push is from north and west
    // this is done so they don't conflict witch each other and revert positions, keeping the previous order
    conflicts.sort((a, b) => {
      if (invert) {
        return b.$item.y - a.$item.y || b.$item.x - a.$item.x;
      } else {
        return a.$item.y - b.$item.y || a.$item.x - b.$item.x;
      }
    });
    let i = 0;
    let itemCollision: GridsterItemComponentInterface;
    let makePush = true;
    const pushedItems: GridsterItemComponentInterface[] = [];
    for (; i < conflicts.length; i++) {
      itemCollision = conflicts[i];
      if (itemCollision === this.gridsterItem) {
        continue;
      }
      if (!itemCollision.canBeDragged()) {
        makePush = false;
        break;
      }
      const p = this.pushedItemsTemp.indexOf(itemCollision);
      if (p > -1 && this.pushedItemsTempPath[p].length > 10) {
        // stop if item is pushed more than 10 times to break infinite loops
        makePush = false;
        break;
      }
      if (
        this.tryPattern[direction][0].call(this, itemCollision, gridsterItem)
      ) {
        this.pushedItemsOrder.push(itemCollision);
        pushedItems.push(itemCollision);
      } else if (
        this.tryPattern[direction][1].call(this, itemCollision, gridsterItem)
      ) {
        this.pushedItemsOrder.push(itemCollision);
        pushedItems.push(itemCollision);
      } else if (
        this.tryPattern[direction][2].call(this, itemCollision, gridsterItem)
      ) {
        this.pushedItemsOrder.push(itemCollision);
        pushedItems.push(itemCollision);
      } else if (
        this.tryPattern[direction][3].call(this, itemCollision, gridsterItem)
      ) {
        this.pushedItemsOrder.push(itemCollision);
        pushedItems.push(itemCollision);
      } else {
        makePush = false;
        break;
      }
    }
    if (!makePush) {
      i = this.pushedItemsOrder.lastIndexOf(pushedItems[0]);
      if (i > -1) {
        let j = this.pushedItemsOrder.length - 1;
        for (; j >= i; j--) {
          itemCollision = this.pushedItemsOrder[j];
          this.pushedItemsOrder.pop();
          this.removeFromTempPushed(itemCollision);
          this.removeFromPushedItem(itemCollision);
        }
      }
    }
    this.iteration++;
    return makePush;
  }

  private trySouth(
    gridsterItemCollide: GridsterItemComponentInterface,
    gridsterItem: GridsterItemComponentInterface
  ): boolean {
    if (!this.gridster.$options.pushDirections.south) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.$item.y =
      gridsterItem.$item.y + gridsterItem.$item.rows;
    if (this.push(gridsterItemCollide, this.fromNorth)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }

  private tryNorth(
    gridsterItemCollide: GridsterItemComponentInterface,
    gridsterItem: GridsterItemComponentInterface
  ): boolean {
    if (!this.gridster.$options.pushDirections.north) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.$item.y =
      gridsterItem.$item.y - gridsterItemCollide.$item.rows;
    if (this.push(gridsterItemCollide, this.fromSouth)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }

  private tryEast(
    gridsterItemCollide: GridsterItemComponentInterface,
    gridsterItem: GridsterItemComponentInterface
  ): boolean {
    if (!this.gridster.$options.pushDirections.east) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.$item.x =
      gridsterItem.$item.x + gridsterItem.$item.cols;
    if (this.push(gridsterItemCollide, this.fromWest)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }

  private tryWest(
    gridsterItemCollide: GridsterItemComponentInterface,
    gridsterItem: GridsterItemComponentInterface
  ): boolean {
    if (!this.gridster.$options.pushDirections.west) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    gridsterItemCollide.$item.x =
      gridsterItem.$item.x - gridsterItemCollide.$item.cols;
    if (this.push(gridsterItemCollide, this.fromEast)) {
      gridsterItemCollide.setSize();
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      this.removeFromTempPushed(gridsterItemCollide);
    }
    return false;
  }

  private addToTempPushed(gridsterItem: GridsterItemComponentInterface): void {
    let i = this.pushedItemsTemp.indexOf(gridsterItem);
    if (i === -1) {
      i = this.pushedItemsTemp.push(gridsterItem) - 1;
      this.pushedItemsTempPath[i] = [];
    }
    this.pushedItemsTempPath[i].push({
      x: gridsterItem.$item.x,
      y: gridsterItem.$item.y
    });
  }

  private removeFromTempPushed(
    gridsterItem: GridsterItemComponentInterface
  ): void {
    const i = this.pushedItemsTemp.indexOf(gridsterItem);
    const tempPosition = this.pushedItemsTempPath[i].pop();
    if (!tempPosition) {
      return;
    }
    gridsterItem.$item.x = tempPosition.x;
    gridsterItem.$item.y = tempPosition.y;
    gridsterItem.setSize();
    if (!this.pushedItemsTempPath[i].length) {
      this.pushedItemsTemp.splice(i, 1);
      this.pushedItemsTempPath.splice(i, 1);
    }
  }

  private addToPushed(gridsterItem: GridsterItemComponentInterface): void {
    if (this.pushedItems.indexOf(gridsterItem) < 0) {
      this.pushedItems.push(gridsterItem);
      this.pushedItemsPath.push([
        { x: gridsterItem.item.x || 0, y: gridsterItem.item.y || 0 },
        { x: gridsterItem.$item.x, y: gridsterItem.$item.y }
      ]);
    } else {
      const i = this.pushedItems.indexOf(gridsterItem);
      this.pushedItemsPath[i].push({
        x: gridsterItem.$item.x,
        y: gridsterItem.$item.y
      });
    }
  }

  private removeFromPushed(i: number): void {
    if (i > -1) {
      this.pushedItems.splice(i, 1);
      this.pushedItemsPath.splice(i, 1);
    }
  }

  private removeFromPushedItem(
    gridsterItem: GridsterItemComponentInterface
  ): void {
    const i = this.pushedItems.indexOf(gridsterItem);
    if (i > -1) {
      this.pushedItemsPath[i].pop();
      if (!this.pushedItemsPath.length) {
        this.pushedItems.splice(i, 1);
        this.pushedItemsPath.splice(i, 1);
      }
    }
  }

  private checkPushedItem(
    pushedItem: GridsterItemComponentInterface,
    i: number
  ): boolean {
    const path = this.pushedItemsPath[i];
    let j = path.length - 2;
    let lastPosition;
    let x;
    let y;
    let change = false;
    for (; j > -1; j--) {
      lastPosition = path[j];
      x = pushedItem.$item.x;
      y = pushedItem.$item.y;
      pushedItem.$item.x = lastPosition.x;
      pushedItem.$item.y = lastPosition.y;
      if (!this.gridster.findItemWithItem(pushedItem.$item)) {
        pushedItem.setSize();
        path.splice(j + 1, path.length - j - 1);
        change = true;
      } else {
        pushedItem.$item.x = x;
        pushedItem.$item.y = y;
      }
    }
    if (path.length < 2) {
      this.removeFromPushed(i);
    }
    return change;
  }
}

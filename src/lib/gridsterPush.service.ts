import {Injectable} from '@angular/core';

import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterComponent} from './gridster.component';

@Injectable()
export class GridsterPush {
  public fromSouth: string;
  public fromNorth: string;
  public fromEast: string;
  public fromWest: string;
  private pushedItems: Array<GridsterItemComponent>;
  private pushedItemsTemp: Array<GridsterItemComponent>;
  private pushedItemsTempInit: Array<{ x: number, y: number }>;
  private count: number;
  private pushedItemsPath: Array<Array<{ x: number, y: number }>>;
  private gridsterItem: GridsterItemComponent;
  private gridster: GridsterComponent;
  private tryPattern: {
    fromEast: Array<Function>,
    fromWest: Array<Function>,
    fromNorth: Array<Function>,
    fromSouth: Array<Function>,
    [key: string]: Array<Function>
  };

  constructor(gridsterItem: GridsterItemComponent) {
    this.pushedItems = [];
    this.pushedItemsTemp = [];
    this.pushedItemsTempInit = [];
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

  pushItems(direction: string, disable?: boolean): void {
    if (this.gridster.$options.pushItems && !disable) {
      this.count = 0;
      if (!this.push(this.gridsterItem, direction)) {
        let i = this.pushedItemsTemp.length - 1;
        for (; i > -1; i--) {
          this.removeFromTempPushed(this.pushedItemsTemp[i]);
        }
      }
      this.pushedItemsTemp = [];
    }
  }

  restoreItems(): void {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponent;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.$item.x = pushedItem.item.x || 0;
      pushedItem.$item.y = pushedItem.item.y || 0;
      pushedItem.setSize(true);
    }
    this.pushedItems = [];
    this.pushedItemsPath = [];
  }

  setPushedItems() {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponent;
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

  private push(gridsterItem: GridsterItemComponent, direction: string): boolean {
    if (this.count > 3000) {
      return false;
    } else {
      this.count++;
    }
    if (this.gridster.checkGridCollision(gridsterItem.$item)) {
      return false;
    }
    const a: Array<GridsterItemComponent> = this.gridster.findItemsWithItem(gridsterItem.$item);
    let i = a.length - 1, itemColision: GridsterItemComponent;
    let makePush = true;
    for (; i > -1; i--) {
      itemColision = a[i];
      if (itemColision === this.gridsterItem) {
        makePush = false;
        break;
      }
      if (!itemColision.canBeDragged()) {
        makePush = false;
        break;
      }
      if (this.tryPattern[direction][0].call(this, itemColision, gridsterItem)) {
      } else if (this.tryPattern[direction][1].call(this, itemColision, gridsterItem)) {
      } else if (this.tryPattern[direction][2].call(this, itemColision, gridsterItem)) {
      } else if (this.tryPattern[direction][3].call(this, itemColision, gridsterItem)) {
      } else {
        makePush = false;
        break;
      }
    }
    return makePush;
  }

  private trySouth(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent): boolean {
    if (!this.gridster.$options.pushDirections.south) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    const backUpY = gridsterItemCollide.$item.y;
    gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
    if (this.push(gridsterItemCollide, this.fromNorth)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      gridsterItemCollide.$item.y = backUpY;
    }
    return false;
  }

  private tryNorth(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent): boolean {
    if (!this.gridster.$options.pushDirections.north) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    const backUpY = gridsterItemCollide.$item.y;
    gridsterItemCollide.$item.y = gridsterItem.$item.y - gridsterItemCollide.$item.rows;
    if (this.push(gridsterItemCollide, this.fromSouth)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      gridsterItemCollide.$item.y = backUpY;
    }
    return false;
  }

  private tryEast(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent): boolean {
    if (!this.gridster.$options.pushDirections.east) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    const backUpX = gridsterItemCollide.$item.x;
    gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
    if (this.push(gridsterItemCollide, this.fromWest)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      gridsterItemCollide.$item.x = backUpX;
    }
    return false;
  }

  private tryWest(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent): boolean {
    if (!this.gridster.$options.pushDirections.west) {
      return false;
    }
    this.addToTempPushed(gridsterItemCollide);
    const backUpX = gridsterItemCollide.$item.x;
    gridsterItemCollide.$item.x = gridsterItem.$item.x - gridsterItemCollide.$item.cols;
    if (this.push(gridsterItemCollide, this.fromEast)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      gridsterItemCollide.$item.x = backUpX;
    }
    return false;
  }

  private addToTempPushed(gridsterItem: GridsterItemComponent): void {
    if (this.checkInTempPushed(gridsterItem)) {
      return;
    }
    const l = this.pushedItemsTemp.push(gridsterItem);
    this.pushedItemsTempInit[l - 1] = {x: gridsterItem.$item.x, y: gridsterItem.$item.y};
  }

  private removeFromTempPushed(gridsterItem: GridsterItemComponent): void {
    const i = this.pushedItemsTemp.indexOf(gridsterItem);
    this.pushedItemsTemp.splice(i, 1);
    const initPosition = this.pushedItemsTempInit[i];
    gridsterItem.$item.x = initPosition.x;
    gridsterItem.$item.y = initPosition.y;
    gridsterItem.setSize(true);
    this.pushedItemsTempInit.splice(i, 1);
  }

  private checkInTempPushed(gridsterItem: GridsterItemComponent): boolean {
    return this.pushedItemsTemp.indexOf(gridsterItem) > -1;
  }

  private addToPushed(gridsterItem: GridsterItemComponent): void {
    if (this.pushedItems.indexOf(gridsterItem) < 0) {
      this.pushedItems.push(gridsterItem);
      this.pushedItemsPath.push([{x: gridsterItem.item.x || 0, y: gridsterItem.item.y || 0},
        {x: gridsterItem.$item.x, y: gridsterItem.$item.y}]);
    } else {
      const i = this.pushedItems.indexOf(gridsterItem);
      this.pushedItemsPath[i].push({x: gridsterItem.$item.x, y: gridsterItem.$item.y});
    }
  }

  private removeFromPushed(i: number): void {
    if (i > -1) {
      this.pushedItems.splice(i, 1);
      this.pushedItemsPath.splice(i, 1);
    }
  }

  private checkPushedItem(pushedItem: GridsterItemComponent, i: number): boolean {
    const path = this.pushedItemsPath[i];
    let j = path.length - 2;
    let lastPosition, x, y;
    let change = false;
    for (; j > -1; j--) {
      lastPosition = path[j];
      x = pushedItem.$item.x;
      y = pushedItem.$item.y;
      pushedItem.$item.x = lastPosition.x;
      pushedItem.$item.y = lastPosition.y;
      if (!this.gridster.findItemWithItem(pushedItem.$item)) {
        pushedItem.setSize(true);
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

import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterComponent} from './gridster.component';

@Injectable()
export class GridsterPush {
  private pushedItems: Array<GridsterItemComponent>;
  private pushedItemsPath: Array<Array<{ x: number, y: number }>>;
  private gridsterItem: GridsterItemComponent;
  private gridster: GridsterComponent;
  private tryPattern: Object;
  public fromSouth: string;
  public fromNorth: string;
  public fromEast: string;
  public fromWest: string;

  constructor(gridsterItem: GridsterItemComponent, gridster: GridsterComponent) {
    this.pushedItems = [];
    this.pushedItemsPath = [];
    this.gridsterItem = gridsterItem;
    this.gridster = gridster;
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

  pushItems(direction): void {
    if (this.gridster.$options.pushItems) {
      this.push(this.gridsterItem, direction);
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

  private push(gridsterItem: GridsterItemComponent, direction: string): boolean {
    const gridsterItemCollision: any = this.gridster.checkCollision(gridsterItem.$item);
    if (gridsterItemCollision && gridsterItemCollision !== true &&
      gridsterItemCollision !== this.gridsterItem && gridsterItemCollision.canBeDragged()) {
      const gridsterItemCollide: GridsterItemComponent = gridsterItemCollision;
      if (this.tryPattern[direction][0].call(this, gridsterItemCollide, gridsterItem, direction)) {
        return true;
      } else if (this.tryPattern[direction][1].call(this, gridsterItemCollide, gridsterItem, direction)) {
        return true;
      } else if (this.tryPattern[direction][2].call(this, gridsterItemCollide, gridsterItem, direction)) {
        return true;
      } else if (this.tryPattern[direction][3].call(this, gridsterItemCollide, gridsterItem, direction)) {
        return true;
      }
    } else if (gridsterItemCollision === false) {
      return true;
    }
    return false;
  }

  private trySouth(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string): boolean {
    const backUpY = gridsterItemCollide.$item.y;
    gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && this.push(gridsterItemCollide, this.fromNorth)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.y = backUpY;
    }
    return false;
  }

  private tryNorth(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string): boolean {
    const backUpY = gridsterItemCollide.$item.y;
    gridsterItemCollide.$item.y = gridsterItem.$item.y - gridsterItemCollide.$item.rows;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && this.push(gridsterItemCollide, this.fromSouth)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.y = backUpY;
    }
    return false;
  }

  private tryEast(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string): boolean {
    const backUpX = gridsterItemCollide.$item.x;
    gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && this.push(gridsterItemCollide, this.fromWest)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.x = backUpX;
    }
    return false;
  }

  private tryWest(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string): boolean {
    const backUpX = gridsterItemCollide.$item.x;
    gridsterItemCollide.$item.x = gridsterItem.$item.x - gridsterItemCollide.$item.cols;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
      && this.push(gridsterItemCollide, this.fromEast)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction);
      return true;
    } else {
      gridsterItemCollide.$item.x = backUpX;
    }
    return false;
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

  public checkPushBack(): void {
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

  private checkPushedItem(pushedItem: GridsterItemComponent, i: number): boolean {
    const path = this.pushedItemsPath[i];
    let j = path.length - 2;
    let lastPosition, x, y;
    for (; j > -1; j--) {
      lastPosition = path[j];
      x = pushedItem.$item.x;
      y = pushedItem.$item.y;
      pushedItem.$item.x = lastPosition.x;
      pushedItem.$item.y = lastPosition.y;
      if (!this.gridster.findItemWithItem(pushedItem.$item)) {
        pushedItem.setSize(true);
        path.splice(j + 1, path.length - 1 - j);
      } else {
        pushedItem.$item.x = x;
        pushedItem.$item.y = y;
      }
    }
    if (path.length < 2) {
      this.removeFromPushed(i);
      return true;
    }
    return false;
  }
}

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
      fromSouth: [this.tryNorth, this.tryEast, this.tryWest, this.trySouth],
    };
    this.fromSouth = 'fromSouth';
    this.fromNorth = 'fromNorth';
    this.fromEast = 'fromEast';
    this.fromWest = 'fromWest';
  }

  pushItems(direction) {
    if (this.gridster.$options.pushItems) {
      this.push(this.gridsterItem, direction, this.gridsterItem);
    }
  }

  restoreItems() {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponent;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.$item.x = pushedItem.item.x;
      pushedItem.$item.y = pushedItem.item.y;
      pushedItem.setSize(true);
    }
    this.pushedItems = undefined;
    this.pushedItemsPath = undefined;
  }

  setPushedItems() {
    let i = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponent;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
    }
    this.pushedItems = undefined;
    this.pushedItemsPath = undefined;
  }

  private push(gridsterItem: GridsterItemComponent, direction: string, pushedBy: GridsterItemComponent): boolean {
    const gridsterItemCollision: any = this.gridster.checkCollision(gridsterItem, pushedBy);
    if (gridsterItemCollision && gridsterItemCollision !== true &&
      gridsterItemCollision !== this.gridsterItem) {
      const gridsterItemCollide: GridsterItemComponent = gridsterItemCollision;
      if (this.tryPattern[direction][0].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
        return true;
      } else if (this.tryPattern[direction][1].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
        return true;
      } else if (this.tryPattern[direction][2].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
        return true;
      } else if (this.tryPattern[direction][3].call(this, gridsterItemCollide, gridsterItem, direction, pushedBy)) {
        return true;
      }
    } else if (gridsterItemCollision === undefined) {
      return true;
    }
  }

  private trySouth(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string,
                   pushedBy: GridsterItemComponent): boolean {
    gridsterItemCollide.$item.y += 1;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide, gridsterItem)
      && this.push(gridsterItemCollide, this.fromNorth, gridsterItem)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction, pushedBy);
      return true;
    } else {
      gridsterItemCollide.$item.y -= 1;
    }
  }

  private tryNorth(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string,
                   pushedBy: GridsterItemComponent): boolean {
    gridsterItemCollide.$item.y -= 1;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide, gridsterItem)
      && this.push(gridsterItemCollide, this.fromSouth, gridsterItem)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction, pushedBy);
      return true;
    } else {
      gridsterItemCollide.$item.y += 1;
    }
  }

  private tryEast(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string,
                  pushedBy: GridsterItemComponent): boolean {
    gridsterItemCollide.$item.x += 1;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide, gridsterItem)
      && this.push(gridsterItemCollide, this.fromWest, gridsterItem)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction, pushedBy);
      return true;
    } else {
      gridsterItemCollide.$item.x -= 1;
    }
  }

  private tryWest(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent, direction: string,
                  pushedBy: GridsterItemComponent): boolean {
    gridsterItemCollide.$item.x -= 1;
    if (!GridsterComponent.checkCollisionTwoItems(gridsterItemCollide, gridsterItem)
      && this.push(gridsterItemCollide, this.fromEast, gridsterItem)) {
      gridsterItemCollide.setSize(true);
      this.addToPushed(gridsterItemCollide);
      this.push(gridsterItem, direction, pushedBy);
      return true;
    } else {
      gridsterItemCollide.$item.x += 1;
    }
  }

  private addToPushed(gridsterItem: GridsterItemComponent) {
    if (this.pushedItems.indexOf(gridsterItem) < 0) {
      this.pushedItems.push(gridsterItem);
      this.pushedItemsPath.push([{x: gridsterItem.item.x, y: gridsterItem.item.y}, {x: gridsterItem.$item.x, y: gridsterItem.$item.y}]);
    } else {
      const i = this.pushedItems.indexOf(gridsterItem);
      this.pushedItemsPath[i].push({x: gridsterItem.$item.x, y: gridsterItem.$item.y});
    }
  }

  private removeFromPushed(i: number) {
    if (i > -1) {
      this.pushedItems.splice(i, 1);
      this.pushedItemsPath.splice(i, 1);
    }
  }

  public checkPushBack() {
    let i: number = this.pushedItems.length - 1;
    for (; i > -1; i--) {
      this.checkPushedItem(this.pushedItems[i], i);
    }
  }

  private checkPushedItem(pushedItem: GridsterItemComponent, i: number) {
    const path = this.pushedItemsPath[i];
    let j = path.length - 2;
    let change = false;
    let lastPosition;
    for (; j > -1; j--) {
      lastPosition = path[j];
      pushedItem.$item.x = lastPosition.x;
      pushedItem.$item.y = lastPosition.y;
      if (!this.gridster.findItemWithItem(pushedItem)) {
        change = true;
        pushedItem.setSize(true);
        path.splice(j + 1, path.length - 1 - j);
      }
    }
    if (path.length < 2) {
      this.removeFromPushed(i);
    }
    if (!change) {
      lastPosition = path[path.length - 1];
      pushedItem.$item.x = lastPosition.x;
      pushedItem.$item.y = lastPosition.y;
    }
  }
}

import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterComponent} from './gridster.component';

@Injectable()
export class GridsterPush {
  private pushedItems: Array<GridsterItemComponent>;
  private gridsterItem: GridsterItemComponent;
  private gridster: GridsterComponent;

  constructor(gridsterItem: GridsterItemComponent, gridster: GridsterComponent) {
    this.pushedItems = [];
    this.gridsterItem = gridsterItem;
    this.gridster = gridster;
  }

  pushItems() {
    if (this.gridster.$options.pushItems) {
      this.checkPushBack();
      this.push(this.gridsterItem);
    }
  }

  private push(gridsterItem: GridsterItemComponent) {
    const gridsterItemCollision: any = this.gridster.checkCollision(gridsterItem, this.gridsterItem);
    if (gridsterItemCollision && gridsterItemCollision !== true) {
      const gridsterItemCollide: GridsterItemComponent = gridsterItemCollision;
      if (gridsterItemCollide.$item.y < gridsterItem.$item.y + gridsterItem.$item.rows) {
        gridsterItemCollide.$item.y += 1;
        if (this.push(gridsterItemCollide)) {
          gridsterItemCollide.setSize(true);
          this.push(gridsterItem);
          this.addToPushed(gridsterItemCollide);
          return true;
        } else {
          gridsterItemCollide.$item.y -= 1;
        }
      } else if (gridsterItemCollide.$item.y + gridsterItemCollide.$item.rows > gridsterItem.$item.y) {
        gridsterItemCollide.$item.y -= 1;
        if (this.push(gridsterItemCollide)) {
          gridsterItemCollide.setSize(true);
          this.push(gridsterItem);
          this.addToPushed(gridsterItemCollide);
          return true;
        } else {
          gridsterItemCollide.$item.y += 1;
        }
      }
    } else if (gridsterItemCollision === undefined) {
      return true;
    }
  }

  private addToPushed(gridsterItem: GridsterItemComponent) {
    if (this.pushedItems.indexOf(gridsterItem) < 0) {
      this.pushedItems.push(gridsterItem);
    }
  }

  private removeFromPushed(gridsterItem: GridsterItemComponent) {
    const i = this.pushedItems.indexOf(gridsterItem);
    if (i > -1) {
      this.pushedItems.splice(i, 1);
    }
  }

  restoreItems() {
    let i: number = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponent;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.$item.x = pushedItem.item.x;
      pushedItem.$item.y = pushedItem.item.y;
      pushedItem.setSize(true);
    }
    this.pushedItems = undefined;
  }

  private checkPushBack() {
    let i: number = this.pushedItems.length - 1;
    for (; i > -1; i--) {
      this.checkPushedItem(this.pushedItems[i]);
    }
  }

  private checkPushedItem(pushedItem: GridsterItemComponent) {
    if (pushedItem.$item.y > pushedItem.item.y) {
      pushedItem.$item.y -= 1;
      if (this.gridster.findItemWithItem(pushedItem)) {
        pushedItem.$item.y += 1;
      } else {
        pushedItem.setSize(true);
      }
    } else if (pushedItem.$item.y < pushedItem.item.y) {
      pushedItem.$item.y += 1;
      if (this.gridster.findItemWithItem(pushedItem)) {
        pushedItem.$item.y -= 1;
      } else {
        pushedItem.setSize(true);
      }
    }

    if (pushedItem.$item.x > pushedItem.item.x) {
      pushedItem.$item.x -= 1;
      if (this.gridster.findItemWithItem(pushedItem)) {
        pushedItem.$item.x += 1;
      } else {
        pushedItem.setSize(true);
      }
    } else if (pushedItem.$item.x < pushedItem.item.x) {
      pushedItem.$item.x += 1;
      if (this.gridster.findItemWithItem(pushedItem)) {
        pushedItem.$item.x -= 1;
      } else {
        pushedItem.setSize(true);
      }
    }

    if (pushedItem.$item.x === pushedItem.item.x && pushedItem.$item.y === pushedItem.item.y) {
      this.removeFromPushed(pushedItem);
    }
  }

  setPushedItems() {
    let i: number = 0;
    const l: number = this.pushedItems.length;
    let pushedItem: GridsterItemComponent;
    for (; i < l; i++) {
      pushedItem = this.pushedItems[i];
      pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
    }
    this.pushedItems = undefined;
  }
}

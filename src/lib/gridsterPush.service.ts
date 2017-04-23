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
      this.push(this.gridsterItem, this.gridsterItem);
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
  }

  private push(gridsterItem: GridsterItemComponent, pushedBy: GridsterItemComponent): boolean {
    const gridsterItemCollision: any = this.gridster.checkCollision(gridsterItem, pushedBy);
    if (gridsterItemCollision && gridsterItemCollision !== true) {
      const gridsterItemCollide: GridsterItemComponent = gridsterItemCollision;
      if (gridsterItem.item.y < gridsterItem.$item.y ||
        (gridsterItem.item.y === gridsterItem.$item.y && gridsterItem.item.rows < gridsterItem.$item.rows)) {
        if (this.trySouth(gridsterItemCollide, gridsterItem, pushedBy)) {
          return true;
        } else if (this.tryEast(gridsterItemCollide, gridsterItem, pushedBy)) {
          return true;
        }
      } else if (gridsterItem.item.y > gridsterItem.$item.y) {
        if (this.tryNorth(gridsterItemCollide, gridsterItem, pushedBy)) {
          return true;
        } else if (this.tryEast(gridsterItemCollide, gridsterItem, pushedBy)) {
          return true;
        }
      }

      if (gridsterItem.item.x < gridsterItem.$item.x ||
        (gridsterItem.item.x === gridsterItem.$item.x && gridsterItem.item.cols < gridsterItem.$item.cols)) {
        if (this.tryEast(gridsterItemCollide, gridsterItem, pushedBy)) {
          return true;
        } else if (this.trySouth(gridsterItemCollide, gridsterItem, pushedBy)) {
          return true;
        }
      } else if (gridsterItem.item.x > gridsterItem.$item.x) {
        if (this.tryWest(gridsterItemCollide, gridsterItem, pushedBy)) {
          return true;
        } else if (this.trySouth(gridsterItemCollide, gridsterItem, pushedBy)) {
          return true;
        }
      }
    } else if (gridsterItemCollision === undefined) {
      return true;
    }
  }

  private trySouth(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent,
                   pushedBy: GridsterItemComponent): boolean {
    gridsterItemCollide.$item.y += 1;
    if (this.push(gridsterItemCollide, gridsterItem)) {
      gridsterItemCollide.setSize(true);
      this.push(gridsterItem, pushedBy);
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      gridsterItemCollide.$item.y -= 1;
    }
  }

  private tryNorth(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent,
                   pushedBy: GridsterItemComponent): boolean {
    gridsterItemCollide.$item.y -= 1;
    if (this.push(gridsterItemCollide, gridsterItem)) {
      gridsterItemCollide.setSize(true);
      this.push(gridsterItem, pushedBy);
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      gridsterItemCollide.$item.y += 1;
    }
  }

  private tryEast(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent,
                  pushedBy: GridsterItemComponent): boolean {
    gridsterItemCollide.$item.x += 1;
    if (this.push(gridsterItemCollide, gridsterItem)) {
      gridsterItemCollide.setSize(true);
      this.push(gridsterItem, pushedBy);
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      gridsterItemCollide.$item.x -= 1;
    }
  }

  private tryWest(gridsterItemCollide: GridsterItemComponent, gridsterItem: GridsterItemComponent,
                  pushedBy: GridsterItemComponent): boolean {
    gridsterItemCollide.$item.x -= 1;
    if (this.push(gridsterItemCollide, gridsterItem)) {
      gridsterItemCollide.setSize(true);
      this.push(gridsterItem, pushedBy);
      this.addToPushed(gridsterItemCollide);
      return true;
    } else {
      gridsterItemCollide.$item.x += 1;
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
        this.checkPushedItem(pushedItem);
      }
    } else if (pushedItem.$item.y < pushedItem.item.y) {
      pushedItem.$item.y += 1;
      if (this.gridster.findItemWithItem(pushedItem)) {
        pushedItem.$item.y -= 1;
      } else {
        pushedItem.setSize(true);
        this.checkPushedItem(pushedItem);
      }
    }

    if (pushedItem.$item.x > pushedItem.item.x) {
      pushedItem.$item.x -= 1;
      if (this.gridster.findItemWithItem(pushedItem)) {
        pushedItem.$item.x += 1;
      } else {
        pushedItem.setSize(true);
        this.checkPushedItem(pushedItem);
      }
    } else if (pushedItem.$item.x < pushedItem.item.x) {
      pushedItem.$item.x += 1;
      if (this.gridster.findItemWithItem(pushedItem)) {
        pushedItem.$item.x -= 1;
      } else {
        pushedItem.setSize(true);
        this.checkPushedItem(pushedItem);
      }
    }

    if (pushedItem.$item.x === pushedItem.item.x && pushedItem.$item.y === pushedItem.item.y) {
      this.removeFromPushed(pushedItem);
    }
  }

}

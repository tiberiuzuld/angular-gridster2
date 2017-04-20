import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';

@Injectable()
export class GridsterPush {
  private pushedItems: Array<GridsterItemComponent>;

  constructor() {
    this.pushedItems = [];
  }

  pushItems(gridsterItem: GridsterItemComponent) {
    if (gridsterItem.gridster.$options.pushItems) {
      this.push(gridsterItem);
      //TODO checkPushBack
    }
  }

  private push(gridsterItem: GridsterItemComponent) {
    let gridsterItemCollision = gridsterItem.gridster.findItemWithItem(gridsterItem);
    if (gridsterItemCollision && gridsterItemCollision.$item.y <= gridsterItem.$item.y + gridsterItem.$item.rows) {
      gridsterItemCollision.$item.y += 1;
      // TODO check collision grid walls and make move on x if true
      gridsterItemCollision.setSize(true);
      this.addToPushed(gridsterItemCollision);
      this.push(gridsterItemCollision);
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

  }

  private checkPushBack() {

  }

  setPushedItems() {

  }
}

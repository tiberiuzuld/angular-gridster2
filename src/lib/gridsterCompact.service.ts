import {Injectable} from '@angular/core';

import {GridsterComponentInterface} from './gridster.interface';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterItemS} from './gridsterItemS.interface';

@Injectable()
export class GridsterCompact {

  constructor(private gridster: GridsterComponentInterface) {
  }

  destroy(): void {
    delete this.gridster;
  }

  checkCompact(): void {
    if (this.gridster.$options.compactType !== 'none') {
      if (this.gridster.$options.compactType === 'compactUp') {
        this.checkCompactUp();
      } else if (this.gridster.$options.compactType === 'compactLeft') {
        this.checkCompactLeft();
      } else if (this.gridster.$options.compactType === 'compactUp&Left') {
        this.checkCompactUp();
        this.checkCompactLeft();
      } else if (this.gridster.$options.compactType === 'compactLeft&Up') {
        this.checkCompactLeft();
        this.checkCompactUp();
      }
    }
  }

  checkCompactItem(item: GridsterItemS): void {
    if (this.gridster.$options.compactType !== 'none') {
      if (this.gridster.$options.compactType === 'compactUp') {
        this.moveUpTillCollision(item);
      } else if (this.gridster.$options.compactType === 'compactLeft') {
        this.moveLeftTillCollision(item);
      } else if (this.gridster.$options.compactType === 'compactUp&Left') {
        this.moveUpTillCollision(item);
        this.moveLeftTillCollision(item);
      } else if (this.gridster.$options.compactType === 'compactLeft&Up') {
        this.moveLeftTillCollision(item);
        this.moveUpTillCollision(item);
      }
    }
  }

  checkCompactUp(): void {
    let widgetMovedUp = false, widget: GridsterItemComponentInterface, moved: boolean;
    const l = this.gridster.grid.length;
    for (let i = 0; i < l; i++) {
      widget = this.gridster.grid[i];
      if (widget.$item.compactEnabled === false) {
        continue;
      }
      moved = this.moveUpTillCollision(widget.$item);
      if (moved) {
        widgetMovedUp = true;
        widget.item.y = widget.$item.y;
        widget.itemChanged();
      }
    }
    if (widgetMovedUp) {
      this.checkCompactUp();
    }
  }

  moveUpTillCollision(item: GridsterItemS): boolean {
    item.y -= 1;
    if (this.gridster.checkCollision(item)) {
      item.y += 1;
      return false;
    } else {
      this.moveUpTillCollision(item);
      return true;
    }
  }

  checkCompactLeft(): void {
    let widgetMovedUp = false, widget: GridsterItemComponentInterface, moved: boolean;
    const l = this.gridster.grid.length;
    for (let i = 0; i < l; i++) {
      widget = this.gridster.grid[i];
      if (widget.$item.compactEnabled === false) {
        continue;
      }
      moved = this.moveLeftTillCollision(widget.$item);
      if (moved) {
        widgetMovedUp = true;
        widget.item.x = widget.$item.x;
        widget.itemChanged();
      }
    }
    if (widgetMovedUp) {
      this.checkCompactLeft();
    }
  }

  moveLeftTillCollision(item: GridsterItemS): boolean {
    item.x -= 1;
    if (this.gridster.checkCollision(item)) {
      item.x += 1;
      return false;
    } else {
      this.moveLeftTillCollision(item);
      return true;
    }
  }
}

import { Gridster } from './gridster';
import { CompactType } from './gridsterConfig';
import { GridsterItem } from './gridsterItem';
import { GridsterItemConfig } from './gridsterItemConfig';

export class GridsterCompact {
  constructor(private gridster: Gridster) {}

  destroy(): void {
    this.gridster = null!;
  }

  checkCompact(): void {
    if (this.gridster.$options.compactType !== CompactType.None) {
      if (this.gridster.$options.compactType === CompactType.CompactUp) {
        this.checkCompactMovement('y', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeft) {
        this.checkCompactMovement('x', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndLeft) {
        this.checkCompactMovement('y', -1);
        this.checkCompactMovement('x', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeftAndUp) {
        this.checkCompactMovement('x', -1);
        this.checkCompactMovement('y', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactRight) {
        this.checkCompactMovement('x', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndRight) {
        this.checkCompactMovement('y', -1);
        this.checkCompactMovement('x', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactRightAndUp) {
        this.checkCompactMovement('x', 1);
        this.checkCompactMovement('y', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactDown) {
        this.checkCompactMovement('y', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactDownAndLeft) {
        this.checkCompactMovement('y', 1);
        this.checkCompactMovement('x', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactDownAndRight) {
        this.checkCompactMovement('y', 1);
        this.checkCompactMovement('x', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeftAndDown) {
        this.checkCompactMovement('x', -1);
        this.checkCompactMovement('y', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactRightAndDown) {
        this.checkCompactMovement('x', 1);
        this.checkCompactMovement('y', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactGrid) {
        this.checkCompactGrid();
      }
    }
  }

  checkCompactItem(item: GridsterItemConfig): void {
    if (this.gridster.$options.compactType !== CompactType.None) {
      if (this.gridster.$options.compactType === CompactType.CompactUp) {
        this.moveTillCollision(item, 'y', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeft) {
        this.moveTillCollision(item, 'x', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndLeft) {
        this.moveTillCollision(item, 'y', -1);
        this.moveTillCollision(item, 'x', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeftAndUp) {
        this.moveTillCollision(item, 'x', -1);
        this.moveTillCollision(item, 'y', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndRight) {
        this.moveTillCollision(item, 'y', -1);
        this.moveTillCollision(item, 'x', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactDown) {
        this.moveTillCollision(item, 'y', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactDownAndLeft) {
        this.moveTillCollision(item, 'y', 1);
        this.moveTillCollision(item, 'x', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeftAndDown) {
        this.moveTillCollision(item, 'x', -1);
        this.moveTillCollision(item, 'y', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactDownAndRight) {
        this.moveTillCollision(item, 'y', 1);
        this.moveTillCollision(item, 'x', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactRightAndDown) {
        this.moveTillCollision(item, 'x', 1);
        this.moveTillCollision(item, 'y', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactGrid) {
        this.moveToGridPosition(item);
      }
    }
  }

  private checkCompactMovement(direction: 'x' | 'y', delta: number): void {
    let widgetMoved = false;
    this.gridster.grid.forEach((widget: GridsterItem) => {
      if (widget.$item.compactEnabled !== false) {
        const moved = this.moveTillCollision(widget.$item, direction, delta);
        if (moved) {
          widgetMoved = true;
          widget.item[direction] = widget.$item[direction];
          widget.itemChanged();
        }
      }
    });
    if (widgetMoved) {
      this.checkCompact();
    }
  }

  private moveTillCollision(item: GridsterItemConfig, direction: 'x' | 'y', delta: number): boolean {
    item[direction] += delta;
    if (this.gridster.checkCollision(item)) {
      item[direction] -= delta;
      return false;
    } else {
      this.moveTillCollision(item, direction, delta);
      return true;
    }
  }

  private checkCompactGrid(): void {
    // Sort items by their current position (top to bottom, left to right)
    const sortedItems = this.gridster.grid
      .filter((widget: GridsterItem) => widget.$item.compactEnabled !== false)
      .sort((a: GridsterItem, b: GridsterItem) => {
        if (a.$item.y !== b.$item.y) {
          return a.$item.y - b.$item.y;
        }
        return a.$item.x - b.$item.x;
      });

    // Reposition all items in a grid-like manner
    let currentY = 0;
    let currentX = 0;
    let maxYInRow = 0;

    sortedItems.forEach((widget: GridsterItem) => {
      const item = widget.$item;

      // Check if item fits in current row
      if (currentX + item.cols > this.gridster.columns) {
        // Move to next row
        currentY = maxYInRow;
        currentX = 0;
        maxYInRow = currentY;
      }

      // Position item
      const oldX = item.x;
      const oldY = item.y;
      item.x = currentX;
      item.y = currentY;

      // Update widget if position changed
      if (oldX !== item.x || oldY !== item.y) {
        widget.item.x = item.x;
        widget.item.y = item.y;
        widget.itemChanged();
      }

      // Update position for next item
      currentX += item.cols;
      maxYInRow = Math.max(maxYInRow, currentY + item.rows);
    });
  }

  private moveToGridPosition(item: GridsterItemConfig): void {
    // Find the next available position in grid layout
    let currentY = 0;
    let currentX = 0;
    let maxYInRow = 0;

    // Sort existing items to find occupied positions
    const sortedItems = this.gridster.grid
      .filter((widget: GridsterItem) => widget.$item !== item)
      .sort((a: GridsterItem, b: GridsterItem) => {
        if (a.$item.y !== b.$item.y) {
          return a.$item.y - b.$item.y;
        }
        return a.$item.x - b.$item.x;
      });

    // Find the next available position
    for (const widget of sortedItems) {
      const existingItem = widget.$item;

      // Check if we need to move to next row
      if (currentX + existingItem.cols > this.gridster.columns) {
        currentY = maxYInRow;
        currentX = 0;
        maxYInRow = currentY;
      }

      // Check if current item overlaps with the position we want to place our item
      if (
        currentY < existingItem.y + existingItem.rows &&
        currentY + item.rows > existingItem.y &&
        currentX < existingItem.x + existingItem.cols &&
        currentX + item.cols > existingItem.x
      ) {
        // Move to position after this item
        currentX = existingItem.x + existingItem.cols;
        currentY = existingItem.y;
        maxYInRow = Math.max(maxYInRow, currentY + existingItem.rows);
      } else {
        // Update position for next iteration
        currentX += existingItem.cols;
        maxYInRow = Math.max(maxYInRow, currentY + existingItem.rows);
      }
    }

    // Check if item fits in current row
    if (currentX + item.cols > this.gridster.columns) {
      currentY = maxYInRow;
      currentX = 0;
    }

    // Set the position
    item.x = currentX;
    item.y = currentY;
  }
}

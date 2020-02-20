import {Injectable} from '@angular/core';

import {GridsterComponentInterface} from './gridster.interface';

@Injectable()
export class GridsterUtils {

  static merge(obj1: any, obj2: any, properties: any) {
    for (const p in obj2) {
      if (obj2[p] !== void 0 && properties.hasOwnProperty(p)) {
        if (typeof obj2[p] === 'object') {
          obj1[p] = GridsterUtils.merge(obj1[p], obj2[p], properties[p]);
        } else {
          obj1[p] = obj2[p];
        }
      }
    }

    return obj1;
  }

  static debounce(func: Function, wait: number): () => void {
    let timeout: any;
    return function () {
      const context = this, args = arguments;
      const later = function () {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static checkTouchEvent(e: any): void {
    if (e.clientX === undefined && e.touches) {
      if (e.touches && e.touches.length) {
        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length) {
        e.clientX = e.changedTouches[0].clientX;
        e.clientY = e.changedTouches[0].clientY;
      }
    }
  }

  static checkContentClassForEvent(gridster: GridsterComponentInterface, e: any): boolean {
    if (gridster.$options.draggable.ignoreContent) {
      if (!GridsterUtils.checkDragHandleClass(e.target, e.currentTarget, gridster.$options.draggable.dragHandleClass, gridster.$options.draggable.ignoreContentClass)) {
        return true;
      }
    } else {
      if (GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.ignoreContentClass)) {
        return true;
      }
    }
    return false;
  }

  static checkContentClassForEmptyCellClickEvent(gridster: GridsterComponentInterface, e: any): boolean {
    return GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.ignoreContentClass)
      || GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.dragHandleClass);
  }

  static checkDragHandleClass(target: any, current: any, dragHandleClass: string, ignoreContentClass): boolean {
    if (!target || target === current) {
      return false;
    }
    if (target.hasAttribute('class') ) {
      const classnames = target.getAttribute('class').split(' ');
      if (classnames.indexOf(dragHandleClass) > -1) {
        return true;
      }
      if (classnames.indexOf(ignoreContentClass) > -1) {
        return false;
      }
    }
    return GridsterUtils.checkDragHandleClass(target.parentNode, current, dragHandleClass, ignoreContentClass);
  }
  static checkContentClass(target: any, current: any, contentClass: string): boolean {
    if (!target || target === current) {
      return false;
    }
    if (target.hasAttribute('class') && target.getAttribute('class').split(' ').indexOf(contentClass) > -1) {
      return true;
    } else {
      return GridsterUtils.checkContentClass(target.parentNode, current, contentClass);
    }
  }

  static compareItems(a: { x: number, y: number }, b: { x: number, y: number }): number {
    if (a.y > b.y) {
      return -1;
    } else if (a.y < b.y) {
      return 1;
    } else if (a.x > b.x) {
      return -1;
    } else {
      return 1;
    }
  }
}

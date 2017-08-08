import {Injectable} from '@angular/core';

@Injectable()
export class GridsterUtils {

  static merge(obj1, obj2, properties) {
    for (const p in obj2) {
      if (obj2.hasOwnProperty(p) && properties.hasOwnProperty(p)) {
        if (typeof obj2[p] === 'object') {
          obj1[p] = GridsterUtils.merge(obj1[p], obj2[p], properties[p]);
        } else {
          obj1[p] = obj2[p];
        }
      }
    }

    return obj1;
  }

  static debounce(func: Function, wait: number) {
    let timeout;
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

  static checkTouchEvent(e): void {
    if (e.clientX === undefined && e.touches) {
      e.clientX = e.touches[0].clientX;
      e.clientY = e.touches[0].clientY;
    }
  }

  static checkContentClassForEvent(gridster, e): boolean {
    if (gridster.$options.draggable.ignoreContent) {
      if (!GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.dragHandleClass)) {
        return true;
      }
    } else {
      if (GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.ignoreContentClass)) {
        return true;
      }
    }
  }

  static checkContentClass(target, current, contentClass): boolean {
    if (target === current) {
      return false;
    }
    if (target.classList && target.classList.contains(contentClass)) {
      return true;
    } else {
      return GridsterUtils.checkContentClass(target.parentNode, current, contentClass);
    }
  }
}

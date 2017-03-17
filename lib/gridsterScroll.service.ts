import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterResizeEventType} from './gridsterResizeEventType.interface';

@Injectable()
export class GridsterScroll {
  scrollSensitivity: number;
  scrollSpeed: number;
  intervalDuration: number;
  gridsterElement: HTMLElement;
  resizeEvent: boolean;
  resizeEventType: GridsterResizeEventType;
  intervalE: number;
  intervalW: number;
  intervalN: number;
  intervalS: number;

  constructor() {
    this.intervalDuration = 50;
  }

  public scroll(elemPosition: Array<number>, gridsterItem: GridsterItemComponent, e: MouseEvent, lastMouse,
                calculateItemPosition: Function, resize?: boolean, resizeEventScrollType?: GridsterResizeEventType) {
    this.scrollSensitivity = gridsterItem.gridster.state.options.scrollSensitivity;
    this.scrollSpeed = gridsterItem.gridster.state.options.scrollSpeed;
    this.gridsterElement = gridsterItem.gridster.state.element;
    this.resizeEvent = resize;
    this.resizeEventType = resizeEventScrollType;

    const elemTopOffset = elemPosition[1] - this.gridsterElement.scrollTop;
    const elemBottomOffset = this.gridsterElement.offsetHeight + this.gridsterElement.scrollTop - elemPosition[1] - elemPosition[3];
    if (lastMouse.pageY < e.pageY && elemBottomOffset < this.scrollSensitivity) {
      this.cancelN();
      if ((this.resizeEvent && !this.resizeEventType.s) || this.intervalS) {
        return;
      }
      this.intervalS = this.startVertical(1, elemPosition, calculateItemPosition, lastMouse);
    } else if (lastMouse.pageY > e.pageY && this.gridsterElement.scrollTop > 0 && elemTopOffset < this.scrollSensitivity) {
      this.cancelS();
      if ((this.resizeEvent && !this.resizeEventType.n) || this.intervalN) {
        return;
      }
      this.intervalN = this.startVertical(-1, elemPosition, calculateItemPosition, lastMouse);
    } else if (lastMouse.pageY !== e.pageY) {
      this.cancelVertical();
    }

    const elemRightOffset = this.gridsterElement.offsetWidth + this.gridsterElement.scrollLeft - elemPosition[0] - elemPosition[2];
    const elemLeftOffset = elemPosition[0] - this.gridsterElement.scrollLeft;
    if (lastMouse.pageX < e.pageX && elemRightOffset < this.scrollSensitivity) {
      this.cancelW();
      if ((this.resizeEvent && !this.resizeEventType.e) || this.intervalE) {
        return;
      }
      this.intervalE = this.startHorizontal(1, elemPosition, calculateItemPosition, lastMouse);
    } else if (lastMouse.pageX > e.pageX && this.gridsterElement.scrollLeft > 0 && elemLeftOffset < this.scrollSensitivity) {
      this.cancelE();
      if ((this.resizeEvent && !this.resizeEventType.w) || this.intervalW) {
        return;
      }
      this.intervalW = this.startHorizontal(-1, elemPosition, calculateItemPosition, lastMouse);
    } else if (lastMouse.pageX !== e.pageX) {
      this.cancelHorizontal();
    }
  }

  startVertical(sign: number, elemPosition: Array < number >, calculateItemPosition: Function, lastMouse): number {
    return setInterval(function () {
      if (!this.gridsterElement || sign === -1 && this.gridsterElement.scrollTop - this.scrollSpeed < 0) {
        this.cancelVertical();
      }
      this.gridsterElement.scrollTop += sign * this.scrollSpeed;
      if (this.resizeEvent) {
        if (this.resizeEventType.n) {
          elemPosition[1] += sign * this.scrollSpeed;
          elemPosition[3] -= sign * this.scrollSpeed;
        } else {
          elemPosition[3] += sign * this.scrollSpeed;
        }
      } else {
        elemPosition[1] += sign * this.scrollSpeed;
      }

      calculateItemPosition(lastMouse);
    }.bind(this), this.intervalDuration);
  }

  startHorizontal(sign: number, elemPosition: Array < number >, calculateItemPosition: Function, lastMouse): number {
    return setInterval(function () {
      if (!this.gridsterElement || sign === -1 && this.gridsterElement.scrollLeft - this.scrollSpeed < 0) {
        this.cancelHorizontal();
      }
      this.gridsterElement.scrollLeft += sign * this.scrollSpeed;
      if (this.resizeEvent) {
        if (this.resizeEventType.w) {
          elemPosition[0] += sign * this.scrollSpeed;
          elemPosition[2] -= sign * this.scrollSpeed;
        } else {
          elemPosition[2] += sign * this.scrollSpeed;
        }
      } else {
        elemPosition[0] += sign * this.scrollSpeed;
      }
      calculateItemPosition(lastMouse);
    }.bind(this), this.intervalDuration);
  }

  cancelScroll() {
    this.cancelHorizontal();
    this.cancelVertical();
    this.scrollSensitivity = undefined;
    this.scrollSpeed = undefined;
    this.gridsterElement = undefined;
    this.resizeEventType = undefined;
  }

  cancelHorizontal() {
    this.cancelE();
    this.cancelW();
  }

  cancelVertical() {
    this.cancelN();
    this.cancelS();
  }

  cancelE() {
    if (this.intervalE) {
      clearInterval(this.intervalE);
      this.intervalE = undefined;
    }
  }

  cancelW() {
    if (this.intervalW) {
      clearInterval(this.intervalW);
      this.intervalW = undefined;
    }
  }

  cancelS() {
    if (this.intervalS) {
      clearInterval(this.intervalS);
      this.intervalS = undefined;
    }
  }

  cancelN() {
    if (this.intervalN) {
      clearInterval(this.intervalN);
      this.intervalN = undefined;
    }
  }
}

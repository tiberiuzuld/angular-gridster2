import {GridsterItem} from './gridsterItem.interface';
import {GridsterDraggable} from './gridsterDraggable.service';
import {EventEmitter, Renderer2} from '@angular/core';
import {GridsterItemS} from './gridsterItemS.interface';
import {GridsterResizable} from './gridsterResizable.service';
import {GridsterComponentInterface} from './gridster.interface';

export interface GridsterItemComponentInterface {
  item: GridsterItem;
  itemChange: EventEmitter<GridsterItem>;
  itemResize: EventEmitter<GridsterItem>;
  $item: GridsterItemS;
  itemTop: number;
  itemLeft: number;
  itemWidth: number;
  itemHeight: number;
  top: number;
  left: number;
  width: number;
  height: number;
  itemMargin: number;
  drag: GridsterDraggable;
  resize: GridsterResizable;
  notPlaced: boolean;
  setSize: Function;
  checkItemChanges: Function;
  canBeDragged: Function;
  canBeResized: Function;
  el: any;
  gridster: GridsterComponentInterface;
  renderer: Renderer2;
}

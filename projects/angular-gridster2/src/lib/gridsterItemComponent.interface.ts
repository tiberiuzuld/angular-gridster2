import {GridsterItem} from './gridsterItem.interface';
import {GridsterDraggable} from './gridsterDraggable.service';
import {Renderer2} from '@angular/core';
import {GridsterResizable} from './gridsterResizable.service';
import {GridsterComponentInterface} from './gridster.interface';

export abstract class GridsterItemComponentInterface {
  item: GridsterItem;
  $item: GridsterItem;
  top: number;
  left: number;
  width: number;
  height: number;
  drag: GridsterDraggable;
  resize: GridsterResizable;
  notPlaced: boolean;
  updateOptions: () => void;
  itemChanged: () => void;
  setSize: () => void;
  checkItemChanges: (newValue: GridsterItem, oldValue: GridsterItem) => void;
  canBeDragged: () => boolean;
  canBeResized: () => boolean;
  bringToFront: (offset: number) => void;
  sendToBack: (v: number) => void ;
  el: any;
  gridster: GridsterComponentInterface;
  renderer: Renderer2;
}

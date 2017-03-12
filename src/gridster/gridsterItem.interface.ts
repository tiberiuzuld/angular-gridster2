export interface GridsterItem {
  x?: number;
  y?: number;
  rows?: number;
  cols?: number;
  initCallback?: Function;
  setSize?: Function;
  checkItemChanges?: Function;
  itemChanged?: Function;
  drag?: {
    toggle: Function
  };
  resize?: {
    toggle: Function
  };
}

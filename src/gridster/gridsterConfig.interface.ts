type GridType = 'fit' | 'scrollVertical' | 'scrollHorizontal';
type ResizableHandles = 's'| 'e'| 'n'| 'w'| 'se'| 'ne'| 'sw'| 'nw';

export interface GridsterConfig {
  gridType: GridType;
  compactUp: boolean;
  compactLeft: boolean;
  mobileBreakpoint: number;
  minCols: number;
  maxCols: number;
  minRows: number;
  maxRows: number;
  defaultItemCols: number;
  defaultItemRows: number;
  minItemCols: number;
  minItemRows: number;
  margin: number;
  outerMargin: boolean;
  scrollSensitivity: number;
  scrollSpeed: number;
  itemChangeCallback?: Function;
  draggable: Draggable;
  resizable: Resizable;
  swap: boolean;
}

interface Draggable {
  enabled: boolean;
  stop?: Function;
}

interface Resizable extends Draggable {
  handles: ResizableHandles[];
}

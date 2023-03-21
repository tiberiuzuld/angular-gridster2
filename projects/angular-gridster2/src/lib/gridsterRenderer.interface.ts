export interface CommonGridStyle {
  [key: string]: string;
}

export interface CommonGridCachedStyle {
  width: number;
  height: number;
  style: CommonGridStyle;
}

export interface GridColumnCachedStyle extends CommonGridCachedStyle {
  left: number;
}

export interface GridRowCachedStyle extends CommonGridCachedStyle {
  top: number;
}

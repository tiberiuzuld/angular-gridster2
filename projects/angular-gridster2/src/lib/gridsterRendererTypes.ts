export type CommonGridStyle = {
  [key: string]: string;
};

export type CommonGridCachedStyle = {
  width: number;
  height: number;
  style: CommonGridStyle;
};

export type GridColumnCachedStyle = CommonGridCachedStyle & {
  left: number;
};

export type GridRowCachedStyle = CommonGridCachedStyle & {
  top: number;
};

import { GridType, type GridsterConfigStrict } from './gridsterConfig';

type GridsterMarginOptions = Pick<GridsterConfigStrict, 'gridType' | 'ignoreMarginInRow' | 'margin'>;

export function getItemWidthMargin($options: GridsterMarginOptions): number {
  if ($options.ignoreMarginInRow && ($options.gridType === GridType.Fixed || $options.gridType === GridType.HorizontalFixed)) {
    return 0;
  }

  return $options.margin;
}

export function getItemHeightMargin($options: GridsterMarginOptions): number {
  if ($options.ignoreMarginInRow && ($options.gridType === GridType.Fixed || $options.gridType === GridType.VerticalFixed)) {
    return 0;
  }

  return $options.margin;
}

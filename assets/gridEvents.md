### Options

| Option                  | Description                                                            | Type                                          | Default   |
| ----------------------- | ---------------------------------------------------------------------- | --------------------------------------------- | --------- |
| initCallback            | callback to call after grid has initialized                            | Function(gridsterComponent)                   | undefined |
| destroyCallback         | callback to call after grid has destroyed                              | Function(gridsterComponent)                   | undefined |
| gridSizeChangedCallback | callback to call after grid has changed size cols/rows                 | Function(gridsterComponent)                   | undefined |
| itemChangeCallback      | callback to call for each item when is changes x, y, rows, cols        | Function(gridsterItem, gridsterItemComponent) | undefined |
| itemResizeCallback      | callback to call for each item when width/height changes               | Function(gridsterItem, gridsterItemComponent) | undefined |
| itemInitCallback        | callback to call for each item when is initialized                     | Function(gridsterItem, gridsterItemComponent) | undefined |
| itemRemovedCallback     | callback to call for each item when is removed                         | Function(gridsterItem, gridsterItemComponent) | undefined |
| itemValidateCallback    | callback to call to validate item position/size. Return true if valid. | Function(gridsterItem)                        | undefined |

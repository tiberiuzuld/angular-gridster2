### Options

| Option           | Description                                                                 | Type                                                                                                       | Default   |
| ---------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------- |
| x                | x position if missing will auto position                                    | Number                                                                                                     | undefined |
| y                | y position if missing will auto position                                    | Number                                                                                                     | undefined |
| rows             | number of rows if missing will use grid option `defaultItemRows`            | Number                                                                                                     | undefined |
| cols             | number of columns if missing will use grid option `defaultItemCols`         | Number                                                                                                     | undefined |
| itemAspectRatio  | override grid option `itemAspectRation`, ratio for cols/rows, e.g 4/3, 16/9 | Number                                                                                                     | undefined |
| minItemRows      | override grid option `minItemRows`                                          | Number                                                                                                     | undefined |
| maxItemRows      | override grid option `maxItemRows`                                          | Number                                                                                                     | undefined |
| minItemCols      | override grid option `minItemCols`                                          | Number                                                                                                     | undefined |
| maxItemCols      | override grid option `maxItemCols`                                          | Number                                                                                                     | undefined |
| minItemArea      | override grid option `minItemArea`                                          | Number                                                                                                     | undefined |
| maxItemArea      | override grid option `maxItemArea`                                          | Number                                                                                                     | undefined |
| dragEnabled      | override grid option `draggable.enabled`                                    | Boolean                                                                                                    | undefined |
| resizeEnabled    | override grid option `resizable.enabled`                                    | Boolean                                                                                                    | undefined |
| compactEnabled   | disable grid option `compact` for this item                                 | Boolean                                                                                                    | undefined |
| initCallback     | initialization callback and has size > 0                                    | Function(GridsterItem, GridsterItemComponent)                                                              | undefined |
| resizableHandles | override grid option `resizable.handles` for this item                      | Object {s: boolean, e: boolean, n: boolean, w: boolean, se: boolean, ne:boolean, sw: boolean, nw: boolean} | undefined |

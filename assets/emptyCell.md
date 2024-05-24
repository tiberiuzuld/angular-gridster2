### Options

| Option                       | Description                                         | Type                          | Default   |
| ---------------------------- | --------------------------------------------------- | ----------------------------- | --------- |
| enableEmptyCellClick         | enable empty cell click events                      | Boolean                       | false     |
| enableEmptyCellContextMenu   | enable empty cell context menu (right click) events | Boolean                       | false     |
| enableEmptyCellDrop          | enable empty cell drop events                       | Boolean                       | false     |
| enableEmptyCellDrag          | enable empty cell drag events                       | Boolean                       | false     |
| enableOccupiedCellDrop       | enable occupied cell drop events                    | Boolean                       | false     |
| emptyCellDragMaxCols         | limit empty cell drag max cols                      | Number                        | 50        |
| emptyCellDragMaxRows         | limit empty cell drag max rows                      | Number                        | 50        |
| emptyCellClickCallback       | empty cell click callback                           | Function(event, gridsterItem) | undefined |
| emptyCellContextMenuCallback | empty cell context menu (right click) callback      | Function(event, gridsterItem) | undefined |
| emptyCellDropCallback        | empty cell drag drop callback. HTML5 Drag & Drop    | Function(event, gridsterItem) | undefined |
| emptyCellDragCallback        | empty cell drag and create item like excel cell     | Function(event, gridsterItem) | undefined |

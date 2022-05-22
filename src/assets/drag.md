### Options

| Option                          | Description                                                                         | Type                                   | Default                 |
| ------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------- | ----------------------- |
| draggable.delayStart            | milliseconds to delay the start of drag, useful for touch interaction               | Number                                 | 0                       |
| draggable.enabled               | enable/disable draggable items                                                      | Boolean                                | false                   |
| draggable.ignoreContent         | if true drag will start only from elements from `dragHandleClass`                   | Boolean                                | false                   |
| draggable.dragHandleClass       | drag event only from this class. If `ignoreContent` is true.                        | String                                 | 'drag-handler'          |
| draggable.ignoreContentClass    | default content class to ignore the drag event from                                 | String                                 | 'gridster-item-content' |
| draggable.stop                  | callback when dragging an item stops. Accepts Promise return to cancel/approve drag | Function(item, gridsterItem, event)    | undefined               |
| draggable.start                 | callback when dragging an item starts                                               | Function(item, gridsterItem, event)    | undefined               |
| draggable.dropOverItems         | enable items drop over another, will work if swap and push is disabled              | Boolean                                | false                   |
| draggable.dropOverItemsCallback | callback when dragging an item drops over another item                              | Function(sourceItem, targetItem, grid) | undefined               |
| disableScrollHorizontal         | enable/disable auto horizontal scrolling when on edge of grid                       | Boolean                                | false                   |
| disableScrollVertical           | enable/disable auto vertical scrolling when on edge of grid                         | Boolean                                | false                   |
| enableBoundaryControl           | enable/disable boundary control while dragging items                                | Boolean                                | false                   |

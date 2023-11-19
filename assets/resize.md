### Options

| Option               | Description                                                                           | Type                                | Default                                                                     |
| -------------------- | ------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------- |
| resizable.delayStart | milliseconds to delay the start of resize, useful for touch interaction               | Number                              | 0                                                                           |
| resizable.enabled    | enable/disable resizable items                                                        | Boolean                             | false                                                                       |
| resizable.stop       | callback when resizing an item stops. Accepts Promise return to cancel/approve resize | Function(item, gridsterItem, event) | undefined                                                                   |
| resizable.start      | callback when resizing an item starts                                                 | Function(item, gridsterItem, event) | undefined                                                                   |
| resizable.handles    | resizable edges of an item                                                            | Object                              | {s: true, e: true, n: true, w: true, se: true, ne:true, sw: true, nw: true} |

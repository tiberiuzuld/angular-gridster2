### Options

Can be access from `this.options.api` after the grid has initialized.

| API                                          | Description                                                                                             | Return                |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------- |
| resize()                                     | call if size of container changes. Grid will auto resize on window resize                               | Void                  |
| optionsChanged()                             | call on change of options after initialization                                                          | Void                  |
| getNextPossiblePosition(item: GridsterItem)  | call to get a viable position for item. Returns true if found.                                          | Boolean               |
| getFirstPossiblePosition(item: GridsterItem) | call to get the first viable position for an item. Returns a copy of the item with the future position. | GridsterItem          |
| getLastPossiblePosition(item: GridsterItem)  | call to get a viable position for item. Returns a copy of the item with the future position.            | GridsterItem          |
| getItemComponent: (item: GridsterItem)       | call to get a internal component for item. Returns a component item or undefined if not found.          | GridsterItemComponent |

To see how to push/swap/pushResize items from code look at the source of this
component [here](https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/api/api.component.ts)

### Options

| Option                  | Description                                                                              | Type    | Default |
| ----------------------- | ---------------------------------------------------------------------------------------- | ------- | ------- |
| gridType                | different types for layout for the grid. See Grid Types table                            | String  | 'fit'   |
| fixedColWidth           | fixed col width for gridType: `fixed`                                                    | Number  | 250     |
| fixedRowHeight          | fixed row height for gridType: `fixed`                                                   | Number  | 250     |
| rowHeightRatio          | row height ratio from column width for gridType: `scrollVertical` and `scrollHorizontal` | Number  | 1       |
| keepFixedHeightInMobile | keep the height from fixed gridType in mobile layout                                     | Boolean | false   |
| keepFixedWidthInMobile  | keep the width from fixed gridType in mobile layout                                      | Boolean | false   |
| useBodyForBreakpoint    | use the width of the `<body>` element to determine when to switch to the mobile layout   | Boolean | false   |
| setGridSize             | sets grid size depending on content                                                      | Boolean | false   |
| mobileBreakpoint        | if the screen is not wider that this, remove the grid layout and stack the items         | Number  | 640     |

### Grid Types

| Type             | Description                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| fit              | will fit the items in the container without scroll                                             |
| scrollVertical   | will fit on width and height of the items will be the same as the width                        |
| scrollHorizontal | will fit on height and width of the items will be the same as the height                       |
| fixed            | will set the rows and columns dimensions based on `fixedColWidth` and `fixedRowHeight` options |
| verticalFixed    | will set the rows to `fixedRowHeight` and columns width will fit the space available           |
| horizontalFixed  | will set the columns to `fixedColWidth` and rows height will fit the space available           |

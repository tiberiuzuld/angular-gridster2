### Options

| Option                        | Description                                                                                                                                     | Type    | Default |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- |
| disableWindowResize           | disable the window on resize listener. This will stop grid to recalculate on window resize.                                                     | Boolean | false   |
| scrollToNewItems              | scroll to new items placed in a scrollable view                                                                                                 | Boolean | false   |
| disableWarnings               | disable console log warnings about misplacement of grid items                                                                                   | Boolean | false   |
| ignoreMarginInRow             | ignore the gap between rows for items which span multiple rows (see #162, #224) only for gridType: `fixed` , `verticalFixed`, `horizontalFixed` | Boolean | false   |
| disableAutoPositionOnConflict | disable auto-position of items on conflict state                                                                                                | Boolean | false   |
| scale                         | scale param to zoom in/zoom out                                                                                                                 | number  | 1       |

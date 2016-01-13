(function () {
  'use strict';

  angular.module('angular-gridster2')
    .constant('gridsterConfig', {
      colWidth: 'fit', // 'fit' will divide container width to the number of columns; number of pixels to set colWidth
      rowHeight: 'fit', // 'match' will be equal to colWidth; 'fit' will divide container height to number of rows; number of pixels to set rowHeight
      fitBreakpoint: 1024, // if the screen is not wider that this, rowHeight 'fit' will be calculated as 'match'
      mobileBreakpoint: 640, // if the screen is not wider that this, remove the grid layout and stack the items
      minCols: 1,// minimum amount of columns in the grid
      maxCols: 100,// maximum amount of columns in the grid
      minRows: 1,// minimum amount of rows in the grid
      maxRows: 100,// maximum amount of rows in the grid
      defaultItemCols: 1, // default width of an item in columns
      defaultItemRows: 1, // default height of an item in rows
      minItemCols: 1, // min item number of columns
      minItemRows: 1, // min item number of rows
      margin: 10, //margin between grid items
      outerMargin: true, //if margins will apply to the sides of the container
      scrollSensitivity: 20, //margin of the dashboard where to start scrolling
      scrollSpeed: 10, //how much to scroll each mouse move when in the scrollSensitivity zone
      itemChangeCallback: undefined, //callback to call for each item when is changes x, y, rows, cols. Arguments:gridsterItem, scope
      draggable: {
        enabled: false, // enable/disable draggable items
        stop: undefined // callback when dragging an item stops. Arguments: gridsterItem, scope
      },
      resizable: {
        enabled: false, // enable/disable resizable items
        handles: ['s', 'e', 'n', 'w', 'se', 'ne', 'sw', 'nw'], // resizable edges of an item
        stop: undefined // callback when resizing an item stops. Arguments: gridsterItem, scope
      }
    });
})();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridsterConfigService = {
    gridType: 'fit',
    // 'scrollVertical' will fit on width and height of the items will be the same as the width
    // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
    // 'fixed' will set the rows and columns dimensions based on fixedColWidth and fixedRowHeight options
    fixedColWidth: 250,
    fixedRowHeight: 250,
    compactUp: false,
    compactLeft: false,
    mobileBreakpoint: 640,
    minCols: 1,
    maxCols: 100,
    minRows: 1,
    maxRows: 100,
    defaultItemCols: 1,
    defaultItemRows: 1,
    maxItemCols: 50,
    maxItemRows: 50,
    minItemCols: 1,
    minItemRows: 1,
    margin: 10,
    outerMargin: true,
    scrollSensitivity: 10,
    scrollSpeed: 20,
    itemChangeCallback: undefined,
    itemResizeCallback: undefined,
    draggable: {
        enabled: false,
        ignoreContentClass: 'gridster-item-content',
        stop: undefined // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
        // Arguments: item, gridsterItem, event
    },
    resizable: {
        enabled: false,
        handles: {
            s: true,
            e: true,
            n: true,
            w: true,
            se: true,
            ne: true,
            sw: true,
            nw: true
        },
        stop: undefined // callback when resizing an item stops. Accepts Promise return to cancel/approve resize.
        // Arguments: item, gridsterItem, event
    },
    swap: true,
    pushItems: false,
    displayGrid: 'onDrag&Resize' // display background grid of rows and columns
};
//# sourceMappingURL=gridsterConfig.constant.js.map
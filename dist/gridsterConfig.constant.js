"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridsterConfigService = {
    gridType: 'fit',
    // 'scrollVertical' will fit on width and height of the items will be the same as the width
    // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
    compactUp: false,
    compactLeft: false,
    mobileBreakpoint: 640,
    minCols: 1,
    maxCols: 100,
    minRows: 1,
    maxRows: 100,
    defaultItemCols: 1,
    defaultItemRows: 1,
    minItemCols: 1,
    minItemRows: 1,
    margin: 10,
    outerMargin: true,
    scrollSensitivity: 10,
    scrollSpeed: 20,
    itemChangeCallback: undefined,
    draggable: {
        enabled: false,
        stop: undefined // callback when dragging an item stops. Arguments: gridsterItem, scope
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
        stop: undefined // callback when resizing an item stops. Arguments: gridsterItem, scope
    },
    swap: true // allow items to switch position if drop on top of another
};
//# sourceMappingURL=gridsterConfig.constant.js.map
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('angular-gridster2', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = global || self, factory(global['angular-gridster2'] = {}, global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var GridsterComponentInterface = /** @class */ (function () {
        function GridsterComponentInterface() {
        }
        return GridsterComponentInterface;
    }());


    (function (GridType) {
        GridType["Fit"] = "fit";
        GridType["ScrollVertical"] = "scrollVertical";
        GridType["ScrollHorizontal"] = "scrollHorizontal";
        GridType["Fixed"] = "fixed";
        GridType["VerticalFixed"] = "verticalFixed";
        GridType["HorizontalFixed"] = "horizontalFixed";
    })(exports.GridType || (exports.GridType = {}));

    (function (DisplayGrid) {
        DisplayGrid["Always"] = "always";
        DisplayGrid["OnDragAndResize"] = "onDrag&Resize";
        DisplayGrid["None"] = "none";
    })(exports.DisplayGrid || (exports.DisplayGrid = {}));

    (function (CompactType) {
        CompactType["None"] = "none";
        CompactType["CompactUp"] = "compactUp";
        CompactType["CompactLeft"] = "compactLeft";
        CompactType["CompactUpAndLeft"] = "compactUp&Left";
        CompactType["CompactLeftAndUp"] = "compactLeft&Up";
        CompactType["CompactRight"] = "compactRight";
        CompactType["CompactUpAndRight"] = "compactUp&Right";
        CompactType["CompactRightAndUp"] = "compactRight&Up";
    })(exports.CompactType || (exports.CompactType = {}));

    (function (DirTypes) {
        DirTypes["LTR"] = "ltr";
        DirTypes["RTL"] = "rtl";
    })(exports.DirTypes || (exports.DirTypes = {}));

    var GridsterCompact = /** @class */ (function () {
        function GridsterCompact(gridster) {
            this.gridster = gridster;
        }
        GridsterCompact.prototype.destroy = function () {
            delete this.gridster;
        };
        GridsterCompact.prototype.checkCompact = function () {
            if (this.gridster.$options.compactType !== exports.CompactType.None) {
                if (this.gridster.$options.compactType === exports.CompactType.CompactUp) {
                    this.checkCompactUp();
                }
                else if (this.gridster.$options.compactType === exports.CompactType.CompactLeft) {
                    this.checkCompactLeft();
                }
                else if (this.gridster.$options.compactType === exports.CompactType.CompactUpAndLeft) {
                    this.checkCompactUp();
                    this.checkCompactLeft();
                }
                else if (this.gridster.$options.compactType === exports.CompactType.CompactLeftAndUp) {
                    this.checkCompactLeft();
                    this.checkCompactUp();
                }
                else if (this.gridster.$options.compactType === exports.CompactType.CompactRight) {
                    this.checkCompactRight();
                }
                else if (this.gridster.$options.compactType === exports.CompactType.CompactUpAndRight) {
                    this.checkCompactUp();
                    this.checkCompactRight();
                }
                else if (this.gridster.$options.compactType === exports.CompactType.CompactRightAndUp) {
                    this.checkCompactRight();
                    this.checkCompactUp();
                }
            }
        };
        GridsterCompact.prototype.checkCompactItem = function (item) {
            if (this.gridster.$options.compactType !== exports.CompactType.None) {
                if (this.gridster.$options.compactType === exports.CompactType.CompactUp) {
                    this.moveUpTillCollision(item);
                }
                else if (this.gridster.$options.compactType === exports.CompactType.CompactLeft) {
                    this.moveLeftTillCollision(item);
                }
                else if (this.gridster.$options.compactType === exports.CompactType.CompactUpAndLeft) {
                    this.moveUpTillCollision(item);
                    this.moveLeftTillCollision(item);
                }
                else if (this.gridster.$options.compactType === exports.CompactType.CompactLeftAndUp) {
                    this.moveLeftTillCollision(item);
                    this.moveUpTillCollision(item);
                }
                else if (this.gridster.$options.compactType === exports.CompactType.CompactUpAndRight) {
                    this.moveUpTillCollision(item);
                    this.moveRightTillCollision(item);
                }
            }
        };
        GridsterCompact.prototype.checkCompactUp = function () {
            var widgetMovedUp = false, widget, moved;
            var l = this.gridster.grid.length;
            for (var i = 0; i < l; i++) {
                widget = this.gridster.grid[i];
                if (widget.$item.compactEnabled === false) {
                    continue;
                }
                moved = this.moveUpTillCollision(widget.$item);
                if (moved) {
                    widgetMovedUp = true;
                    widget.item.y = widget.$item.y;
                    widget.itemChanged();
                }
            }
            if (widgetMovedUp) {
                this.checkCompact();
            }
        };
        GridsterCompact.prototype.moveUpTillCollision = function (item) {
            item.y -= 1;
            if (this.gridster.checkCollision(item)) {
                item.y += 1;
                return false;
            }
            else {
                this.moveUpTillCollision(item);
                return true;
            }
        };
        GridsterCompact.prototype.checkCompactLeft = function () {
            var widgetMovedUp = false, widget, moved;
            var l = this.gridster.grid.length;
            for (var i = 0; i < l; i++) {
                widget = this.gridster.grid[i];
                if (widget.$item.compactEnabled === false) {
                    continue;
                }
                moved = this.moveLeftTillCollision(widget.$item);
                if (moved) {
                    widgetMovedUp = true;
                    widget.item.x = widget.$item.x;
                    widget.itemChanged();
                }
            }
            if (widgetMovedUp) {
                this.checkCompact();
            }
        };
        GridsterCompact.prototype.checkCompactRight = function () {
            var widgetMovedUp = false, widget, moved;
            var l = this.gridster.grid.length;
            for (var i = 0; i < l; i++) {
                widget = this.gridster.grid[i];
                if (widget.$item.compactEnabled === false) {
                    continue;
                }
                moved = this.moveRightTillCollision(widget.$item);
                if (moved) {
                    widgetMovedUp = true;
                    widget.item.x = widget.$item.x;
                    widget.itemChanged();
                }
            }
            if (widgetMovedUp) {
                this.checkCompact();
            }
        };
        GridsterCompact.prototype.moveLeftTillCollision = function (item) {
            item.x -= 1;
            if (this.gridster.checkCollision(item)) {
                item.x += 1;
                return false;
            }
            else {
                this.moveLeftTillCollision(item);
                return true;
            }
        };
        GridsterCompact.prototype.moveRightTillCollision = function (item) {
            item.x += 1;
            if (this.gridster.checkCollision(item)) {
                item.x -= 1;
                return false;
            }
            else {
                this.moveRightTillCollision(item);
                return true;
            }
        };
        GridsterCompact.ctorParameters = function () { return [
            { type: GridsterComponentInterface }
        ]; };
        GridsterCompact = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [GridsterComponentInterface])
        ], GridsterCompact);
        return GridsterCompact;
    }());

    var GridsterConfigService = {
        gridType: exports.GridType.Fit,
        scale: 1,
        // 'scrollVertical' will fit on width and height of the items will be the same as the width
        // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
        // 'fixed' will set the rows and columns dimensions based on fixedColWidth and fixedRowHeight options
        // 'verticalFixed' will set the rows to fixedRowHeight and columns width will fit the space available
        // 'horizontalFixed' will set the columns to fixedColWidth and rows height will fit the space available
        fixedColWidth: 250,
        fixedRowHeight: 250,
        keepFixedHeightInMobile: false,
        keepFixedWidthInMobile: false,
        setGridSize: false,
        compactType: exports.CompactType.None,
        mobileBreakpoint: 640,
        allowMultiLayer: false,
        defaultLayerIndex: 0,
        maxLayerIndex: 2,
        baseLayerIndex: 1,
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
        minItemArea: 1,
        maxItemArea: 2500,
        margin: 10,
        outerMargin: true,
        outerMarginTop: null,
        outerMarginRight: null,
        outerMarginBottom: null,
        outerMarginLeft: null,
        useTransformPositioning: true,
        scrollSensitivity: 10,
        scrollSpeed: 20,
        initCallback: undefined,
        destroyCallback: undefined,
        gridSizeChangedCallback: undefined,
        itemChangeCallback: undefined,
        // Arguments: gridsterItem, gridsterItemComponent
        itemResizeCallback: undefined,
        // Arguments: gridsterItem, gridsterItemComponent
        itemInitCallback: undefined,
        // Arguments: gridsterItem, gridsterItemComponent
        itemRemovedCallback: undefined,
        // Arguments: gridsterItem, gridsterItemComponent
        itemValidateCallback: undefined,
        // Arguments: gridsterItem
        enableEmptyCellClick: false,
        enableEmptyCellContextMenu: false,
        enableEmptyCellDrop: false,
        enableEmptyCellDrag: false,
        enableOccupiedCellDrop: false,
        emptyCellClickCallback: undefined,
        emptyCellContextMenuCallback: undefined,
        emptyCellDropCallback: undefined,
        emptyCellDragCallback: undefined,
        emptyCellDragMaxCols: 50,
        emptyCellDragMaxRows: 50,
        // Arguments: event, gridsterItem{x, y, rows: defaultItemRows, cols: defaultItemCols}
        ignoreMarginInRow: false,
        draggable: {
            delayStart: 0,
            enabled: false,
            ignoreContentClass: 'gridster-item-content',
            ignoreContent: false,
            dragHandleClass: 'drag-handler',
            stop: undefined,
            start: undefined,
            // Arguments: item, gridsterItem, event
            dropOverItems: false,
            dropOverItemsCallback: undefined // callback on drop over another item
            // Arguments: source, target, gridComponent
        },
        resizable: {
            delayStart: 0,
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
            stop: undefined,
            start: undefined // callback when resizing an item starts.
            // Arguments: item, gridsterItem, event
        },
        swap: true,
        swapWhileDragging: false,
        pushItems: false,
        disablePushOnDrag: false,
        disablePushOnResize: false,
        pushDirections: { north: true, east: true, south: true, west: true },
        pushResizeItems: false,
        displayGrid: exports.DisplayGrid.OnDragAndResize,
        disableWindowResize: false,
        disableWarnings: false,
        scrollToNewItems: false,
        disableScrollHorizontal: false,
        disableScrollVertical: false,
        disableAutoPositionOnConflict: false,
        dirType: exports.DirTypes.LTR,
    };

    var GridsterUtils = /** @class */ (function () {
        function GridsterUtils() {
        }
        GridsterUtils_1 = GridsterUtils;
        GridsterUtils.merge = function (obj1, obj2, properties) {
            for (var p in obj2) {
                if (obj2[p] !== void 0 && properties.hasOwnProperty(p)) {
                    if (typeof obj2[p] === 'object') {
                        obj1[p] = GridsterUtils_1.merge(obj1[p], obj2[p], properties[p]);
                    }
                    else {
                        obj1[p] = obj2[p];
                    }
                }
            }
            return obj1;
        };
        GridsterUtils.debounce = function (func, wait) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    func.apply(context, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
        GridsterUtils.checkTouchEvent = function (e) {
            if (e.clientX === undefined && e.touches) {
                if (e.touches && e.touches.length) {
                    e.clientX = e.touches[0].clientX;
                    e.clientY = e.touches[0].clientY;
                }
                else if (e.changedTouches && e.changedTouches.length) {
                    e.clientX = e.changedTouches[0].clientX;
                    e.clientY = e.changedTouches[0].clientY;
                }
            }
        };
        GridsterUtils.checkContentClassForEvent = function (gridster, e) {
            if (gridster.$options.draggable.ignoreContent) {
                if (!GridsterUtils_1.checkDragHandleClass(e.target, e.currentTarget, gridster.$options.draggable.dragHandleClass, gridster.$options.draggable.ignoreContentClass)) {
                    return true;
                }
            }
            else {
                if (GridsterUtils_1.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.ignoreContentClass)) {
                    return true;
                }
            }
            return false;
        };
        GridsterUtils.checkContentClassForEmptyCellClickEvent = function (gridster, e) {
            return GridsterUtils_1.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.ignoreContentClass)
                || GridsterUtils_1.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.dragHandleClass);
        };
        GridsterUtils.checkDragHandleClass = function (target, current, dragHandleClass, ignoreContentClass) {
            if (!target || target === current) {
                return false;
            }
            if (target.hasAttribute('class')) {
                var classnames = target.getAttribute('class').split(' ');
                if (classnames.indexOf(dragHandleClass) > -1) {
                    return true;
                }
                if (classnames.indexOf(ignoreContentClass) > -1) {
                    return false;
                }
            }
            return GridsterUtils_1.checkDragHandleClass(target.parentNode, current, dragHandleClass, ignoreContentClass);
        };
        GridsterUtils.checkContentClass = function (target, current, contentClass) {
            if (!target || target === current) {
                return false;
            }
            if (target.hasAttribute('class') && target.getAttribute('class').split(' ').indexOf(contentClass) > -1) {
                return true;
            }
            else {
                return GridsterUtils_1.checkContentClass(target.parentNode, current, contentClass);
            }
        };
        GridsterUtils.compareItems = function (a, b) {
            if (a.y > b.y) {
                return -1;
            }
            else if (a.y < b.y) {
                return 1;
            }
            else if (a.x > b.x) {
                return -1;
            }
            else {
                return 1;
            }
        };
        var GridsterUtils_1;
        GridsterUtils = GridsterUtils_1 = __decorate([
            core.Injectable()
        ], GridsterUtils);
        return GridsterUtils;
    }());

    var GridsterEmptyCell = /** @class */ (function () {
        function GridsterEmptyCell(gridster) {
            this.gridster = gridster;
        }
        GridsterEmptyCell.prototype.destroy = function () {
            delete this.initialItem;
            delete this.gridster.movingItem;
            if (this.gridster.previewStyle) {
                this.gridster.previewStyle();
            }
            delete this.gridster;
            if (this.emptyCellExit) {
                this.emptyCellExit();
                this.emptyCellExit = null;
            }
        };
        GridsterEmptyCell.prototype.updateOptions = function () {
            var _this = this;
            if (this.gridster.$options.enableEmptyCellClick && !this.emptyCellClick && this.gridster.options.emptyCellClickCallback) {
                this.emptyCellClick = this.gridster.renderer.listen(this.gridster.el, 'click', this.emptyCellClickCb.bind(this));
                this.emptyCellClickTouch = this.gridster.renderer.listen(this.gridster.el, 'touchend', this.emptyCellClickCb.bind(this));
            }
            else if (!this.gridster.$options.enableEmptyCellClick && this.emptyCellClick && this.emptyCellClickTouch) {
                this.emptyCellClick();
                this.emptyCellClickTouch();
                this.emptyCellClick = null;
                this.emptyCellClickTouch = null;
            }
            if (this.gridster.$options.enableEmptyCellContextMenu && !this.emptyCellContextMenu &&
                this.gridster.options.emptyCellContextMenuCallback) {
                this.emptyCellContextMenu = this.gridster.renderer.listen(this.gridster.el, 'contextmenu', this.emptyCellContextMenuCb.bind(this));
            }
            else if (!this.gridster.$options.enableEmptyCellContextMenu && this.emptyCellContextMenu) {
                this.emptyCellContextMenu();
                this.emptyCellContextMenu = null;
            }
            if (this.gridster.$options.enableEmptyCellDrop && !this.emptyCellDrop && this.gridster.options.emptyCellDropCallback) {
                this.emptyCellDrop = this.gridster.renderer.listen(this.gridster.el, 'drop', this.emptyCellDragDrop.bind(this));
                this.gridster.zone.runOutsideAngular(function () {
                    _this.emptyCellMove = _this.gridster.renderer.listen(_this.gridster.el, 'dragover', _this.emptyCellDragOver.bind(_this));
                });
                this.emptyCellExit = this.gridster.renderer.listen('document', 'dragend', function () {
                    _this.gridster.movingItem = null;
                    _this.gridster.previewStyle();
                });
            }
            else if (!this.gridster.$options.enableEmptyCellDrop && this.emptyCellDrop && this.emptyCellMove && this.emptyCellExit) {
                this.emptyCellDrop();
                this.emptyCellMove();
                this.emptyCellExit();
                this.emptyCellMove = null;
                this.emptyCellDrop = null;
                this.emptyCellExit = null;
            }
            if (this.gridster.$options.enableEmptyCellDrag && !this.emptyCellDrag && this.gridster.options.emptyCellDragCallback) {
                this.emptyCellDrag = this.gridster.renderer.listen(this.gridster.el, 'mousedown', this.emptyCellMouseDown.bind(this));
                this.emptyCellDragTouch = this.gridster.renderer.listen(this.gridster.el, 'touchstart', this.emptyCellMouseDown.bind(this));
            }
            else if (!this.gridster.$options.enableEmptyCellDrag && this.emptyCellDrag && this.emptyCellDragTouch) {
                this.emptyCellDrag();
                this.emptyCellDragTouch();
                this.emptyCellDrag = null;
                this.emptyCellDragTouch = null;
            }
        };
        GridsterEmptyCell.prototype.emptyCellClickCb = function (e) {
            if (this.gridster.movingItem || GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
                return;
            }
            var item = this.getValidItemFromEvent(e);
            if (!item) {
                return;
            }
            if (this.gridster.options.emptyCellClickCallback) {
                this.gridster.options.emptyCellClickCallback(e, item);
            }
            this.gridster.cdRef.markForCheck();
        };
        GridsterEmptyCell.prototype.emptyCellContextMenuCb = function (e) {
            if (this.gridster.movingItem || GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            var item = this.getValidItemFromEvent(e);
            if (!item) {
                return;
            }
            if (this.gridster.options.emptyCellContextMenuCallback) {
                this.gridster.options.emptyCellContextMenuCallback(e, item);
            }
            this.gridster.cdRef.markForCheck();
        };
        GridsterEmptyCell.prototype.emptyCellDragDrop = function (e) {
            var item = this.getValidItemFromEvent(e);
            if (!item) {
                return;
            }
            if (this.gridster.options.emptyCellDropCallback) {
                this.gridster.options.emptyCellDropCallback(e, item);
            }
            this.gridster.cdRef.markForCheck();
        };
        GridsterEmptyCell.prototype.emptyCellDragOver = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var item = this.getValidItemFromEvent(e);
            if (item) {
                e.dataTransfer.dropEffect = 'move';
                this.gridster.movingItem = item;
            }
            else {
                e.dataTransfer.dropEffect = 'none';
                this.gridster.movingItem = null;
            }
            this.gridster.previewStyle();
        };
        GridsterEmptyCell.prototype.emptyCellMouseDown = function (e) {
            var _this = this;
            if (GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            var item = this.getValidItemFromEvent(e);
            var leftMouseButtonCode = 1;
            if (!item || e.buttons !== leftMouseButtonCode) {
                return;
            }
            this.initialItem = item;
            this.gridster.movingItem = item;
            this.gridster.previewStyle();
            this.gridster.zone.runOutsideAngular(function () {
                _this.emptyCellMMove = _this.gridster.renderer.listen('window', 'mousemove', _this.emptyCellMouseMove.bind(_this));
                _this.emptyCellMMoveTouch = _this.gridster.renderer.listen('window', 'touchmove', _this.emptyCellMouseMove.bind(_this));
            });
            this.emptyCellUp = this.gridster.renderer.listen('window', 'mouseup', this.emptyCellMouseUp.bind(this));
            this.emptyCellUpTouch = this.gridster.renderer.listen('window', 'touchend', this.emptyCellMouseUp.bind(this));
        };
        GridsterEmptyCell.prototype.emptyCellMouseMove = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var item = this.getValidItemFromEvent(e, this.initialItem);
            if (!item) {
                return;
            }
            this.gridster.movingItem = item;
            this.gridster.previewStyle();
        };
        GridsterEmptyCell.prototype.emptyCellMouseUp = function (e) {
            var _this = this;
            this.emptyCellMMove();
            this.emptyCellMMoveTouch();
            this.emptyCellUp();
            this.emptyCellUpTouch();
            var item = this.getValidItemFromEvent(e, this.initialItem);
            if (item) {
                this.gridster.movingItem = item;
            }
            if (this.gridster.options.emptyCellDragCallback && this.gridster.movingItem) {
                this.gridster.options.emptyCellDragCallback(e, this.gridster.movingItem);
            }
            setTimeout(function () {
                _this.initialItem = null;
                if (_this.gridster) {
                    _this.gridster.movingItem = null;
                    _this.gridster.previewStyle();
                }
            });
            this.gridster.cdRef.markForCheck();
        };
        GridsterEmptyCell.prototype.getValidItemFromEvent = function (e, oldItem) {
            e.preventDefault();
            e.stopPropagation();
            GridsterUtils.checkTouchEvent(e);
            var rect = this.gridster.el.getBoundingClientRect();
            var x = e.clientX + this.gridster.el.scrollLeft - rect.left - this.gridster.gridRenderer.getLeftMargin();
            var y = e.clientY + this.gridster.el.scrollTop - rect.top - this.gridster.gridRenderer.getTopMargin();
            var item = {
                x: this.gridster.pixelsToPositionX(x, Math.floor, true),
                y: this.gridster.pixelsToPositionY(y, Math.floor, true),
                cols: this.gridster.$options.defaultItemCols,
                rows: this.gridster.$options.defaultItemRows
            };
            if (oldItem) {
                item.cols = Math.min(Math.abs(oldItem.x - item.x) + 1, this.gridster.$options.emptyCellDragMaxCols);
                item.rows = Math.min(Math.abs(oldItem.y - item.y) + 1, this.gridster.$options.emptyCellDragMaxRows);
                if (oldItem.x < item.x) {
                    item.x = oldItem.x;
                }
                else if (oldItem.x - item.x > this.gridster.$options.emptyCellDragMaxCols - 1) {
                    item.x = this.gridster.movingItem ? this.gridster.movingItem.x : 0;
                }
                if (oldItem.y < item.y) {
                    item.y = oldItem.y;
                }
                else if (oldItem.y - item.y > this.gridster.$options.emptyCellDragMaxRows - 1) {
                    item.y = this.gridster.movingItem ? this.gridster.movingItem.y : 0;
                }
            }
            if (!this.gridster.$options.enableOccupiedCellDrop && this.gridster.checkCollision(item)) {
                return;
            }
            return item;
        };
        GridsterEmptyCell.ctorParameters = function () { return [
            { type: GridsterComponentInterface }
        ]; };
        GridsterEmptyCell = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [GridsterComponentInterface])
        ], GridsterEmptyCell);
        return GridsterEmptyCell;
    }());

    var GridsterRenderer = /** @class */ (function () {
        function GridsterRenderer(gridster) {
            this.gridster = gridster;
        }
        GridsterRenderer.prototype.destroy = function () {
            delete this.gridster;
        };
        GridsterRenderer.prototype.updateItem = function (el, item, renderer) {
            if (this.gridster.mobile) {
                this.clearCellPosition(renderer, el);
                if (this.gridster.$options.keepFixedHeightInMobile) {
                    renderer.setStyle(el, 'height', (item.rows * this.gridster.$options.fixedRowHeight) + 'px');
                }
                else {
                    renderer.setStyle(el, 'height', (item.rows * this.gridster.curWidth / item.cols) + 'px');
                }
                if (this.gridster.$options.keepFixedWidthInMobile) {
                    renderer.setStyle(el, 'width', this.gridster.$options.fixedColWidth + 'px');
                }
                else {
                    renderer.setStyle(el, 'width', '');
                }
                renderer.setStyle(el, 'margin-bottom', this.gridster.$options.margin + 'px');
                renderer.setStyle(el, 'margin-right', '');
            }
            else {
                var x = Math.round(this.gridster.curColWidth * item.x);
                var y = Math.round(this.gridster.curRowHeight * item.y);
                var width = this.gridster.curColWidth * item.cols - this.gridster.$options.margin;
                var height = (this.gridster.curRowHeight * item.rows - this.gridster.$options.margin);
                // set the cell style
                this.setCellPosition(renderer, el, x, y);
                renderer.setStyle(el, 'width', width + 'px');
                renderer.setStyle(el, 'height', height + 'px');
                var marginBottom = null;
                var marginRight = null;
                if (this.gridster.$options.outerMargin) {
                    if (this.gridster.rows === item.rows + item.y) {
                        if (this.gridster.$options.outerMarginBottom !== null) {
                            marginBottom = this.gridster.$options.outerMarginBottom + 'px';
                        }
                        else {
                            marginBottom = this.gridster.$options.margin + 'px';
                        }
                    }
                    if (this.gridster.columns === item.cols + item.x) {
                        if (this.gridster.$options.outerMarginBottom !== null) {
                            marginRight = this.gridster.$options.outerMarginRight + 'px';
                        }
                        else {
                            marginRight = this.gridster.$options.margin + 'px';
                        }
                    }
                }
                renderer.setStyle(el, 'margin-bottom', marginBottom);
                renderer.setStyle(el, 'margin-right', marginRight);
            }
        };
        GridsterRenderer.prototype.updateGridster = function () {
            var addClass = '';
            var removeClass1 = '';
            var removeClass2 = '';
            var removeClass3 = '';
            if (this.gridster.$options.gridType === exports.GridType.Fit) {
                addClass = exports.GridType.Fit;
                removeClass1 = exports.GridType.ScrollVertical;
                removeClass2 = exports.GridType.ScrollHorizontal;
                removeClass3 = exports.GridType.Fixed;
            }
            else if (this.gridster.$options.gridType === exports.GridType.ScrollVertical) {
                this.gridster.curRowHeight = this.gridster.curColWidth;
                addClass = exports.GridType.ScrollVertical;
                removeClass1 = exports.GridType.Fit;
                removeClass2 = exports.GridType.ScrollHorizontal;
                removeClass3 = exports.GridType.Fixed;
            }
            else if (this.gridster.$options.gridType === exports.GridType.ScrollHorizontal) {
                this.gridster.curColWidth = this.gridster.curRowHeight;
                addClass = exports.GridType.ScrollHorizontal;
                removeClass1 = exports.GridType.Fit;
                removeClass2 = exports.GridType.ScrollVertical;
                removeClass3 = exports.GridType.Fixed;
            }
            else if (this.gridster.$options.gridType === exports.GridType.Fixed) {
                this.gridster.curColWidth = this.gridster.$options.fixedColWidth +
                    (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
                this.gridster.curRowHeight = this.gridster.$options.fixedRowHeight +
                    (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
                addClass = exports.GridType.Fixed;
                removeClass1 = exports.GridType.Fit;
                removeClass2 = exports.GridType.ScrollVertical;
                removeClass3 = exports.GridType.ScrollHorizontal;
            }
            else if (this.gridster.$options.gridType === exports.GridType.VerticalFixed) {
                this.gridster.curRowHeight = this.gridster.$options.fixedRowHeight +
                    (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
                addClass = exports.GridType.ScrollVertical;
                removeClass1 = exports.GridType.Fit;
                removeClass2 = exports.GridType.ScrollHorizontal;
                removeClass3 = exports.GridType.Fixed;
            }
            else if (this.gridster.$options.gridType === exports.GridType.HorizontalFixed) {
                this.gridster.curColWidth = this.gridster.$options.fixedColWidth +
                    (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
                addClass = exports.GridType.ScrollHorizontal;
                removeClass1 = exports.GridType.Fit;
                removeClass2 = exports.GridType.ScrollVertical;
                removeClass3 = exports.GridType.Fixed;
            }
            if (this.gridster.mobile) {
                this.gridster.renderer.removeClass(this.gridster.el, addClass);
            }
            else {
                this.gridster.renderer.addClass(this.gridster.el, addClass);
            }
            this.gridster.renderer.removeClass(this.gridster.el, removeClass1);
            this.gridster.renderer.removeClass(this.gridster.el, removeClass2);
            this.gridster.renderer.removeClass(this.gridster.el, removeClass3);
        };
        GridsterRenderer.prototype.getGridColumnStyle = function (i) {
            return __assign(__assign({}, this.getLeftPosition(this.gridster.curColWidth * i)), { width: this.gridster.curColWidth - this.gridster.$options.margin + 'px', height: this.gridster.gridRows.length * this.gridster.curRowHeight - this.gridster.$options.margin + 'px' });
        };
        GridsterRenderer.prototype.getGridRowStyle = function (i) {
            return __assign(__assign({}, this.getTopPosition(this.gridster.curRowHeight * i)), { width: this.gridster.gridColumns.length * this.gridster.curColWidth - this.gridster.$options.margin + 'px', height: this.gridster.curRowHeight - this.gridster.$options.margin + 'px' });
        };
        GridsterRenderer.prototype.getLeftPosition = function (d) {
            var dPosition = this.gridster.$options.dirType === exports.DirTypes.RTL ? -d : d;
            if (this.gridster.$options.useTransformPositioning) {
                return {
                    transform: 'translateX(' + dPosition + 'px)',
                };
            }
            else {
                return {
                    left: (this.getLeftMargin() + dPosition) + 'px'
                };
            }
        };
        GridsterRenderer.prototype.getTopPosition = function (d) {
            if (this.gridster.$options.useTransformPositioning) {
                return {
                    transform: 'translateY(' + d + 'px)',
                };
            }
            else {
                return {
                    top: this.getTopMargin() + d + 'px'
                };
            }
        };
        GridsterRenderer.prototype.clearCellPosition = function (renderer, el) {
            if (this.gridster.$options.useTransformPositioning) {
                renderer.setStyle(el, 'transform', '');
            }
            else {
                renderer.setStyle(el, 'top', '');
                renderer.setStyle(el, 'left', '');
            }
        };
        GridsterRenderer.prototype.setCellPosition = function (renderer, el, x, y) {
            var xPosition = this.gridster.$options.dirType === exports.DirTypes.RTL ? -x : x;
            if (this.gridster.$options.useTransformPositioning) {
                var transform = 'translate3d(' + xPosition + 'px, ' + y + 'px, 0)';
                renderer.setStyle(el, 'transform', transform);
            }
            else {
                renderer.setStyle(el, 'left', this.getLeftMargin() + xPosition + 'px');
                renderer.setStyle(el, 'top', this.getTopMargin() + y + 'px');
            }
        };
        GridsterRenderer.prototype.getLeftMargin = function () {
            if (this.gridster.$options.outerMargin) {
                if (this.gridster.$options.outerMarginLeft !== null) {
                    return this.gridster.$options.outerMarginLeft;
                }
                else {
                    return this.gridster.$options.margin;
                }
            }
            else {
                return 0;
            }
        };
        GridsterRenderer.prototype.getTopMargin = function () {
            if (this.gridster.$options.outerMargin) {
                if (this.gridster.$options.outerMarginTop !== null) {
                    return this.gridster.$options.outerMarginTop;
                }
                else {
                    return this.gridster.$options.margin;
                }
            }
            else {
                return 0;
            }
        };
        GridsterRenderer.ctorParameters = function () { return [
            { type: GridsterComponentInterface }
        ]; };
        GridsterRenderer = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [GridsterComponentInterface])
        ], GridsterRenderer);
        return GridsterRenderer;
    }());

    var GridsterComponent = /** @class */ (function () {
        function GridsterComponent(el, renderer, cdRef, zone) {
            this.renderer = renderer;
            this.cdRef = cdRef;
            this.zone = zone;
            this.columns = 0;
            this.rows = 0;
            this.gridColumns = [];
            this.gridRows = [];
            this.el = el.nativeElement;
            this.$options = JSON.parse(JSON.stringify(GridsterConfigService));
            this.calculateLayoutDebounce = GridsterUtils.debounce(this.calculateLayout.bind(this), 0);
            this.mobile = false;
            this.curWidth = 0;
            this.curHeight = 0;
            this.grid = [];
            this.curColWidth = 0;
            this.curRowHeight = 0;
            this.dragInProgress = false;
            this.emptyCell = new GridsterEmptyCell(this);
            this.compact = new GridsterCompact(this);
            this.gridRenderer = new GridsterRenderer(this);
        }
        GridsterComponent_1 = GridsterComponent;
        GridsterComponent.prototype.checkCollisionTwoItems = function (item, item2) {
            var collision = item.x < item2.x + item2.cols
                && item.x + item.cols > item2.x
                && item.y < item2.y + item2.rows
                && item.y + item.rows > item2.y;
            if (!collision) {
                return false;
            }
            if (!this.$options.allowMultiLayer) {
                return true;
            }
            var defaultLayerIndex = this.$options.defaultLayerIndex;
            var layerIndex = item.layerIndex === undefined ? defaultLayerIndex : item.layerIndex;
            var layerIndex2 = item2.layerIndex === undefined ? defaultLayerIndex : item2.layerIndex;
            return layerIndex === layerIndex2;
        };
        GridsterComponent.prototype.ngOnInit = function () {
            if (this.options.initCallback) {
                this.options.initCallback(this);
            }
        };
        GridsterComponent.prototype.ngOnChanges = function (changes) {
            if (changes.options) {
                this.setOptions();
                this.options.api = {
                    optionsChanged: this.optionsChanged.bind(this),
                    resize: this.onResize.bind(this),
                    getNextPossiblePosition: this.getNextPossiblePosition.bind(this),
                    getFirstPossiblePosition: this.getFirstPossiblePosition.bind(this),
                    getLastPossiblePosition: this.getLastPossiblePosition.bind(this),
                };
                this.columns = this.$options.minCols;
                this.rows = this.$options.minRows;
                this.setGridSize();
                this.calculateLayout();
            }
        };
        GridsterComponent.prototype.resize = function () {
            var height;
            var width;
            if (this.$options.gridType === 'fit' && !this.mobile) {
                width = this.el.offsetWidth;
                height = this.el.offsetHeight;
            }
            else {
                width = this.el.clientWidth;
                height = this.el.clientHeight;
            }
            if ((width !== this.curWidth || height !== this.curHeight) && this.checkIfToResize()) {
                this.onResize();
            }
        };
        GridsterComponent.prototype.setOptions = function () {
            this.$options = GridsterUtils.merge(this.$options, this.options, this.$options);
            if (!this.$options.disableWindowResize && !this.windowResize) {
                this.windowResize = this.renderer.listen('window', 'resize', this.onResize.bind(this));
            }
            else if (this.$options.disableWindowResize && this.windowResize) {
                this.windowResize();
                this.windowResize = null;
            }
            this.emptyCell.updateOptions();
        };
        GridsterComponent.prototype.optionsChanged = function () {
            this.setOptions();
            var widgetsIndex = this.grid.length - 1;
            var widget;
            for (; widgetsIndex >= 0; widgetsIndex--) {
                widget = this.grid[widgetsIndex];
                widget.updateOptions();
            }
            this.calculateLayout();
        };
        GridsterComponent.prototype.ngOnDestroy = function () {
            if (this.windowResize) {
                this.windowResize();
            }
            if (this.options && this.options.destroyCallback) {
                this.options.destroyCallback(this);
            }
            if (this.options && this.options.api) {
                this.options.api.resize = undefined;
                this.options.api.optionsChanged = undefined;
                this.options.api.getNextPossiblePosition = undefined;
                this.options.api = undefined;
            }
            this.emptyCell.destroy();
            delete this.emptyCell;
            this.compact.destroy();
            delete this.compact;
        };
        GridsterComponent.prototype.onResize = function () {
            this.setGridSize();
            this.calculateLayout();
        };
        GridsterComponent.prototype.checkIfToResize = function () {
            var clientWidth = this.el.clientWidth;
            var offsetWidth = this.el.offsetWidth;
            var scrollWidth = this.el.scrollWidth;
            var clientHeight = this.el.clientHeight;
            var offsetHeight = this.el.offsetHeight;
            var scrollHeight = this.el.scrollHeight;
            var verticalScrollPresent = clientWidth < offsetWidth && scrollHeight > offsetHeight
                && scrollHeight - offsetHeight < offsetWidth - clientWidth;
            var horizontalScrollPresent = clientHeight < offsetHeight
                && scrollWidth > offsetWidth && scrollWidth - offsetWidth < offsetHeight - clientHeight;
            if (verticalScrollPresent) {
                return false;
            }
            return !horizontalScrollPresent;
        };
        GridsterComponent.prototype.setGridSize = function () {
            var el = this.el;
            var width;
            var height;
            if (this.$options.setGridSize || this.$options.gridType === 'fit' && !this.mobile) {
                width = el.offsetWidth;
                height = el.offsetHeight;
            }
            else {
                width = el.clientWidth;
                height = el.clientHeight;
            }
            this.curWidth = width;
            this.curHeight = height;
        };
        GridsterComponent.prototype.setGridDimensions = function () {
            this.setGridSize();
            if (!this.mobile && this.$options.mobileBreakpoint > this.curWidth) {
                this.mobile = !this.mobile;
                this.renderer.addClass(this.el, 'mobile');
            }
            else if (this.mobile && this.$options.mobileBreakpoint < this.curWidth) {
                this.mobile = !this.mobile;
                this.renderer.removeClass(this.el, 'mobile');
            }
            var rows = this.$options.minRows;
            var columns = this.$options.minCols;
            var widgetsIndex = this.grid.length - 1;
            var widget;
            for (; widgetsIndex >= 0; widgetsIndex--) {
                widget = this.grid[widgetsIndex];
                if (!widget.notPlaced) {
                    rows = Math.max(rows, widget.$item.y + widget.$item.rows);
                    columns = Math.max(columns, widget.$item.x + widget.$item.cols);
                }
            }
            if (this.columns !== columns || this.rows !== rows) {
                this.columns = columns;
                this.rows = rows;
                if (this.options.gridSizeChangedCallback) {
                    this.options.gridSizeChangedCallback(this);
                }
            }
        };
        GridsterComponent.prototype.calculateLayout = function () {
            if (this.compact) {
                this.compact.checkCompact();
            }
            this.setGridDimensions();
            if (this.$options.outerMargin) {
                var marginWidth = -this.$options.margin;
                if (this.$options.outerMarginLeft !== null) {
                    marginWidth += this.$options.outerMarginLeft;
                    this.renderer.setStyle(this.el, 'padding-left', this.$options.outerMarginLeft + 'px');
                }
                else {
                    marginWidth += this.$options.margin;
                    this.renderer.setStyle(this.el, 'padding-left', this.$options.margin + 'px');
                }
                if (this.$options.outerMarginRight !== null) {
                    marginWidth += this.$options.outerMarginRight;
                    this.renderer.setStyle(this.el, 'padding-right', this.$options.outerMarginRight + 'px');
                }
                else {
                    marginWidth += this.$options.margin;
                    this.renderer.setStyle(this.el, 'padding-right', this.$options.margin + 'px');
                }
                this.curColWidth = (this.curWidth - marginWidth) / this.columns;
                var marginHeight = -this.$options.margin;
                if (this.$options.outerMarginTop !== null) {
                    marginHeight += this.$options.outerMarginTop;
                    this.renderer.setStyle(this.el, 'padding-top', this.$options.outerMarginTop + 'px');
                }
                else {
                    marginHeight += this.$options.margin;
                    this.renderer.setStyle(this.el, 'padding-top', this.$options.margin + 'px');
                }
                if (this.$options.outerMarginBottom !== null) {
                    marginHeight += this.$options.outerMarginBottom;
                    this.renderer.setStyle(this.el, 'padding-bottom', this.$options.outerMarginBottom + 'px');
                }
                else {
                    marginHeight += this.$options.margin;
                    this.renderer.setStyle(this.el, 'padding-bottom', this.$options.margin + 'px');
                }
                this.curRowHeight = (this.curHeight - marginHeight) / this.rows;
            }
            else {
                this.curColWidth = (this.curWidth + this.$options.margin) / this.columns;
                this.curRowHeight = (this.curHeight + this.$options.margin) / this.rows;
                this.renderer.setStyle(this.el, 'padding-left', 0 + 'px');
                this.renderer.setStyle(this.el, 'padding-right', 0 + 'px');
                this.renderer.setStyle(this.el, 'padding-top', 0 + 'px');
                this.renderer.setStyle(this.el, 'padding-bottom', 0 + 'px');
            }
            this.gridRenderer.updateGridster();
            this.updateGrid();
            if (this.$options.setGridSize) {
                this.renderer.setStyle(this.el, 'width', (this.columns * this.curColWidth + this.$options.margin) + 'px');
                this.renderer.setStyle(this.el, 'height', (this.rows * this.curRowHeight + this.$options.margin) + 'px');
            }
            else {
                this.renderer.setStyle(this.el, 'width', '');
                this.renderer.setStyle(this.el, 'height', '');
            }
            var widgetsIndex = this.grid.length - 1;
            var widget;
            for (; widgetsIndex >= 0; widgetsIndex--) {
                widget = this.grid[widgetsIndex];
                widget.setSize();
                widget.drag.toggle();
                widget.resize.toggle();
            }
            setTimeout(this.resize.bind(this), 100);
        };
        GridsterComponent.prototype.updateGrid = function () {
            if (this.$options.displayGrid === 'always' && !this.mobile) {
                this.renderer.addClass(this.el, 'display-grid');
            }
            else if (this.$options.displayGrid === 'onDrag&Resize' && this.dragInProgress) {
                this.renderer.addClass(this.el, 'display-grid');
            }
            else if (this.$options.displayGrid === 'none' || !this.dragInProgress || this.mobile) {
                this.renderer.removeClass(this.el, 'display-grid');
            }
            this.setGridDimensions();
            this.gridColumns.length = GridsterComponent_1.getNewArrayLength(this.columns, this.curWidth, this.curColWidth);
            this.gridRows.length = GridsterComponent_1.getNewArrayLength(this.rows, this.curHeight, this.curRowHeight);
            this.cdRef.markForCheck();
        };
        GridsterComponent.prototype.addItem = function (itemComponent) {
            if (itemComponent.$item.cols === undefined) {
                itemComponent.$item.cols = this.$options.defaultItemCols;
                itemComponent.item.cols = itemComponent.$item.cols;
                itemComponent.itemChanged();
            }
            if (itemComponent.$item.rows === undefined) {
                itemComponent.$item.rows = this.$options.defaultItemRows;
                itemComponent.item.rows = itemComponent.$item.rows;
                itemComponent.itemChanged();
            }
            if (itemComponent.$item.x === -1 || itemComponent.$item.y === -1) {
                this.autoPositionItem(itemComponent);
            }
            else if (this.checkCollision(itemComponent.$item)) {
                if (!this.$options.disableWarnings) {
                    itemComponent.notPlaced = true;
                    console.warn('Can\'t be placed in the bounds of the dashboard, trying to auto position!/n' +
                        JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
                }
                if (!this.$options.disableAutoPositionOnConflict) {
                    this.autoPositionItem(itemComponent);
                }
                else {
                    itemComponent.notPlaced = true;
                }
            }
            this.grid.push(itemComponent);
            this.calculateLayoutDebounce();
        };
        GridsterComponent.prototype.removeItem = function (itemComponent) {
            this.grid.splice(this.grid.indexOf(itemComponent), 1);
            this.calculateLayoutDebounce();
            if (this.options.itemRemovedCallback) {
                this.options.itemRemovedCallback(itemComponent.item, itemComponent);
            }
        };
        GridsterComponent.prototype.checkCollision = function (item) {
            var collision = false;
            if (this.options.itemValidateCallback) {
                collision = !this.options.itemValidateCallback(item);
            }
            if (!collision && this.checkGridCollision(item)) {
                collision = true;
            }
            if (!collision) {
                var c = this.findItemWithItem(item);
                if (c) {
                    collision = c;
                }
            }
            return collision;
        };
        GridsterComponent.prototype.checkGridCollision = function (item) {
            var noNegativePosition = item.y > -1 && item.x > -1;
            var maxGridCols = item.cols + item.x <= this.$options.maxCols;
            var maxGridRows = item.rows + item.y <= this.$options.maxRows;
            var maxItemCols = item.maxItemCols === undefined ? this.$options.maxItemCols : item.maxItemCols;
            var minItemCols = item.minItemCols === undefined ? this.$options.minItemCols : item.minItemCols;
            var maxItemRows = item.maxItemRows === undefined ? this.$options.maxItemRows : item.maxItemRows;
            var minItemRows = item.minItemRows === undefined ? this.$options.minItemRows : item.minItemRows;
            var inColsLimits = item.cols <= maxItemCols && item.cols >= minItemCols;
            var inRowsLimits = item.rows <= maxItemRows && item.rows >= minItemRows;
            var minAreaLimit = item.minItemArea === undefined ? this.$options.minItemArea : item.minItemArea;
            var maxAreaLimit = item.maxItemArea === undefined ? this.$options.maxItemArea : item.maxItemArea;
            var area = item.cols * item.rows;
            var inMinArea = minAreaLimit <= area;
            var inMaxArea = maxAreaLimit >= area;
            return !(noNegativePosition && maxGridCols && maxGridRows && inColsLimits && inRowsLimits && inMinArea && inMaxArea);
        };
        GridsterComponent.prototype.findItemWithItem = function (item) {
            var widgetsIndex = this.grid.length - 1;
            var widget;
            for (; widgetsIndex > -1; widgetsIndex--) {
                widget = this.grid[widgetsIndex];
                if (widget.$item !== item && this.checkCollisionTwoItems(widget.$item, item)) {
                    return widget;
                }
            }
            return false;
        };
        GridsterComponent.prototype.findItemsWithItem = function (item) {
            var a = [];
            var widgetsIndex = this.grid.length - 1;
            var widget;
            for (; widgetsIndex > -1; widgetsIndex--) {
                widget = this.grid[widgetsIndex];
                if (widget.$item !== item && this.checkCollisionTwoItems(widget.$item, item)) {
                    a.push(widget);
                }
            }
            return a;
        };
        GridsterComponent.prototype.autoPositionItem = function (itemComponent) {
            if (this.getNextPossiblePosition(itemComponent.$item)) {
                itemComponent.notPlaced = false;
                itemComponent.item.x = itemComponent.$item.x;
                itemComponent.item.y = itemComponent.$item.y;
                itemComponent.itemChanged();
            }
            else {
                itemComponent.notPlaced = true;
                if (!this.$options.disableWarnings) {
                    console.warn('Can\'t be placed in the bounds of the dashboard!/n' +
                        JSON.stringify(itemComponent.item, ['cols', 'rows', 'x', 'y']));
                }
            }
        };
        GridsterComponent.prototype.getNextPossiblePosition = function (newItem, startingFrom) {
            if (startingFrom === void 0) { startingFrom = {}; }
            if (newItem.cols === -1) {
                newItem.cols = this.$options.defaultItemCols;
            }
            if (newItem.rows === -1) {
                newItem.rows = this.$options.defaultItemRows;
            }
            this.setGridDimensions();
            var rowsIndex = startingFrom.y || 0;
            var colsIndex;
            for (; rowsIndex < this.rows; rowsIndex++) {
                newItem.y = rowsIndex;
                colsIndex = startingFrom.x || 0;
                for (; colsIndex < this.columns; colsIndex++) {
                    newItem.x = colsIndex;
                    if (!this.checkCollision(newItem)) {
                        return true;
                    }
                }
            }
            var canAddToRows = this.$options.maxRows >= this.rows + newItem.rows;
            var canAddToColumns = this.$options.maxCols >= this.columns + newItem.cols;
            var addToRows = this.rows <= this.columns && canAddToRows;
            if (!addToRows && canAddToColumns) {
                newItem.x = this.columns;
                newItem.y = 0;
                return true;
            }
            else if (canAddToRows) {
                newItem.y = this.rows;
                newItem.x = 0;
                return true;
            }
            return false;
        };
        GridsterComponent.prototype.getFirstPossiblePosition = function (item) {
            var tmpItem = Object.assign({}, item);
            this.getNextPossiblePosition(tmpItem);
            return tmpItem;
        };
        GridsterComponent.prototype.getLastPossiblePosition = function (item) {
            var farthestItem = { y: 0, x: 0 };
            farthestItem = this.grid.reduce(function (prev, curr) {
                var currCoords = { y: curr.$item.y + curr.$item.rows - 1, x: curr.$item.x + curr.$item.cols - 1 };
                if (GridsterUtils.compareItems(prev, currCoords) === 1) {
                    return currCoords;
                }
                else {
                    return prev;
                }
            }, farthestItem);
            var tmpItem = Object.assign({}, item);
            this.getNextPossiblePosition(tmpItem, farthestItem);
            return tmpItem;
        };
        GridsterComponent.prototype.pixelsToPositionX = function (x, roundingMethod, noLimit) {
            var position = roundingMethod(x / this.curColWidth);
            if (noLimit) {
                return position;
            }
            else {
                return Math.max(position, 0);
            }
        };
        GridsterComponent.prototype.pixelsToPositionY = function (y, roundingMethod, noLimit) {
            var position = roundingMethod(y / this.curRowHeight);
            if (noLimit) {
                return position;
            }
            else {
                return Math.max(position, 0);
            }
        };
        GridsterComponent.prototype.positionXToPixels = function (x) {
            return x * this.curColWidth;
        };
        GridsterComponent.prototype.positionYToPixels = function (y) {
            return y * this.curRowHeight;
        };
        // ------ Functions for swapWhileDragging option
        // identical to checkCollision() except that here we add bondaries.
        GridsterComponent.checkCollisionTwoItemsForSwaping = function (item, item2) {
            // if the cols or rows of the items are 1 , doesnt make any sense to set a boundary. Only if the item is bigger we set a boundary
            var horizontalBoundaryItem1 = item.cols === 1 ? 0 : 1;
            var horizontalBoundaryItem2 = item2.cols === 1 ? 0 : 1;
            var verticalBoundaryItem1 = item.rows === 1 ? 0 : 1;
            var verticalBoundaryItem2 = item2.rows === 1 ? 0 : 1;
            return item.x + horizontalBoundaryItem1 < item2.x + item2.cols
                && item.x + item.cols > item2.x + horizontalBoundaryItem2
                && item.y + verticalBoundaryItem1 < item2.y + item2.rows
                && item.y + item.rows > item2.y + verticalBoundaryItem2;
        };
        // identical to checkCollision() except that this function calls findItemWithItemForSwaping() instead of findItemWithItem()
        GridsterComponent.prototype.checkCollisionForSwaping = function (item) {
            var collision = false;
            if (this.options.itemValidateCallback) {
                collision = !this.options.itemValidateCallback(item);
            }
            if (!collision && this.checkGridCollision(item)) {
                collision = true;
            }
            if (!collision) {
                var c = this.findItemWithItemForSwaping(item);
                if (c) {
                    collision = c;
                }
            }
            return collision;
        };
        // identical to findItemWithItem() except that this function calls checkCollisionTwoItemsForSwaping() instead of checkCollisionTwoItems()
        GridsterComponent.prototype.findItemWithItemForSwaping = function (item) {
            var widgetsIndex = this.grid.length - 1;
            var widget;
            for (; widgetsIndex > -1; widgetsIndex--) {
                widget = this.grid[widgetsIndex];
                if (widget.$item !== item && GridsterComponent_1.checkCollisionTwoItemsForSwaping(widget.$item, item)) {
                    return widget;
                }
            }
            return false;
        };
        // ------ End of functions for swapWhileDragging option
        // tslint:disable-next-line:member-ordering
        GridsterComponent.getNewArrayLength = function (length, overallSize, size) {
            var newLength = Math.max(length, Math.floor(overallSize / size));
            if (newLength < 0) {
                return 0;
            }
            if (Number.isFinite(newLength)) {
                return Math.floor(newLength);
            }
            return 0;
        };
        var GridsterComponent_1;
        GridsterComponent.ctorParameters = function () { return [
            { type: core.ElementRef, decorators: [{ type: core.Inject, args: [core.ElementRef,] }] },
            { type: core.Renderer2, decorators: [{ type: core.Inject, args: [core.Renderer2,] }] },
            { type: core.ChangeDetectorRef, decorators: [{ type: core.Inject, args: [core.ChangeDetectorRef,] }] },
            { type: core.NgZone, decorators: [{ type: core.Inject, args: [core.NgZone,] }] }
        ]; };
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], GridsterComponent.prototype, "options", void 0);
        GridsterComponent = GridsterComponent_1 = __decorate([
            core.Component({
                selector: 'gridster',
                template: "<div class=\"gridster-column\" *ngFor=\"let column of gridColumns; let i = index;\"\n     [ngStyle]=\"gridRenderer.getGridColumnStyle(i)\"></div>\n<div class=\"gridster-row\" *ngFor=\"let row of gridRows; let i = index;\"\n     [ngStyle]=\"gridRenderer.getGridRowStyle(i)\"></div>\n<ng-content></ng-content>\n<gridster-preview class=\"gridster-preview\"></gridster-preview>\n",
                encapsulation: core.ViewEncapsulation.None,
                styles: ["gridster{position:relative;box-sizing:border-box;background:grey;width:100%;height:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:block}gridster.fit{overflow-x:hidden;overflow-y:hidden}gridster.scrollVertical{overflow-x:hidden;overflow-y:auto}gridster.scrollHorizontal{overflow-x:auto;overflow-y:hidden}gridster.fixed{overflow:auto}gridster.mobile{overflow-x:hidden;overflow-y:auto}gridster.mobile gridster-item{position:relative}gridster .gridster-column,gridster .gridster-row{position:absolute;display:none;transition:.3s;box-sizing:border-box}gridster.display-grid .gridster-column,gridster.display-grid .gridster-row{display:block}gridster .gridster-column{border-left:1px solid #fff;border-right:1px solid #fff}gridster .gridster-row{border-top:1px solid #fff;border-bottom:1px solid #fff}"]
            }),
            __param(0, core.Inject(core.ElementRef)), __param(1, core.Inject(core.Renderer2)),
            __param(2, core.Inject(core.ChangeDetectorRef)),
            __param(3, core.Inject(core.NgZone)),
            __metadata("design:paramtypes", [core.ElementRef, core.Renderer2,
                core.ChangeDetectorRef,
                core.NgZone])
        ], GridsterComponent);
        return GridsterComponent;
    }());

    var GridsterItemComponentInterface = /** @class */ (function () {
        function GridsterItemComponentInterface() {
        }
        return GridsterItemComponentInterface;
    }());

    var GridsterPush = /** @class */ (function () {
        function GridsterPush(gridsterItem) {
            this.pushedItems = [];
            this.pushedItemsTemp = [];
            this.pushedItemsTempPath = [];
            this.pushedItemsPath = [];
            gridsterItem['id'] = this.generateTempRandomId();
            this.gridsterItem = gridsterItem;
            this.gridster = gridsterItem.gridster;
            this.tryPattern = {
                fromEast: [this.tryWest, this.trySouth, this.tryNorth, this.tryEast],
                fromWest: [this.tryEast, this.trySouth, this.tryNorth, this.tryWest],
                fromNorth: [this.trySouth, this.tryEast, this.tryWest, this.tryNorth],
                fromSouth: [this.tryNorth, this.tryEast, this.tryWest, this.trySouth]
            };
            this.fromSouth = 'fromSouth';
            this.fromNorth = 'fromNorth';
            this.fromEast = 'fromEast';
            this.fromWest = 'fromWest';
        }
        GridsterPush.prototype.destroy = function () {
            delete this.gridster;
            delete this.gridsterItem;
        };
        GridsterPush.prototype.pushItems = function (direction, disable) {
            if (this.gridster.$options.pushItems && !disable) {
                this.pushedItemsOrder = [];
                var pushed = this.push(this.gridsterItem, direction);
                if (!pushed) {
                    this.restoreTempItems();
                }
                this.pushedItemsOrder = [];
                this.pushedItemsTemp = [];
                this.pushedItemsTempPath = [];
                this.cleanTempIds();
                return pushed;
            }
            else {
                return false;
            }
        };
        GridsterPush.prototype.restoreTempItems = function () {
            var i = this.pushedItemsTemp.length - 1;
            for (; i > -1; i--) {
                this.removeFromTempPushed(this.pushedItemsTemp[i]);
            }
        };
        GridsterPush.prototype.restoreItems = function () {
            var i = 0;
            var l = this.pushedItems.length;
            var pushedItem;
            for (; i < l; i++) {
                pushedItem = this.pushedItems[i];
                pushedItem.$item.x = pushedItem.item.x || 0;
                pushedItem.$item.y = pushedItem.item.y || 0;
                pushedItem.setSize();
            }
            this.pushedItems = [];
            this.pushedItemsPath = [];
        };
        GridsterPush.prototype.setPushedItems = function () {
            var i = 0;
            var l = this.pushedItems.length;
            var pushedItem;
            for (; i < l; i++) {
                pushedItem = this.pushedItems[i];
                pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
            }
            this.pushedItems = [];
            this.pushedItemsPath = [];
        };
        GridsterPush.prototype.checkPushBack = function () {
            var i = this.pushedItems.length - 1;
            var change = false;
            for (; i > -1; i--) {
                if (this.checkPushedItem(this.pushedItems[i], i)) {
                    change = true;
                }
            }
            if (change) {
                this.checkPushBack();
            }
        };
        GridsterPush.prototype.generateTempRandomId = function () {
            return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
        };
        GridsterPush.prototype.cleanTempIds = function () {
            var allItemsWithIds = this.gridster.grid.filter(function (el) { return el['id']; });
            allItemsWithIds.forEach(function (el) { return delete el['id']; });
        };
        GridsterPush.prototype.push = function (gridsterItem, direction) {
            if (this.gridster.checkGridCollision(gridsterItem.$item)) {
                return false;
            }
            if (direction === '') {
                return false;
            }
            var a = this.gridster.findItemsWithItem(gridsterItem.$item);
            var i = a.length - 1, itemCollision;
            var makePush = true;
            var b = [];
            for (; i > -1; i--) {
                itemCollision = a[i];
                if (!itemCollision['id']) {
                    itemCollision['id'] = this.generateTempRandomId();
                }
                if (itemCollision === this.gridsterItem) {
                    makePush = false;
                    break;
                }
                if (!itemCollision.canBeDragged()) {
                    makePush = false;
                    break;
                }
                var compare = this.pushedItemsTemp.find(function (el) {
                    return el['id'] === itemCollision['id'];
                });
                if (compare) {
                    makePush = false;
                    break;
                }
                if (this.tryPattern[direction][0].call(this, itemCollision, gridsterItem)) {
                    this.pushedItemsOrder.push(itemCollision);
                    b.push(itemCollision);
                }
                else if (this.tryPattern[direction][1].call(this, itemCollision, gridsterItem)) {
                    this.pushedItemsOrder.push(itemCollision);
                    b.push(itemCollision);
                }
                else if (this.tryPattern[direction][2].call(this, itemCollision, gridsterItem)) {
                    this.pushedItemsOrder.push(itemCollision);
                    b.push(itemCollision);
                }
                else if (this.tryPattern[direction][3].call(this, itemCollision, gridsterItem)) {
                    this.pushedItemsOrder.push(itemCollision);
                    b.push(itemCollision);
                }
                else {
                    makePush = false;
                    break;
                }
            }
            if (!makePush) {
                i = this.pushedItemsOrder.lastIndexOf(b[0]);
                if (i > -1) {
                    var j = this.pushedItemsOrder.length - 1;
                    for (; j >= i; j--) {
                        itemCollision = this.pushedItemsOrder[j];
                        this.pushedItemsOrder.pop();
                        this.removeFromTempPushed(itemCollision);
                        this.removeFromPushedItem(itemCollision);
                    }
                }
            }
            return makePush;
        };
        GridsterPush.prototype.trySouth = function (gridsterItemCollide, gridsterItem) {
            if (!this.gridster.$options.pushDirections.south) {
                return false;
            }
            this.addToTempPushed(gridsterItemCollide);
            gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
            if (this.push(gridsterItemCollide, this.fromNorth)) {
                gridsterItemCollide.setSize();
                this.addToPushed(gridsterItemCollide);
                return true;
            }
            else {
                this.removeFromTempPushed(gridsterItemCollide);
            }
            return false;
        };
        GridsterPush.prototype.tryNorth = function (gridsterItemCollide, gridsterItem) {
            if (!this.gridster.$options.pushDirections.north) {
                return false;
            }
            this.addToTempPushed(gridsterItemCollide);
            gridsterItemCollide.$item.y = gridsterItem.$item.y - gridsterItemCollide.$item.rows;
            if (this.push(gridsterItemCollide, this.fromSouth)) {
                gridsterItemCollide.setSize();
                this.addToPushed(gridsterItemCollide);
                return true;
            }
            else {
                this.removeFromTempPushed(gridsterItemCollide);
            }
            return false;
        };
        GridsterPush.prototype.tryEast = function (gridsterItemCollide, gridsterItem) {
            if (!this.gridster.$options.pushDirections.east) {
                return false;
            }
            this.addToTempPushed(gridsterItemCollide);
            gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
            if (this.push(gridsterItemCollide, this.fromWest)) {
                gridsterItemCollide.setSize();
                this.addToPushed(gridsterItemCollide);
                return true;
            }
            else {
                this.removeFromTempPushed(gridsterItemCollide);
            }
            return false;
        };
        GridsterPush.prototype.tryWest = function (gridsterItemCollide, gridsterItem) {
            if (!this.gridster.$options.pushDirections.west) {
                return false;
            }
            this.addToTempPushed(gridsterItemCollide);
            gridsterItemCollide.$item.x = gridsterItem.$item.x - gridsterItemCollide.$item.cols;
            if (this.push(gridsterItemCollide, this.fromEast)) {
                gridsterItemCollide.setSize();
                this.addToPushed(gridsterItemCollide);
                return true;
            }
            else {
                this.removeFromTempPushed(gridsterItemCollide);
            }
            return false;
        };
        GridsterPush.prototype.addToTempPushed = function (gridsterItem) {
            var i = this.pushedItemsTemp.indexOf(gridsterItem);
            if (i === -1) {
                i = this.pushedItemsTemp.push(gridsterItem) - 1;
                this.pushedItemsTempPath[i] = [];
            }
            this.pushedItemsTempPath[i].push({ x: gridsterItem.$item.x, y: gridsterItem.$item.y });
        };
        GridsterPush.prototype.removeFromTempPushed = function (gridsterItem) {
            var i = this.pushedItemsTemp.indexOf(gridsterItem);
            var tempPosition = this.pushedItemsTempPath[i].pop();
            if (!tempPosition) {
                return;
            }
            gridsterItem.$item.x = tempPosition.x;
            gridsterItem.$item.y = tempPosition.y;
            gridsterItem.setSize();
            if (!this.pushedItemsTempPath[i].length) {
                this.pushedItemsTemp.splice(i, 1);
                this.pushedItemsTempPath.splice(i, 1);
            }
        };
        GridsterPush.prototype.addToPushed = function (gridsterItem) {
            if (this.pushedItems.indexOf(gridsterItem) < 0) {
                this.pushedItems.push(gridsterItem);
                this.pushedItemsPath.push([{ x: gridsterItem.item.x || 0, y: gridsterItem.item.y || 0 },
                    { x: gridsterItem.$item.x, y: gridsterItem.$item.y }]);
            }
            else {
                var i = this.pushedItems.indexOf(gridsterItem);
                this.pushedItemsPath[i].push({ x: gridsterItem.$item.x, y: gridsterItem.$item.y });
            }
        };
        GridsterPush.prototype.removeFromPushed = function (i) {
            if (i > -1) {
                this.pushedItems.splice(i, 1);
                this.pushedItemsPath.splice(i, 1);
            }
        };
        GridsterPush.prototype.removeFromPushedItem = function (gridsterItem) {
            var i = this.pushedItems.indexOf(gridsterItem);
            if (i > -1) {
                this.pushedItemsPath[i].pop();
                if (!this.pushedItemsPath.length) {
                    this.pushedItems.splice(i, 1);
                    this.pushedItemsPath.splice(i, 1);
                }
            }
        };
        GridsterPush.prototype.checkPushedItem = function (pushedItem, i) {
            var path = this.pushedItemsPath[i];
            var j = path.length - 2;
            var lastPosition, x, y;
            var change = false;
            for (; j > -1; j--) {
                lastPosition = path[j];
                x = pushedItem.$item.x;
                y = pushedItem.$item.y;
                pushedItem.$item.x = lastPosition.x;
                pushedItem.$item.y = lastPosition.y;
                if (!this.gridster.findItemWithItem(pushedItem.$item)) {
                    pushedItem.setSize();
                    path.splice(j + 1, path.length - j - 1);
                    change = true;
                }
                else {
                    pushedItem.$item.x = x;
                    pushedItem.$item.y = y;
                }
            }
            if (path.length < 2) {
                this.removeFromPushed(i);
            }
            return change;
        };
        GridsterPush.ctorParameters = function () { return [
            { type: GridsterItemComponentInterface }
        ]; };
        GridsterPush = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [GridsterItemComponentInterface])
        ], GridsterPush);
        return GridsterPush;
    }());

    var scrollSensitivity;
    var scrollSpeed;
    var intervalDuration = 50;
    var gridsterElement;
    var resizeEvent;
    var resizeEventType;
    var intervalE;
    var intervalW;
    var intervalN;
    var intervalS;
    function scroll(gridster, left, top, width, height, e, lastMouse, calculateItemPosition, resize, resizeEventScrollType) {
        scrollSensitivity = gridster.$options.scrollSensitivity;
        scrollSpeed = gridster.$options.scrollSpeed;
        gridsterElement = gridster.el;
        resizeEvent = resize;
        resizeEventType = resizeEventScrollType;
        var offsetWidth = gridsterElement.offsetWidth;
        var offsetHeight = gridsterElement.offsetHeight;
        var offsetLeft = gridsterElement.scrollLeft;
        var offsetTop = gridsterElement.scrollTop;
        var elemTopOffset = top - offsetTop;
        var elemBottomOffset = offsetHeight + offsetTop - top - height;
        if (!gridster.$options.disableScrollVertical) {
            if (lastMouse.clientY < e.clientY && elemBottomOffset < scrollSensitivity) {
                cancelN();
                if ((resizeEvent && resizeEventType && !resizeEventType.s) || intervalS) {
                    return;
                }
                intervalS = startVertical(1, calculateItemPosition, lastMouse);
            }
            else if (lastMouse.clientY > e.clientY && offsetTop > 0 && elemTopOffset < scrollSensitivity) {
                cancelS();
                if ((resizeEvent && resizeEventType && !resizeEventType.n) || intervalN) {
                    return;
                }
                intervalN = startVertical(-1, calculateItemPosition, lastMouse);
            }
            else if (lastMouse.clientY !== e.clientY) {
                cancelVertical();
            }
        }
        var elemRightOffset = offsetLeft + offsetWidth - left - width;
        var elemLeftOffset = left - offsetLeft;
        if (!gridster.$options.disableScrollHorizontal) {
            if (lastMouse.clientX < e.clientX && elemRightOffset <= scrollSensitivity) {
                cancelW();
                if ((resizeEvent && resizeEventType && !resizeEventType.e) || intervalE) {
                    return;
                }
                intervalE = startHorizontal(1, calculateItemPosition, lastMouse);
            }
            else if (lastMouse.clientX > e.clientX && offsetLeft > 0 && elemLeftOffset < scrollSensitivity) {
                cancelE();
                if ((resizeEvent && resizeEventType && !resizeEventType.w) || intervalW) {
                    return;
                }
                intervalW = startHorizontal(-1, calculateItemPosition, lastMouse);
            }
            else if (lastMouse.clientX !== e.clientX) {
                cancelHorizontal();
            }
        }
    }
    function startVertical(sign, calculateItemPosition, lastMouse) {
        var clientY = lastMouse.clientY;
        return setInterval(function () {
            if (!gridsterElement || sign === -1 && gridsterElement.scrollTop - scrollSpeed < 0) {
                cancelVertical();
            }
            gridsterElement.scrollTop += sign * scrollSpeed;
            clientY += sign * scrollSpeed;
            calculateItemPosition({ clientX: lastMouse.clientX, clientY: clientY });
        }, intervalDuration);
    }
    function startHorizontal(sign, calculateItemPosition, lastMouse) {
        var clientX = lastMouse.clientX;
        return setInterval(function () {
            if (!gridsterElement || sign === -1 && gridsterElement.scrollLeft - scrollSpeed < 0) {
                cancelHorizontal();
            }
            gridsterElement.scrollLeft += sign * scrollSpeed;
            clientX += sign * scrollSpeed;
            calculateItemPosition({ clientX: clientX, clientY: lastMouse.clientY });
        }, intervalDuration);
    }
    function cancelScroll() {
        cancelHorizontal();
        cancelVertical();
        gridsterElement = undefined;
    }
    function cancelHorizontal() {
        cancelE();
        cancelW();
    }
    function cancelVertical() {
        cancelN();
        cancelS();
    }
    function cancelE() {
        if (intervalE) {
            clearInterval(intervalE);
            intervalE = 0;
        }
    }
    function cancelW() {
        if (intervalW) {
            clearInterval(intervalW);
            intervalW = 0;
        }
    }
    function cancelS() {
        if (intervalS) {
            clearInterval(intervalS);
            intervalS = 0;
        }
    }
    function cancelN() {
        if (intervalN) {
            clearInterval(intervalN);
            intervalN = 0;
        }
    }

    var GridsterSwap = /** @class */ (function () {
        function GridsterSwap(gridsterItem) {
            this.gridsterItem = gridsterItem;
            this.gridster = gridsterItem.gridster;
        }
        GridsterSwap.prototype.destroy = function () {
            delete this.gridster;
            delete this.gridsterItem;
            delete this.swapedItem;
        };
        GridsterSwap.prototype.swapItems = function () {
            if (this.gridster.$options.swap) {
                this.checkSwapBack();
                this.checkSwap(this.gridsterItem);
            }
        };
        GridsterSwap.prototype.checkSwapBack = function () {
            if (this.swapedItem) {
                var x = this.swapedItem.$item.x;
                var y = this.swapedItem.$item.y;
                this.swapedItem.$item.x = this.swapedItem.item.x || 0;
                this.swapedItem.$item.y = this.swapedItem.item.y || 0;
                if (this.gridster.checkCollision(this.swapedItem.$item)) {
                    this.swapedItem.$item.x = x;
                    this.swapedItem.$item.y = y;
                }
                else {
                    this.swapedItem.setSize();
                    this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
                    this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
                    this.swapedItem = undefined;
                }
            }
        };
        GridsterSwap.prototype.restoreSwapItem = function () {
            if (this.swapedItem) {
                this.swapedItem.$item.x = this.swapedItem.item.x || 0;
                this.swapedItem.$item.y = this.swapedItem.item.y || 0;
                this.swapedItem.setSize();
                this.swapedItem = undefined;
            }
        };
        GridsterSwap.prototype.setSwapItem = function () {
            if (this.swapedItem) {
                this.swapedItem.checkItemChanges(this.swapedItem.$item, this.swapedItem.item);
                this.swapedItem = undefined;
            }
        };
        GridsterSwap.prototype.checkSwap = function (pushedBy) {
            var gridsterItemCollision;
            if (this.gridster.$options.swapWhileDragging) {
                gridsterItemCollision = this.gridster.checkCollisionForSwaping(pushedBy.$item);
            }
            else {
                gridsterItemCollision = this.gridster.checkCollision(pushedBy.$item);
            }
            if (gridsterItemCollision && gridsterItemCollision !== true && gridsterItemCollision.canBeDragged()) {
                var gridsterItemCollide = gridsterItemCollision;
                var copyCollisionX = gridsterItemCollide.$item.x;
                var copyCollisionY = gridsterItemCollide.$item.y;
                var copyX = pushedBy.$item.x;
                var copyY = pushedBy.$item.y;
                gridsterItemCollide.$item.x = pushedBy.item.x || 0;
                gridsterItemCollide.$item.y = pushedBy.item.y || 0;
                pushedBy.$item.x = gridsterItemCollide.item.x || 0;
                pushedBy.$item.y = gridsterItemCollide.item.y || 0;
                if (this.gridster.checkCollision(gridsterItemCollide.$item) || this.gridster.checkCollision(pushedBy.$item)) {
                    pushedBy.$item.x = copyX;
                    pushedBy.$item.y = copyY;
                    gridsterItemCollide.$item.x = copyCollisionX;
                    gridsterItemCollide.$item.y = copyCollisionY;
                }
                else {
                    gridsterItemCollide.setSize();
                    this.swapedItem = gridsterItemCollide;
                    if (this.gridster.$options.swapWhileDragging) {
                        this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
                        this.setSwapItem();
                    }
                }
            }
        };
        GridsterSwap.ctorParameters = function () { return [
            { type: GridsterItemComponentInterface }
        ]; };
        GridsterSwap = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [GridsterItemComponentInterface])
        ], GridsterSwap);
        return GridsterSwap;
    }());

    var GridsterDraggable = /** @class */ (function () {
        function GridsterDraggable(gridsterItem, gridster, zone) {
            this.zone = zone;
            this.collision = false;
            this.gridsterItem = gridsterItem;
            this.gridster = gridster;
            this.lastMouse = {
                clientX: 0,
                clientY: 0
            };
            this.path = [];
        }
        GridsterDraggable.prototype.destroy = function () {
            if (this.gridster.previewStyle) {
                this.gridster.previewStyle(true);
            }
            delete this.gridsterItem;
            delete this.gridster;
            delete this.collision;
            if (this.mousedown) {
                this.mousedown();
                this.touchstart();
            }
        };
        GridsterDraggable.prototype.dragStart = function (e) {
            var _this = this;
            if (e.which && e.which !== 1) {
                return;
            }
            if (this.gridster.options.draggable && this.gridster.options.draggable.start) {
                this.gridster.options.draggable.start(this.gridsterItem.item, this.gridsterItem, e);
            }
            e.stopPropagation();
            e.preventDefault();
            this.dragFunction = this.dragMove.bind(this);
            this.dragStopFunction = this.dragStop.bind(this);
            this.zone.runOutsideAngular(function () {
                _this.mousemove = _this.gridsterItem.renderer.listen('document', 'mousemove', _this.dragFunction);
                _this.touchmove = _this.gridster.renderer.listen(_this.gridster.el, 'touchmove', _this.dragFunction);
            });
            this.mouseup = this.gridsterItem.renderer.listen('document', 'mouseup', this.dragStopFunction);
            this.mouseleave = this.gridsterItem.renderer.listen('document', 'mouseleave', this.dragStopFunction);
            this.cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', this.dragStopFunction);
            this.touchend = this.gridsterItem.renderer.listen('document', 'touchend', this.dragStopFunction);
            this.touchcancel = this.gridsterItem.renderer.listen('document', 'touchcancel', this.dragStopFunction);
            this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-moving');
            this.margin = this.gridster.$options.margin;
            this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
            this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
            this.left = this.gridsterItem.left - this.margin;
            this.top = this.gridsterItem.top - this.margin;
            this.originalClientX = e.clientX;
            this.originalClientY = e.clientY;
            this.width = this.gridsterItem.width;
            this.height = this.gridsterItem.height;
            if (this.gridster.$options.dirType === exports.DirTypes.RTL) {
                this.diffLeft = (e.clientX - this.gridster.el.scrollWidth + this.gridsterItem.left);
            }
            else {
                this.diffLeft = e.clientX + this.offsetLeft - this.margin - this.left;
            }
            this.diffTop = e.clientY + this.offsetTop - this.margin - this.top;
            this.gridster.movingItem = this.gridsterItem.$item;
            this.gridster.previewStyle(true);
            this.push = new GridsterPush(this.gridsterItem);
            this.swap = new GridsterSwap(this.gridsterItem);
            this.gridster.dragInProgress = true;
            this.gridster.updateGrid();
            this.path.push({ x: this.gridsterItem.item.x || 0, y: this.gridsterItem.item.y || 0 });
        };
        GridsterDraggable.prototype.dragMove = function (e) {
            e.stopPropagation();
            e.preventDefault();
            GridsterUtils.checkTouchEvent(e);
            this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
            this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
            scroll(this.gridster, this.left, this.top, this.width, this.height, e, this.lastMouse, this.calculateItemPositionFromMousePosition.bind(this));
            this.calculateItemPositionFromMousePosition(e);
        };
        GridsterDraggable.prototype.calculateItemPositionFromMousePosition = function (e) {
            var _this = this;
            if (this.gridster.options.scale) {
                this.calculateItemPositionWithScale(e, this.gridster.options.scale);
            }
            else {
                this.calculateItemPositionWithoutScale(e);
            }
            this.calculateItemPosition();
            this.lastMouse.clientX = e.clientX;
            this.lastMouse.clientY = e.clientY;
            this.zone.run(function () {
                _this.gridster.updateGrid();
            });
        };
        GridsterDraggable.prototype.calculateItemPositionWithScale = function (e, scale) {
            this.left = this.originalClientX + ((e.clientX - this.originalClientX) / scale) + this.offsetLeft - this.diffLeft;
            this.top = this.originalClientY + ((e.clientY - this.originalClientY) / scale) + this.offsetTop - this.diffTop;
        };
        GridsterDraggable.prototype.calculateItemPositionWithoutScale = function (e) {
            if (this.gridster.$options.dirType === exports.DirTypes.RTL) {
                this.left = this.gridster.el.scrollWidth - e.clientX + this.diffLeft;
            }
            else {
                this.left = e.clientX + this.offsetLeft - this.diffLeft;
            }
            this.top = e.clientY + this.offsetTop - this.diffTop;
        };
        GridsterDraggable.prototype.dragStop = function (e) {
            var _this = this;
            e.stopPropagation();
            e.preventDefault();
            cancelScroll();
            this.cancelOnBlur();
            this.mousemove();
            this.mouseup();
            this.mouseleave();
            this.touchmove();
            this.touchend();
            this.touchcancel();
            this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-moving');
            this.gridster.dragInProgress = false;
            this.gridster.updateGrid();
            this.path = [];
            if (this.gridster.options.draggable && this.gridster.options.draggable.stop) {
                Promise.resolve(this.gridster.options.draggable.stop(this.gridsterItem.item, this.gridsterItem, e))
                    .then(this.makeDrag.bind(this), this.cancelDrag.bind(this));
            }
            else {
                this.makeDrag();
            }
            setTimeout(function () {
                if (_this.gridster) {
                    _this.gridster.movingItem = null;
                    _this.gridster.previewStyle(true);
                }
            });
        };
        GridsterDraggable.prototype.cancelDrag = function () {
            this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
            this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
            this.gridsterItem.setSize();
            if (this.push) {
                this.push.restoreItems();
            }
            if (this.swap) {
                this.swap.restoreSwapItem();
            }
            if (this.push) {
                this.push.destroy();
                delete this.push;
            }
            if (this.swap) {
                this.swap.destroy();
                delete this.swap;
            }
        };
        GridsterDraggable.prototype.makeDrag = function () {
            if (this.gridster.$options.draggable.dropOverItems && this.gridster.options.draggable
                && this.gridster.options.draggable.dropOverItemsCallback
                && this.collision && this.collision !== true && this.collision.$item) {
                this.gridster.options.draggable.dropOverItemsCallback(this.gridsterItem.item, this.collision.item, this.gridster);
            }
            this.collision = false;
            this.gridsterItem.setSize();
            this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
            if (this.push) {
                this.push.setPushedItems();
            }
            if (this.swap) {
                this.swap.setSwapItem();
            }
            if (this.push) {
                this.push.destroy();
                delete this.push;
            }
            if (this.swap) {
                this.swap.destroy();
                delete this.swap;
            }
        };
        GridsterDraggable.prototype.calculateItemPosition = function () {
            this.gridster.movingItem = this.gridsterItem.$item;
            this.positionX = this.gridster.pixelsToPositionX(this.left, Math.round);
            this.positionY = this.gridster.pixelsToPositionY(this.top, Math.round);
            this.positionXBackup = this.gridsterItem.$item.x;
            this.positionYBackup = this.gridsterItem.$item.y;
            this.gridsterItem.$item.x = this.positionX;
            if (this.gridster.checkGridCollision(this.gridsterItem.$item)) {
                this.gridsterItem.$item.x = this.positionXBackup;
            }
            this.gridsterItem.$item.y = this.positionY;
            if (this.gridster.checkGridCollision(this.gridsterItem.$item)) {
                this.gridsterItem.$item.y = this.positionYBackup;
            }
            this.gridster.gridRenderer.setCellPosition(this.gridsterItem.renderer, this.gridsterItem.el, this.left, this.top);
            if (this.positionXBackup !== this.gridsterItem.$item.x || this.positionYBackup !== this.gridsterItem.$item.y) {
                var lastPosition = this.path[this.path.length - 1];
                var direction = '';
                if (lastPosition.x < this.gridsterItem.$item.x) {
                    direction = this.push.fromWest;
                }
                else if (lastPosition.x > this.gridsterItem.$item.x) {
                    direction = this.push.fromEast;
                }
                else if (lastPosition.y < this.gridsterItem.$item.y) {
                    direction = this.push.fromNorth;
                }
                else if (lastPosition.y > this.gridsterItem.$item.y) {
                    direction = this.push.fromSouth;
                }
                this.push.pushItems(direction, this.gridster.$options.disablePushOnDrag);
                this.swap.swapItems();
                this.collision = this.gridster.checkCollision(this.gridsterItem.$item);
                if (this.collision) {
                    this.gridsterItem.$item.x = this.positionXBackup;
                    this.gridsterItem.$item.y = this.positionYBackup;
                    if (this.gridster.$options.draggable.dropOverItems && this.collision !== true && this.collision.$item) {
                        this.gridster.movingItem = null;
                    }
                }
                else {
                    this.path.push({ x: this.gridsterItem.$item.x, y: this.gridsterItem.$item.y });
                }
                this.push.checkPushBack();
            }
            this.gridster.previewStyle(true);
        };
        GridsterDraggable.prototype.toggle = function () {
            var enableDrag = this.gridsterItem.canBeDragged();
            if (!this.enabled && enableDrag) {
                this.enabled = !this.enabled;
                this.dragStartFunction = this.dragStartDelay.bind(this);
                this.mousedown = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'mousedown', this.dragStartFunction);
                this.touchstart = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'touchstart', this.dragStartFunction);
            }
            else if (this.enabled && !enableDrag) {
                this.enabled = !this.enabled;
                this.mousedown();
                this.touchstart();
            }
        };
        GridsterDraggable.prototype.dragStartDelay = function (e) {
            var _this = this;
            if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('gridster-item-resizable-handler') > -1) {
                return;
            }
            if (GridsterUtils.checkContentClassForEvent(this.gridster, e)) {
                return;
            }
            GridsterUtils.checkTouchEvent(e);
            if (!this.gridster.$options.draggable.delayStart) {
                this.dragStart(e);
                return;
            }
            var timeout = setTimeout(function () {
                _this.dragStart(e);
                cancelDrag();
            }, this.gridster.$options.draggable.delayStart);
            var cancelMouse = this.gridsterItem.renderer.listen('document', 'mouseup', cancelDrag);
            var cancelMouseLeave = this.gridsterItem.renderer.listen('document', 'mouseleave', cancelDrag);
            var cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', cancelDrag);
            var cancelTouchMove = this.gridsterItem.renderer.listen('document', 'touchmove', cancelMove);
            var cancelTouchEnd = this.gridsterItem.renderer.listen('document', 'touchend', cancelDrag);
            var cancelTouchCancel = this.gridsterItem.renderer.listen('document', 'touchcancel', cancelDrag);
            function cancelMove(eventMove) {
                GridsterUtils.checkTouchEvent(eventMove);
                if (Math.abs(eventMove.clientX - e.clientX) > 9 || Math.abs(eventMove.clientY - e.clientY) > 9) {
                    cancelDrag();
                }
            }
            function cancelDrag() {
                clearTimeout(timeout);
                cancelOnBlur();
                cancelMouse();
                cancelMouseLeave();
                cancelTouchMove();
                cancelTouchEnd();
                cancelTouchCancel();
            }
        };
        GridsterDraggable.ctorParameters = function () { return [
            { type: GridsterItemComponentInterface },
            { type: GridsterComponentInterface },
            { type: core.NgZone }
        ]; };
        GridsterDraggable = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [GridsterItemComponentInterface, GridsterComponentInterface, core.NgZone])
        ], GridsterDraggable);
        return GridsterDraggable;
    }());

    var GridsterPushResize = /** @class */ (function () {
        function GridsterPushResize(gridsterItem) {
            this.pushedItems = [];
            this.pushedItemsPath = [];
            this.gridsterItem = gridsterItem;
            this.gridster = gridsterItem.gridster;
            this.tryPattern = {
                fromEast: this.tryWest,
                fromWest: this.tryEast,
                fromNorth: this.trySouth,
                fromSouth: this.tryNorth
            };
            this.fromSouth = 'fromSouth';
            this.fromNorth = 'fromNorth';
            this.fromEast = 'fromEast';
            this.fromWest = 'fromWest';
        }
        GridsterPushResize.prototype.destroy = function () {
            delete this.gridster;
            delete this.gridsterItem;
        };
        GridsterPushResize.prototype.pushItems = function (direction) {
            if (this.gridster.$options.pushResizeItems) {
                return this.push(this.gridsterItem, direction);
            }
            else {
                return false;
            }
        };
        GridsterPushResize.prototype.restoreItems = function () {
            var i = 0;
            var l = this.pushedItems.length;
            var pushedItem;
            for (; i < l; i++) {
                pushedItem = this.pushedItems[i];
                pushedItem.$item.x = pushedItem.item.x || 0;
                pushedItem.$item.y = pushedItem.item.y || 0;
                pushedItem.$item.cols = pushedItem.item.cols || 1;
                pushedItem.$item.row = pushedItem.item.row || 1;
                pushedItem.setSize();
            }
            this.pushedItems = [];
            this.pushedItemsPath = [];
        };
        GridsterPushResize.prototype.setPushedItems = function () {
            var i = 0;
            var l = this.pushedItems.length;
            var pushedItem;
            for (; i < l; i++) {
                pushedItem = this.pushedItems[i];
                pushedItem.checkItemChanges(pushedItem.$item, pushedItem.item);
            }
            this.pushedItems = [];
            this.pushedItemsPath = [];
        };
        GridsterPushResize.prototype.checkPushBack = function () {
            var i = this.pushedItems.length - 1;
            var change = false;
            for (; i > -1; i--) {
                if (this.checkPushedItem(this.pushedItems[i], i)) {
                    change = true;
                }
            }
            if (change) {
                this.checkPushBack();
            }
        };
        GridsterPushResize.prototype.push = function (gridsterItem, direction) {
            var gridsterItemCollision = this.gridster.checkCollision(gridsterItem.$item);
            if (gridsterItemCollision && gridsterItemCollision !== true &&
                gridsterItemCollision !== this.gridsterItem && gridsterItemCollision.canBeResized()) {
                if (this.tryPattern[direction].call(this, gridsterItemCollision, gridsterItem, direction)) {
                    return true;
                }
            }
            else if (gridsterItemCollision === false) {
                return true;
            }
            return false;
        };
        GridsterPushResize.prototype.trySouth = function (gridsterItemCollide, gridsterItem, direction) {
            var backUpY = gridsterItemCollide.$item.y;
            var backUpRows = gridsterItemCollide.$item.rows;
            gridsterItemCollide.$item.y = gridsterItem.$item.y + gridsterItem.$item.rows;
            gridsterItemCollide.$item.rows = backUpRows + backUpY - gridsterItemCollide.$item.y;
            if (!this.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
                && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
                gridsterItemCollide.setSize();
                this.addToPushed(gridsterItemCollide);
                this.push(gridsterItem, direction);
                return true;
            }
            else {
                gridsterItemCollide.$item.y = backUpY;
                gridsterItemCollide.$item.rows = backUpRows;
            }
            return false;
        };
        GridsterPushResize.prototype.tryNorth = function (gridsterItemCollide, gridsterItem, direction) {
            var backUpRows = gridsterItemCollide.$item.rows;
            gridsterItemCollide.$item.rows = gridsterItem.$item.y - gridsterItemCollide.$item.y;
            if (!this.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
                && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
                gridsterItemCollide.setSize();
                this.addToPushed(gridsterItemCollide);
                this.push(gridsterItem, direction);
                return true;
            }
            else {
                gridsterItemCollide.$item.rows = backUpRows;
            }
            return false;
        };
        GridsterPushResize.prototype.tryEast = function (gridsterItemCollide, gridsterItem, direction) {
            var backUpX = gridsterItemCollide.$item.x;
            var backUpCols = gridsterItemCollide.$item.cols;
            gridsterItemCollide.$item.x = gridsterItem.$item.x + gridsterItem.$item.cols;
            gridsterItemCollide.$item.cols = backUpCols + backUpX - gridsterItemCollide.$item.x;
            if (!this.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
                && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
                gridsterItemCollide.setSize();
                this.addToPushed(gridsterItemCollide);
                this.push(gridsterItem, direction);
                return true;
            }
            else {
                gridsterItemCollide.$item.x = backUpX;
                gridsterItemCollide.$item.cols = backUpCols;
            }
            return false;
        };
        GridsterPushResize.prototype.tryWest = function (gridsterItemCollide, gridsterItem, direction) {
            var backUpCols = gridsterItemCollide.$item.cols;
            gridsterItemCollide.$item.cols = gridsterItem.$item.x - gridsterItemCollide.$item.x;
            if (!this.gridster.checkCollisionTwoItems(gridsterItemCollide.$item, gridsterItem.$item)
                && !this.gridster.checkGridCollision(gridsterItemCollide.$item)) {
                gridsterItemCollide.setSize();
                this.addToPushed(gridsterItemCollide);
                this.push(gridsterItem, direction);
                return true;
            }
            else {
                gridsterItemCollide.$item.cols = backUpCols;
            }
            return false;
        };
        GridsterPushResize.prototype.addToPushed = function (gridsterItem) {
            if (this.pushedItems.indexOf(gridsterItem) < 0) {
                this.pushedItems.push(gridsterItem);
                this.pushedItemsPath.push([
                    {
                        x: gridsterItem.item.x || 0,
                        y: gridsterItem.item.y || 0,
                        cols: gridsterItem.item.cols || 0,
                        rows: gridsterItem.item.rows || 0
                    },
                    {
                        x: gridsterItem.$item.x,
                        y: gridsterItem.$item.y,
                        cols: gridsterItem.$item.cols,
                        rows: gridsterItem.$item.rows
                    }
                ]);
            }
            else {
                var i = this.pushedItems.indexOf(gridsterItem);
                this.pushedItemsPath[i].push({
                    x: gridsterItem.$item.x,
                    y: gridsterItem.$item.y,
                    cols: gridsterItem.$item.cols,
                    rows: gridsterItem.$item.rows
                });
            }
        };
        GridsterPushResize.prototype.removeFromPushed = function (i) {
            if (i > -1) {
                this.pushedItems.splice(i, 1);
                this.pushedItemsPath.splice(i, 1);
            }
        };
        GridsterPushResize.prototype.checkPushedItem = function (pushedItem, i) {
            var path = this.pushedItemsPath[i];
            var j = path.length - 2;
            var lastPosition, x, y, cols, rows;
            for (; j > -1; j--) {
                lastPosition = path[j];
                x = pushedItem.$item.x;
                y = pushedItem.$item.y;
                cols = pushedItem.$item.cols;
                rows = pushedItem.$item.rows;
                pushedItem.$item.x = lastPosition.x;
                pushedItem.$item.y = lastPosition.y;
                pushedItem.$item.cols = lastPosition.cols;
                pushedItem.$item.rows = lastPosition.rows;
                if (!this.gridster.findItemWithItem(pushedItem.$item)) {
                    pushedItem.setSize();
                    path.splice(j + 1, path.length - 1 - j);
                }
                else {
                    pushedItem.$item.x = x;
                    pushedItem.$item.y = y;
                    pushedItem.$item.cols = cols;
                    pushedItem.$item.rows = rows;
                }
            }
            if (path.length < 2) {
                this.removeFromPushed(i);
                return true;
            }
            return false;
        };
        GridsterPushResize.ctorParameters = function () { return [
            { type: GridsterItemComponentInterface }
        ]; };
        GridsterPushResize = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [GridsterItemComponentInterface])
        ], GridsterPushResize);
        return GridsterPushResize;
    }());

    var GridsterResizable = /** @class */ (function () {
        function GridsterResizable(gridsterItem, gridster, zone) {
            this.zone = zone;
            this.gridsterItem = gridsterItem;
            this.gridster = gridster;
            this.lastMouse = {
                clientX: 0,
                clientY: 0
            };
            this.itemBackup = [0, 0, 0, 0];
            this.resizeEventScrollType = { w: false, e: false, n: false, s: false };
        }
        GridsterResizable.prototype.destroy = function () {
            if (this.gridster.previewStyle) {
                this.gridster.previewStyle();
            }
            delete this.gridsterItem;
            delete this.gridster;
        };
        GridsterResizable.prototype.dragStart = function (e) {
            var _this = this;
            if (e.which && e.which !== 1) {
                return;
            }
            if (this.gridster.options.resizable && this.gridster.options.resizable.start) {
                this.gridster.options.resizable.start(this.gridsterItem.item, this.gridsterItem, e);
            }
            e.stopPropagation();
            e.preventDefault();
            this.dragFunction = this.dragMove.bind(this);
            this.dragStopFunction = this.dragStop.bind(this);
            this.zone.runOutsideAngular(function () {
                _this.mousemove = _this.gridsterItem.renderer.listen('document', 'mousemove', _this.dragFunction);
                _this.touchmove = _this.gridster.renderer.listen(_this.gridster.el, 'touchmove', _this.dragFunction);
            });
            this.mouseup = this.gridsterItem.renderer.listen('document', 'mouseup', this.dragStopFunction);
            this.mouseleave = this.gridsterItem.renderer.listen('document', 'mouseleave', this.dragStopFunction);
            this.cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', this.dragStopFunction);
            this.touchend = this.gridsterItem.renderer.listen('document', 'touchend', this.dragStopFunction);
            this.touchcancel = this.gridsterItem.renderer.listen('document', 'touchcancel', this.dragStopFunction);
            this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-resizing');
            this.lastMouse.clientX = e.clientX;
            this.lastMouse.clientY = e.clientY;
            this.left = this.gridsterItem.left;
            this.top = this.gridsterItem.top;
            this.width = this.gridsterItem.width;
            this.height = this.gridsterItem.height;
            this.bottom = this.gridsterItem.top + this.gridsterItem.height;
            this.right = this.gridsterItem.left + this.gridsterItem.width;
            this.margin = this.gridster.$options.margin;
            this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
            this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
            this.diffLeft = e.clientX + this.offsetLeft - this.left;
            this.diffRight = e.clientX + this.offsetLeft - this.right;
            this.diffTop = e.clientY + this.offsetTop - this.top;
            this.diffBottom = e.clientY + this.offsetTop - this.bottom;
            this.minHeight = this.gridster.positionYToPixels(this.gridsterItem.$item.minItemRows || this.gridster.$options.minItemRows)
                - this.margin;
            this.minWidth = this.gridster.positionXToPixels(this.gridsterItem.$item.minItemCols || this.gridster.$options.minItemCols)
                - this.margin;
            this.gridster.movingItem = this.gridsterItem.$item;
            this.gridster.previewStyle();
            this.push = new GridsterPush(this.gridsterItem);
            this.pushResize = new GridsterPushResize(this.gridsterItem);
            this.gridster.dragInProgress = true;
            this.gridster.updateGrid();
            if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-n') > -1) {
                this.resizeEventScrollType.n = true;
                this.directionFunction = this.handleN;
            }
            else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-w') > -1) {
                if (this.gridster.$options.dirType === exports.DirTypes.RTL) {
                    this.resizeEventScrollType.e = true;
                    this.directionFunction = this.handleE;
                }
                else {
                    this.resizeEventScrollType.w = true;
                    this.directionFunction = this.handleW;
                }
            }
            else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-s') > -1) {
                this.resizeEventScrollType.s = true;
                this.directionFunction = this.handleS;
            }
            else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-e') > -1) {
                if (this.gridster.$options.dirType === exports.DirTypes.RTL) {
                    this.resizeEventScrollType.w = true;
                    this.directionFunction = this.handleW;
                }
                else {
                    this.resizeEventScrollType.e = true;
                    this.directionFunction = this.handleE;
                }
            }
            else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-nw') > -1) {
                if (this.gridster.$options.dirType === exports.DirTypes.RTL) {
                    this.resizeEventScrollType.n = true;
                    this.resizeEventScrollType.e = true;
                    this.directionFunction = this.handleNE;
                }
                else {
                    this.resizeEventScrollType.n = true;
                    this.resizeEventScrollType.w = true;
                    this.directionFunction = this.handleNW;
                }
            }
            else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-ne') > -1) {
                if (this.gridster.$options.dirType === exports.DirTypes.RTL) {
                    this.resizeEventScrollType.n = true;
                    this.resizeEventScrollType.w = true;
                    this.directionFunction = this.handleNW;
                }
                else {
                    this.resizeEventScrollType.n = true;
                    this.resizeEventScrollType.e = true;
                    this.directionFunction = this.handleNE;
                }
            }
            else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-sw') > -1) {
                if (this.gridster.$options.dirType === exports.DirTypes.RTL) {
                    this.resizeEventScrollType.s = true;
                    this.resizeEventScrollType.e = true;
                    this.directionFunction = this.handleSE;
                }
                else {
                    this.resizeEventScrollType.s = true;
                    this.resizeEventScrollType.w = true;
                    this.directionFunction = this.handleSW;
                }
            }
            else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-se') > -1) {
                if (this.gridster.$options.dirType === exports.DirTypes.RTL) {
                    this.resizeEventScrollType.s = true;
                    this.resizeEventScrollType.w = true;
                    this.directionFunction = this.handleSW;
                }
                else {
                    this.resizeEventScrollType.s = true;
                    this.resizeEventScrollType.e = true;
                    this.directionFunction = this.handleSE;
                }
            }
        };
        GridsterResizable.prototype.dragMove = function (e) {
            var _this = this;
            e.stopPropagation();
            e.preventDefault();
            GridsterUtils.checkTouchEvent(e);
            this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
            this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
            scroll(this.gridster, this.left, this.top, this.width, this.height, e, this.lastMouse, this.directionFunction.bind(this), true, this.resizeEventScrollType);
            this.directionFunction(e);
            this.lastMouse.clientX = e.clientX;
            this.lastMouse.clientY = e.clientY;
            this.zone.run(function () {
                _this.gridster.updateGrid();
            });
        };
        GridsterResizable.prototype.dragStop = function (e) {
            var _this = this;
            e.stopPropagation();
            e.preventDefault();
            cancelScroll();
            this.mousemove();
            this.mouseup();
            this.mouseleave();
            this.cancelOnBlur();
            this.touchmove();
            this.touchend();
            this.touchcancel();
            this.gridster.dragInProgress = false;
            this.gridster.updateGrid();
            if (this.gridster.options.resizable && this.gridster.options.resizable.stop) {
                Promise.resolve(this.gridster.options.resizable.stop(this.gridsterItem.item, this.gridsterItem, e))
                    .then(this.makeResize.bind(this), this.cancelResize.bind(this));
            }
            else {
                this.makeResize();
            }
            setTimeout(function () {
                _this.gridsterItem.renderer.removeClass(_this.gridsterItem.el, 'gridster-item-resizing');
                if (_this.gridster) {
                    _this.gridster.movingItem = null;
                    _this.gridster.previewStyle();
                }
            });
        };
        GridsterResizable.prototype.cancelResize = function () {
            this.gridsterItem.$item.cols = this.gridsterItem.item.cols || 1;
            this.gridsterItem.$item.rows = this.gridsterItem.item.rows || 1;
            this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
            this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
            this.gridsterItem.setSize();
            this.push.restoreItems();
            this.pushResize.restoreItems();
            this.push.destroy();
            delete this.push;
            this.pushResize.destroy();
            delete this.pushResize;
        };
        GridsterResizable.prototype.makeResize = function () {
            this.gridsterItem.setSize();
            this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
            this.push.setPushedItems();
            this.pushResize.setPushedItems();
            this.push.destroy();
            delete this.push;
            this.pushResize.destroy();
            delete this.pushResize;
        };
        GridsterResizable.prototype.handleN = function (e) {
            this.top = e.clientY + this.offsetTop - this.diffTop;
            this.height = this.bottom - this.top;
            if (this.minHeight > this.height) {
                this.height = this.minHeight;
                this.top = this.bottom - this.minHeight;
            }
            this.newPosition = this.gridster.pixelsToPositionY(this.top + this.margin, Math.floor);
            if (this.gridsterItem.$item.y !== this.newPosition) {
                this.itemBackup[1] = this.gridsterItem.$item.y;
                this.itemBackup[3] = this.gridsterItem.$item.rows;
                this.gridsterItem.$item.rows += this.gridsterItem.$item.y - this.newPosition;
                this.gridsterItem.$item.y = this.newPosition;
                this.pushResize.pushItems(this.pushResize.fromSouth);
                this.push.pushItems(this.push.fromSouth, this.gridster.$options.disablePushOnResize);
                if (this.gridster.checkCollision(this.gridsterItem.$item)) {
                    this.gridsterItem.$item.y = this.itemBackup[1];
                    this.gridsterItem.$item.rows = this.itemBackup[3];
                    this.setItemTop(this.gridster.positionYToPixels(this.gridsterItem.$item.y));
                    this.setItemHeight(this.gridster.positionYToPixels(this.gridsterItem.$item.rows) - this.margin);
                    return;
                }
                else {
                    this.gridster.previewStyle();
                }
                this.pushResize.checkPushBack();
                this.push.checkPushBack();
            }
            this.setItemTop(this.top);
            this.setItemHeight(this.height);
        };
        GridsterResizable.prototype.handleW = function (e) {
            this.left = e.clientX + this.offsetLeft - this.diffLeft;
            this.width = this.right - this.left;
            if (this.minWidth > this.width) {
                this.width = this.minWidth;
                this.left = this.right - this.minWidth;
            }
            this.newPosition = this.gridster.pixelsToPositionX(this.left + this.margin, Math.floor);
            if (this.gridsterItem.$item.x !== this.newPosition) {
                this.itemBackup[0] = this.gridsterItem.$item.x;
                this.itemBackup[2] = this.gridsterItem.$item.cols;
                this.gridsterItem.$item.cols += this.gridsterItem.$item.x - this.newPosition;
                this.gridsterItem.$item.x = this.newPosition;
                this.pushResize.pushItems(this.pushResize.fromEast);
                this.push.pushItems(this.push.fromEast, this.gridster.$options.disablePushOnResize);
                if (this.gridster.checkCollision(this.gridsterItem.$item)) {
                    this.gridsterItem.$item.x = this.itemBackup[0];
                    this.gridsterItem.$item.cols = this.itemBackup[2];
                    this.setItemLeft(this.gridster.positionXToPixels(this.gridsterItem.$item.x));
                    this.setItemWidth(this.gridster.positionXToPixels(this.gridsterItem.$item.cols) - this.margin);
                    return;
                }
                else {
                    this.gridster.previewStyle();
                }
                this.pushResize.checkPushBack();
                this.push.checkPushBack();
            }
            this.setItemLeft(this.left);
            this.setItemWidth(this.width);
        };
        GridsterResizable.prototype.handleS = function (e) {
            this.height = e.clientY + this.offsetTop - this.diffBottom - this.top;
            if (this.minHeight > this.height) {
                this.height = this.minHeight;
            }
            this.bottom = this.top + this.height;
            this.newPosition = this.gridster.pixelsToPositionY(this.bottom, Math.ceil);
            if ((this.gridsterItem.$item.y + this.gridsterItem.$item.rows) !== this.newPosition) {
                this.itemBackup[3] = this.gridsterItem.$item.rows;
                this.gridsterItem.$item.rows = this.newPosition - this.gridsterItem.$item.y;
                this.pushResize.pushItems(this.pushResize.fromNorth);
                this.push.pushItems(this.push.fromNorth, this.gridster.$options.disablePushOnResize);
                if (this.gridster.checkCollision(this.gridsterItem.$item)) {
                    this.gridsterItem.$item.rows = this.itemBackup[3];
                    this.setItemHeight(this.gridster.positionYToPixels(this.gridsterItem.$item.rows) - this.margin);
                    return;
                }
                else {
                    this.gridster.previewStyle();
                }
                this.pushResize.checkPushBack();
                this.push.checkPushBack();
            }
            this.setItemHeight(this.height);
        };
        GridsterResizable.prototype.handleE = function (e) {
            this.width = e.clientX + this.offsetLeft - this.diffRight - this.left;
            if (this.minWidth > this.width) {
                this.width = this.minWidth;
            }
            this.right = this.left + this.width;
            this.newPosition = this.gridster.pixelsToPositionX(this.right, Math.ceil);
            if ((this.gridsterItem.$item.x + this.gridsterItem.$item.cols) !== this.newPosition) {
                this.itemBackup[2] = this.gridsterItem.$item.cols;
                this.gridsterItem.$item.cols = this.newPosition - this.gridsterItem.$item.x;
                this.pushResize.pushItems(this.pushResize.fromWest);
                this.push.pushItems(this.push.fromWest, this.gridster.$options.disablePushOnResize);
                if (this.gridster.checkCollision(this.gridsterItem.$item)) {
                    this.gridsterItem.$item.cols = this.itemBackup[2];
                    this.setItemWidth(this.gridster.positionXToPixels(this.gridsterItem.$item.cols) - this.margin);
                    return;
                }
                else {
                    this.gridster.previewStyle();
                }
                this.pushResize.checkPushBack();
                this.push.checkPushBack();
            }
            this.setItemWidth(this.width);
        };
        GridsterResizable.prototype.handleNW = function (e) {
            this.handleN(e);
            this.handleW(e);
        };
        GridsterResizable.prototype.handleNE = function (e) {
            this.handleN(e);
            this.handleE(e);
        };
        GridsterResizable.prototype.handleSW = function (e) {
            this.handleS(e);
            this.handleW(e);
        };
        GridsterResizable.prototype.handleSE = function (e) {
            this.handleS(e);
            this.handleE(e);
        };
        GridsterResizable.prototype.toggle = function () {
            this.resizeEnabled = this.gridsterItem.canBeResized();
        };
        GridsterResizable.prototype.dragStartDelay = function (e) {
            var _this = this;
            GridsterUtils.checkTouchEvent(e);
            if (!this.gridster.$options.resizable.delayStart) {
                this.dragStart(e);
                return;
            }
            var timeout = setTimeout(function () {
                _this.dragStart(e);
                cancelDrag();
            }, this.gridster.$options.resizable.delayStart);
            var cancelMouse = this.gridsterItem.renderer.listen('document', 'mouseup', cancelDrag);
            var cancelMouseLeave = this.gridsterItem.renderer.listen('document', 'mouseleave', cancelDrag);
            var cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', cancelDrag);
            var cancelTouchMove = this.gridsterItem.renderer.listen('document', 'touchmove', cancelMove);
            var cancelTouchEnd = this.gridsterItem.renderer.listen('document', 'touchend', cancelDrag);
            var cancelTouchCancel = this.gridsterItem.renderer.listen('document', 'touchcancel', cancelDrag);
            function cancelMove(eventMove) {
                GridsterUtils.checkTouchEvent(eventMove);
                if (Math.abs(eventMove.clientX - e.clientX) > 9 || Math.abs(eventMove.clientY - e.clientY) > 9) {
                    cancelDrag();
                }
            }
            function cancelDrag() {
                clearTimeout(timeout);
                cancelOnBlur();
                cancelMouse();
                cancelMouseLeave();
                cancelTouchMove();
                cancelTouchEnd();
                cancelTouchCancel();
            }
        };
        GridsterResizable.prototype.setItemTop = function (top) {
            this.gridster.gridRenderer.setCellPosition(this.gridsterItem.renderer, this.gridsterItem.el, this.left, top);
        };
        GridsterResizable.prototype.setItemLeft = function (left) {
            this.gridster.gridRenderer.setCellPosition(this.gridsterItem.renderer, this.gridsterItem.el, left, this.top);
        };
        GridsterResizable.prototype.setItemHeight = function (height) {
            this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', height + 'px');
        };
        GridsterResizable.prototype.setItemWidth = function (width) {
            this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', width + 'px');
        };
        GridsterResizable.ctorParameters = function () { return [
            { type: GridsterItemComponentInterface },
            { type: GridsterComponentInterface },
            { type: core.NgZone }
        ]; };
        GridsterResizable = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [GridsterItemComponentInterface, GridsterComponentInterface, core.NgZone])
        ], GridsterResizable);
        return GridsterResizable;
    }());

    var GridsterItemComponent = /** @class */ (function () {
        function GridsterItemComponent(el, gridster, renderer, zone) {
            this.renderer = renderer;
            this.zone = zone;
            this.el = el.nativeElement;
            this.$item = {
                cols: -1,
                rows: -1,
                x: -1,
                y: -1,
            };
            this.gridster = gridster;
            this.drag = new GridsterDraggable(this, gridster, this.zone);
            this.resize = new GridsterResizable(this, gridster, this.zone);
        }
        Object.defineProperty(GridsterItemComponent.prototype, "zIndex", {
            get: function () {
                return this.getLayerIndex() + this.gridster.$options.baseLayerIndex;
            },
            enumerable: true,
            configurable: true
        });
        GridsterItemComponent.prototype.ngOnInit = function () {
            this.updateOptions();
            this.gridster.addItem(this);
        };
        GridsterItemComponent.prototype.updateOptions = function () {
            this.$item = GridsterUtils.merge(this.$item, this.item, {
                cols: undefined,
                rows: undefined,
                x: undefined,
                y: undefined,
                layerIndex: undefined,
                dragEnabled: undefined,
                resizeEnabled: undefined,
                compactEnabled: undefined,
                maxItemRows: undefined,
                minItemRows: undefined,
                maxItemCols: undefined,
                minItemCols: undefined,
                maxItemArea: undefined,
                minItemArea: undefined,
            });
        };
        GridsterItemComponent.prototype.ngOnDestroy = function () {
            this.gridster.removeItem(this);
            delete this.gridster;
            this.drag.destroy();
            delete this.drag;
            this.resize.destroy();
            delete this.resize;
        };
        GridsterItemComponent.prototype.setSize = function () {
            this.renderer.setStyle(this.el, 'display', this.notPlaced ? '' : 'block');
            this.gridster.gridRenderer.updateItem(this.el, this.$item, this.renderer);
            this.updateItemSize();
        };
        GridsterItemComponent.prototype.updateItemSize = function () {
            var top = this.$item.y * this.gridster.curRowHeight;
            var left = this.$item.x * this.gridster.curColWidth;
            var width = this.$item.cols * this.gridster.curColWidth - this.gridster.$options.margin;
            var height = this.$item.rows * this.gridster.curRowHeight - this.gridster.$options.margin;
            if (!this.init && width > 0 && height > 0) {
                this.init = true;
                if (this.item.initCallback) {
                    this.item.initCallback(this.item, this);
                }
                if (this.gridster.options.itemInitCallback) {
                    this.gridster.options.itemInitCallback(this.item, this);
                }
                if (this.gridster.$options.scrollToNewItems) {
                    this.el.scrollIntoView(false);
                }
            }
            if (width !== this.width || height !== this.height) {
                this.width = width;
                this.height = height;
                if (this.gridster.options.itemResizeCallback) {
                    this.gridster.options.itemResizeCallback(this.item, this);
                }
            }
            this.top = top;
            this.left = left;
        };
        GridsterItemComponent.prototype.itemChanged = function () {
            if (this.gridster.options.itemChangeCallback) {
                this.gridster.options.itemChangeCallback(this.item, this);
            }
        };
        GridsterItemComponent.prototype.checkItemChanges = function (newValue, oldValue) {
            if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
                return;
            }
            if (this.gridster.checkCollision(this.$item)) {
                this.$item.x = oldValue.x || 0;
                this.$item.y = oldValue.y || 0;
                this.$item.cols = oldValue.cols || 1;
                this.$item.rows = oldValue.rows || 1;
                this.setSize();
            }
            else {
                this.item.cols = this.$item.cols;
                this.item.rows = this.$item.rows;
                this.item.x = this.$item.x;
                this.item.y = this.$item.y;
                this.gridster.calculateLayoutDebounce();
                this.itemChanged();
            }
        };
        GridsterItemComponent.prototype.canBeDragged = function () {
            return !this.gridster.mobile &&
                (this.$item.dragEnabled === undefined ? this.gridster.$options.draggable.enabled : this.$item.dragEnabled);
        };
        GridsterItemComponent.prototype.canBeResized = function () {
            return !this.gridster.mobile &&
                (this.$item.resizeEnabled === undefined ? this.gridster.$options.resizable.enabled : this.$item.resizeEnabled);
        };
        GridsterItemComponent.prototype.bringToFront = function (offset) {
            if (offset && offset <= 0) {
                return;
            }
            var layerIndex = this.getLayerIndex();
            var topIndex = this.gridster.$options.maxLayerIndex;
            if (layerIndex < topIndex) {
                var targetIndex = offset ? layerIndex + offset : topIndex;
                this.item.layerIndex = this.$item.layerIndex = targetIndex > topIndex ? topIndex : targetIndex;
            }
        };
        GridsterItemComponent.prototype.sendToBack = function (offset) {
            if (offset && offset <= 0) {
                return;
            }
            var layerIndex = this.getLayerIndex();
            if (layerIndex > 0) {
                var targetIndex = offset ? layerIndex - offset : 0;
                this.item.layerIndex = this.$item.layerIndex = targetIndex < 0 ? 0 : targetIndex;
            }
        };
        GridsterItemComponent.prototype.getLayerIndex = function () {
            if (this.item.layerIndex !== undefined) {
                return this.item.layerIndex;
            }
            if (this.gridster.$options.defaultLayerIndex !== undefined) {
                return this.gridster.$options.defaultLayerIndex;
            }
            return 0;
        };
        GridsterItemComponent.ctorParameters = function () { return [
            { type: core.ElementRef, decorators: [{ type: core.Inject, args: [core.ElementRef,] }] },
            { type: GridsterComponent },
            { type: core.Renderer2, decorators: [{ type: core.Inject, args: [core.Renderer2,] }] },
            { type: core.NgZone, decorators: [{ type: core.Inject, args: [core.NgZone,] }] }
        ]; };
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], GridsterItemComponent.prototype, "item", void 0);
        __decorate([
            core.HostBinding('style.z-index'),
            __metadata("design:type", Number),
            __metadata("design:paramtypes", [])
        ], GridsterItemComponent.prototype, "zIndex", null);
        GridsterItemComponent = __decorate([
            core.Component({
                selector: 'gridster-item',
                template: "<ng-content></ng-content>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.s && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-s\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.e && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-e\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.n && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-n\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.w && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-w\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.se && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-se\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.ne && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-ne\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.sw && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-sw\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.nw && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-nw\"></div>\n",
                encapsulation: core.ViewEncapsulation.None,
                styles: ["gridster-item{box-sizing:border-box;z-index:1;position:absolute;overflow:hidden;transition:.3s;display:none;background:#fff;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}gridster-item.gridster-item-moving{cursor:move}gridster-item.gridster-item-moving,gridster-item.gridster-item-resizing{transition:none;z-index:2;box-shadow:0 0 5px 5px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)}.gridster-item-resizable-handler{position:absolute;z-index:2}.gridster-item-resizable-handler.handle-n{cursor:ns-resize;height:10px;right:0;top:0;left:0}.gridster-item-resizable-handler.handle-e{cursor:ew-resize;width:10px;bottom:0;right:0;top:0}.gridster-item-resizable-handler.handle-s{cursor:ns-resize;height:10px;right:0;bottom:0;left:0}.gridster-item-resizable-handler.handle-w{cursor:ew-resize;width:10px;left:0;top:0;bottom:0}.gridster-item-resizable-handler.handle-ne{cursor:ne-resize;width:10px;height:10px;right:0;top:0}.gridster-item-resizable-handler.handle-nw{cursor:nw-resize;width:10px;height:10px;left:0;top:0}.gridster-item-resizable-handler.handle-se{cursor:se-resize;width:0;height:0;right:0;bottom:0;border-style:solid;border-width:0 0 10px 10px;border-color:transparent}.gridster-item-resizable-handler.handle-sw{cursor:sw-resize;width:10px;height:10px;left:0;bottom:0}gridster-item:hover .gridster-item-resizable-handler.handle-se{border-color:transparent transparent #ccc}"]
            }),
            __param(0, core.Inject(core.ElementRef)), __param(2, core.Inject(core.Renderer2)), __param(3, core.Inject(core.NgZone)),
            __metadata("design:paramtypes", [core.ElementRef, GridsterComponent, core.Renderer2, core.NgZone])
        ], GridsterItemComponent);
        return GridsterItemComponent;
    }());

    var GridsterPreviewComponent = /** @class */ (function () {
        function GridsterPreviewComponent(el, gridster, renderer) {
            this.renderer = renderer;
            this.el = el.nativeElement;
            this.gridster = gridster;
            this.gridster.previewStyle = this.previewStyle.bind(this);
        }
        GridsterPreviewComponent.prototype.ngOnDestroy = function () {
            delete this.el;
            delete this.gridster.previewStyle;
            delete this.gridster;
        };
        GridsterPreviewComponent.prototype.previewStyle = function (drag) {
            if (!this.gridster.movingItem) {
                this.renderer.setStyle(this.el, 'display', '');
            }
            else {
                if (this.gridster.compact && drag) {
                    this.gridster.compact.checkCompactItem(this.gridster.movingItem);
                }
                this.renderer.setStyle(this.el, 'display', 'block');
                this.gridster.gridRenderer.updateItem(this.el, this.gridster.movingItem, this.renderer);
            }
        };
        GridsterPreviewComponent.ctorParameters = function () { return [
            { type: core.ElementRef, decorators: [{ type: core.Inject, args: [core.ElementRef,] }] },
            { type: GridsterComponent },
            { type: core.Renderer2, decorators: [{ type: core.Inject, args: [core.Renderer2,] }] }
        ]; };
        GridsterPreviewComponent = __decorate([
            core.Component({
                selector: 'gridster-preview',
                template: '',
                encapsulation: core.ViewEncapsulation.None,
                styles: ["gridster-preview{position:absolute;display:none;background:rgba(0,0,0,.15)}"]
            }),
            __param(0, core.Inject(core.ElementRef)), __param(2, core.Inject(core.Renderer2)),
            __metadata("design:paramtypes", [core.ElementRef, GridsterComponent, core.Renderer2])
        ], GridsterPreviewComponent);
        return GridsterPreviewComponent;
    }());

    var GridsterModule = /** @class */ (function () {
        function GridsterModule() {
        }
        GridsterModule = __decorate([
            core.NgModule({
                declarations: [
                    GridsterComponent,
                    GridsterItemComponent,
                    GridsterPreviewComponent
                ],
                imports: [
                    common.CommonModule
                ],
                exports: [GridsterComponent, GridsterItemComponent],
                providers: [],
                bootstrap: [],
                entryComponents: [GridsterComponent, GridsterItemComponent]
            })
        ], GridsterModule);
        return GridsterModule;
    }());

    exports.GridsterComponent = GridsterComponent;
    exports.GridsterComponentInterface = GridsterComponentInterface;
    exports.GridsterConfigService = GridsterConfigService;
    exports.GridsterItemComponent = GridsterItemComponent;
    exports.GridsterItemComponentInterface = GridsterItemComponentInterface;
    exports.GridsterModule = GridsterModule;
    exports.GridsterPush = GridsterPush;
    exports.GridsterPushResize = GridsterPushResize;
    exports.GridsterSwap = GridsterSwap;
    exports.ɵa = GridsterPreviewComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-gridster2.umd.js.map

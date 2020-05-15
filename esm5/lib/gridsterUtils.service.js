import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
var GridsterUtils = /** @class */ (function () {
    function GridsterUtils() {
    }
    GridsterUtils.merge = function (obj1, obj2, properties) {
        for (var p in obj2) {
            if (obj2[p] !== void 0 && properties.hasOwnProperty(p)) {
                if (typeof obj2[p] === 'object') {
                    obj1[p] = GridsterUtils.merge(obj1[p], obj2[p], properties[p]);
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
            if (!GridsterUtils.checkDragHandleClass(e.target, e.currentTarget, gridster.$options.draggable.dragHandleClass, gridster.$options.draggable.ignoreContentClass)) {
                return true;
            }
        }
        else {
            if (GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.ignoreContentClass)) {
                return true;
            }
        }
        return false;
    };
    GridsterUtils.checkContentClassForEmptyCellClickEvent = function (gridster, e) {
        return GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.ignoreContentClass)
            || GridsterUtils.checkContentClass(e.target, e.currentTarget, gridster.$options.draggable.dragHandleClass);
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
        return GridsterUtils.checkDragHandleClass(target.parentNode, current, dragHandleClass, ignoreContentClass);
    };
    GridsterUtils.checkContentClass = function (target, current, contentClass) {
        if (!target || target === current) {
            return false;
        }
        if (target.hasAttribute('class') && target.getAttribute('class').split(' ').indexOf(contentClass) > -1) {
            return true;
        }
        else {
            return GridsterUtils.checkContentClass(target.parentNode, current, contentClass);
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
    GridsterUtils.ɵfac = function GridsterUtils_Factory(t) { return new (t || GridsterUtils)(); };
    GridsterUtils.ɵprov = i0.ɵɵdefineInjectable({ token: GridsterUtils, factory: GridsterUtils.ɵfac });
    return GridsterUtils;
}());
export { GridsterUtils };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(GridsterUtils, [{
        type: Injectable
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJVdGlscy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1ncmlkc3RlcjIvIiwic291cmNlcyI6WyJsaWIvZ3JpZHN0ZXJVdGlscy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBSXpDO0lBQUE7S0FpR0M7SUE5RlEsbUJBQUssR0FBWixVQUFhLElBQVMsRUFBRSxJQUFTLEVBQUUsVUFBZTtRQUNoRCxLQUFLLElBQU0sQ0FBQyxJQUFJLElBQUksRUFBRTtZQUNwQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN0RCxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtvQkFDL0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDaEU7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbkI7YUFDRjtTQUNGO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sc0JBQVEsR0FBZixVQUFnQixJQUFjLEVBQUUsSUFBWTtRQUMxQyxJQUFJLE9BQVksQ0FBQztRQUNqQixPQUFPO1lBQ0wsSUFBTSxPQUFPLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxTQUFTLENBQUM7WUFDdkMsSUFBTSxLQUFLLEdBQUc7Z0JBQ1osT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDZixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUM7WUFDRixZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEIsT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVNLDZCQUFlLEdBQXRCLFVBQXVCLENBQU07UUFDM0IsSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO1lBQ3hDLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtnQkFDakMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDakMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQzthQUNsQztpQkFBTSxJQUFJLENBQUMsQ0FBQyxjQUFjLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3RELENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7YUFDekM7U0FDRjtJQUNILENBQUM7SUFFTSx1Q0FBeUIsR0FBaEMsVUFBaUMsUUFBb0MsRUFBRSxDQUFNO1FBQzNFLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFO1lBQzdDLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO2dCQUMvSixPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7YUFBTTtZQUNMLElBQUksYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO2dCQUM5RyxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTSxxREFBdUMsR0FBOUMsVUFBK0MsUUFBb0MsRUFBRSxDQUFNO1FBQ3pGLE9BQU8sYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQztlQUM1RyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQy9HLENBQUM7SUFFTSxrQ0FBb0IsR0FBM0IsVUFBNEIsTUFBVyxFQUFFLE9BQVksRUFBRSxlQUF1QixFQUFFLGtCQUFrQjtRQUNoRyxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sS0FBSyxPQUFPLEVBQUU7WUFDakMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRztZQUNqQyxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzRCxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQzVDLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDL0MsT0FBTyxLQUFLLENBQUM7YUFDZDtTQUNGO1FBQ0QsT0FBTyxhQUFhLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixDQUFDLENBQUM7SUFDN0csQ0FBQztJQUNNLCtCQUFpQixHQUF4QixVQUF5QixNQUFXLEVBQUUsT0FBWSxFQUFFLFlBQW9CO1FBQ3RFLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxLQUFLLE9BQU8sRUFBRTtZQUNqQyxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUN0RyxPQUFPLElBQUksQ0FBQztTQUNiO2FBQU07WUFDTCxPQUFPLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztTQUNsRjtJQUNILENBQUM7SUFFTSwwQkFBWSxHQUFuQixVQUFvQixDQUEyQixFQUFFLENBQTJCO1FBQzFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2IsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNYO2FBQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDcEIsT0FBTyxDQUFDLENBQUM7U0FDVjthQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3BCLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDWDthQUFNO1lBQ0wsT0FBTyxDQUFDLENBQUM7U0FDVjtJQUNILENBQUM7OEVBL0ZVLGFBQWE7eURBQWIsYUFBYSxXQUFiLGFBQWE7d0JBTDFCO0NBcUdDLEFBakdELElBaUdDO1NBaEdZLGFBQWE7a0RBQWIsYUFBYTtjQUR6QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHcmlkc3RlckNvbXBvbmVudEludGVyZmFjZX0gZnJvbSAnLi9ncmlkc3Rlci5pbnRlcmZhY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgR3JpZHN0ZXJVdGlscyB7XG5cbiAgc3RhdGljIG1lcmdlKG9iajE6IGFueSwgb2JqMjogYW55LCBwcm9wZXJ0aWVzOiBhbnkpIHtcbiAgICBmb3IgKGNvbnN0IHAgaW4gb2JqMikge1xuICAgICAgaWYgKG9iajJbcF0gIT09IHZvaWQgMCAmJiBwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqMltwXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBvYmoxW3BdID0gR3JpZHN0ZXJVdGlscy5tZXJnZShvYmoxW3BdLCBvYmoyW3BdLCBwcm9wZXJ0aWVzW3BdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvYmoxW3BdID0gb2JqMltwXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmoxO1xuICB9XG5cbiAgc3RhdGljIGRlYm91bmNlKGZ1bmM6IEZ1bmN0aW9uLCB3YWl0OiBudW1iZXIpOiAoKSA9PiB2b2lkIHtcbiAgICBsZXQgdGltZW91dDogYW55O1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGNvbnN0IGxhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH07XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBjaGVja1RvdWNoRXZlbnQoZTogYW55KTogdm9pZCB7XG4gICAgaWYgKGUuY2xpZW50WCA9PT0gdW5kZWZpbmVkICYmIGUudG91Y2hlcykge1xuICAgICAgaWYgKGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICAgIGUuY2xpZW50WCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICBlLmNsaWVudFkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICAgIH0gZWxzZSBpZiAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzLmxlbmd0aCkge1xuICAgICAgICBlLmNsaWVudFggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIGUuY2xpZW50WSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY2hlY2tDb250ZW50Q2xhc3NGb3JFdmVudChncmlkc3RlcjogR3JpZHN0ZXJDb21wb25lbnRJbnRlcmZhY2UsIGU6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmIChncmlkc3Rlci4kb3B0aW9ucy5kcmFnZ2FibGUuaWdub3JlQ29udGVudCkge1xuICAgICAgaWYgKCFHcmlkc3RlclV0aWxzLmNoZWNrRHJhZ0hhbmRsZUNsYXNzKGUudGFyZ2V0LCBlLmN1cnJlbnRUYXJnZXQsIGdyaWRzdGVyLiRvcHRpb25zLmRyYWdnYWJsZS5kcmFnSGFuZGxlQ2xhc3MsIGdyaWRzdGVyLiRvcHRpb25zLmRyYWdnYWJsZS5pZ25vcmVDb250ZW50Q2xhc3MpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoR3JpZHN0ZXJVdGlscy5jaGVja0NvbnRlbnRDbGFzcyhlLnRhcmdldCwgZS5jdXJyZW50VGFyZ2V0LCBncmlkc3Rlci4kb3B0aW9ucy5kcmFnZ2FibGUuaWdub3JlQ29udGVudENsYXNzKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhdGljIGNoZWNrQ29udGVudENsYXNzRm9yRW1wdHlDZWxsQ2xpY2tFdmVudChncmlkc3RlcjogR3JpZHN0ZXJDb21wb25lbnRJbnRlcmZhY2UsIGU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBHcmlkc3RlclV0aWxzLmNoZWNrQ29udGVudENsYXNzKGUudGFyZ2V0LCBlLmN1cnJlbnRUYXJnZXQsIGdyaWRzdGVyLiRvcHRpb25zLmRyYWdnYWJsZS5pZ25vcmVDb250ZW50Q2xhc3MpXG4gICAgICB8fCBHcmlkc3RlclV0aWxzLmNoZWNrQ29udGVudENsYXNzKGUudGFyZ2V0LCBlLmN1cnJlbnRUYXJnZXQsIGdyaWRzdGVyLiRvcHRpb25zLmRyYWdnYWJsZS5kcmFnSGFuZGxlQ2xhc3MpO1xuICB9XG5cbiAgc3RhdGljIGNoZWNrRHJhZ0hhbmRsZUNsYXNzKHRhcmdldDogYW55LCBjdXJyZW50OiBhbnksIGRyYWdIYW5kbGVDbGFzczogc3RyaW5nLCBpZ25vcmVDb250ZW50Q2xhc3MpOiBib29sZWFuIHtcbiAgICBpZiAoIXRhcmdldCB8fCB0YXJnZXQgPT09IGN1cnJlbnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2NsYXNzJykgKSB7XG4gICAgICBjb25zdCBjbGFzc25hbWVzID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKS5zcGxpdCgnICcpO1xuICAgICAgaWYgKGNsYXNzbmFtZXMuaW5kZXhPZihkcmFnSGFuZGxlQ2xhc3MpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoY2xhc3NuYW1lcy5pbmRleE9mKGlnbm9yZUNvbnRlbnRDbGFzcykgPiAtMSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBHcmlkc3RlclV0aWxzLmNoZWNrRHJhZ0hhbmRsZUNsYXNzKHRhcmdldC5wYXJlbnROb2RlLCBjdXJyZW50LCBkcmFnSGFuZGxlQ2xhc3MsIGlnbm9yZUNvbnRlbnRDbGFzcyk7XG4gIH1cbiAgc3RhdGljIGNoZWNrQ29udGVudENsYXNzKHRhcmdldDogYW55LCBjdXJyZW50OiBhbnksIGNvbnRlbnRDbGFzczogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0YXJnZXQgfHwgdGFyZ2V0ID09PSBjdXJyZW50KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0YXJnZXQuaGFzQXR0cmlidXRlKCdjbGFzcycpICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykuc3BsaXQoJyAnKS5pbmRleE9mKGNvbnRlbnRDbGFzcykgPiAtMSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBHcmlkc3RlclV0aWxzLmNoZWNrQ29udGVudENsYXNzKHRhcmdldC5wYXJlbnROb2RlLCBjdXJyZW50LCBjb250ZW50Q2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBjb21wYXJlSXRlbXMoYTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCBiOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pOiBudW1iZXIge1xuICAgIGlmIChhLnkgPiBiLnkpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9IGVsc2UgaWYgKGEueSA8IGIueSkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChhLnggPiBiLngpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICB9XG59XG4iXX0=
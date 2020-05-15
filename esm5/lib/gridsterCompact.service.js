import { Injectable } from '@angular/core';
import { GridsterComponentInterface } from './gridster.interface';
import { CompactType } from './gridsterConfig.interface';
import * as i0 from "@angular/core";
import * as i1 from "./gridster.interface";
var GridsterCompact = /** @class */ (function () {
    function GridsterCompact(gridster) {
        this.gridster = gridster;
    }
    GridsterCompact.prototype.destroy = function () {
        delete this.gridster;
    };
    GridsterCompact.prototype.checkCompact = function () {
        if (this.gridster.$options.compactType !== CompactType.None) {
            if (this.gridster.$options.compactType === CompactType.CompactUp) {
                this.checkCompactUp();
            }
            else if (this.gridster.$options.compactType === CompactType.CompactLeft) {
                this.checkCompactLeft();
            }
            else if (this.gridster.$options.compactType === CompactType.CompactUpAndLeft) {
                this.checkCompactUp();
                this.checkCompactLeft();
            }
            else if (this.gridster.$options.compactType === CompactType.CompactLeftAndUp) {
                this.checkCompactLeft();
                this.checkCompactUp();
            }
            else if (this.gridster.$options.compactType === CompactType.CompactRight) {
                this.checkCompactRight();
            }
            else if (this.gridster.$options.compactType === CompactType.CompactUpAndRight) {
                this.checkCompactUp();
                this.checkCompactRight();
            }
            else if (this.gridster.$options.compactType === CompactType.CompactRightAndUp) {
                this.checkCompactRight();
                this.checkCompactUp();
            }
        }
    };
    GridsterCompact.prototype.checkCompactItem = function (item) {
        if (this.gridster.$options.compactType !== CompactType.None) {
            if (this.gridster.$options.compactType === CompactType.CompactUp) {
                this.moveUpTillCollision(item);
            }
            else if (this.gridster.$options.compactType === CompactType.CompactLeft) {
                this.moveLeftTillCollision(item);
            }
            else if (this.gridster.$options.compactType === CompactType.CompactUpAndLeft) {
                this.moveUpTillCollision(item);
                this.moveLeftTillCollision(item);
            }
            else if (this.gridster.$options.compactType === CompactType.CompactLeftAndUp) {
                this.moveLeftTillCollision(item);
                this.moveUpTillCollision(item);
            }
            else if (this.gridster.$options.compactType === CompactType.CompactUpAndRight) {
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
    GridsterCompact.ɵfac = function GridsterCompact_Factory(t) { return new (t || GridsterCompact)(i0.ɵɵinject(i1.GridsterComponentInterface)); };
    GridsterCompact.ɵprov = i0.ɵɵdefineInjectable({ token: GridsterCompact, factory: GridsterCompact.ɵfac });
    return GridsterCompact;
}());
export { GridsterCompact };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(GridsterCompact, [{
        type: Injectable
    }], function () { return [{ type: i1.GridsterComponentInterface }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJDb21wYWN0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWdyaWRzdGVyMi8iLCJzb3VyY2VzIjpbImxpYi9ncmlkc3RlckNvbXBhY3Quc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR2hFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQzs7O0FBRXZEO0lBR0UseUJBQW9CLFFBQW9DO1FBQXBDLGFBQVEsR0FBUixRQUFRLENBQTRCO0lBQ3hELENBQUM7SUFFRCxpQ0FBTyxHQUFQO1FBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxzQ0FBWSxHQUFaO1FBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLElBQUksRUFBRTtZQUMzRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsU0FBUyxFQUFFO2dCQUNoRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDdkI7aUJBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLFdBQVcsRUFBRTtnQkFDekUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7YUFDekI7aUJBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLGdCQUFnQixFQUFFO2dCQUM5RSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2FBQ3pCO2lCQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDOUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN2QjtpQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsWUFBWSxFQUFFO2dCQUMxRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUMxQjtpQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsaUJBQWlCLEVBQUU7Z0JBQy9FLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDMUI7aUJBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLGlCQUFpQixFQUFFO2dCQUMvRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3ZCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsMENBQWdCLEdBQWhCLFVBQWlCLElBQWtCO1FBQ2pDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxJQUFJLEVBQUU7WUFDM0QsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLFNBQVMsRUFBRTtnQkFDaEUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hDO2lCQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxXQUFXLEVBQUU7Z0JBQ3pFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNsQztpQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQzlFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xDO2lCQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDOUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEM7aUJBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLGlCQUFpQixFQUFFO2dCQUMvRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNuQztTQUNGO0lBQ0gsQ0FBQztJQUVELHdDQUFjLEdBQWQ7UUFDRSxJQUFJLGFBQWEsR0FBRyxLQUFLLEVBQUUsTUFBc0MsRUFBRSxLQUFjLENBQUM7UUFDbEYsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3BDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEtBQUssS0FBSyxFQUFFO2dCQUN6QyxTQUFTO2FBQ1Y7WUFDRCxLQUFLLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQyxJQUFJLEtBQUssRUFBRTtnQkFDVCxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3RCO1NBQ0Y7UUFDRCxJQUFJLGFBQWEsRUFBRTtZQUNqQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRUQsNkNBQW1CLEdBQW5CLFVBQW9CLElBQWtCO1FBQ3BDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN0QyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNaLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7YUFBTTtZQUNMLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQUVELDBDQUFnQixHQUFoQjtRQUNFLElBQUksYUFBYSxHQUFHLEtBQUssRUFBRSxNQUFzQyxFQUFFLEtBQWMsQ0FBQztRQUNsRixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQixNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsS0FBSyxLQUFLLEVBQUU7Z0JBQ3pDLFNBQVM7YUFDVjtZQUNELEtBQUssR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pELElBQUksS0FBSyxFQUFFO2dCQUNULGFBQWEsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDdEI7U0FDRjtRQUNELElBQUksYUFBYSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFRCwyQ0FBaUIsR0FBakI7UUFDRSxJQUFJLGFBQWEsR0FBRyxLQUFLLEVBQUUsTUFBc0MsRUFBRSxLQUFjLENBQUM7UUFDbEYsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3BDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEtBQUssS0FBSyxFQUFFO2dCQUN6QyxTQUFTO2FBQ1Y7WUFDRCxLQUFLLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsRCxJQUFJLEtBQUssRUFBRTtnQkFDVCxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3RCO1NBQ0Y7UUFDRCxJQUFJLGFBQWEsRUFBRTtZQUNqQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRUQsK0NBQXFCLEdBQXJCLFVBQXNCLElBQWtCO1FBQ3RDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN0QyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNaLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7YUFBTTtZQUNMLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQyxPQUFPLElBQUksQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQUVELGdEQUFzQixHQUF0QixVQUF1QixJQUFJO1FBQ3pCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN0QyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNaLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7YUFBTTtZQUNMLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxPQUFPLElBQUksQ0FBQztTQUNiO0lBQ0gsQ0FBQztrRkEvSVUsZUFBZTsyREFBZixlQUFlLFdBQWYsZUFBZTswQkFSNUI7Q0F3SkMsQUFqSkQsSUFpSkM7U0FoSlksZUFBZTtrREFBZixlQUFlO2NBRDNCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dyaWRzdGVyQ29tcG9uZW50SW50ZXJmYWNlfSBmcm9tICcuL2dyaWRzdGVyLmludGVyZmFjZSc7XG5pbXBvcnQge0dyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZX0gZnJvbSAnLi9ncmlkc3Rlckl0ZW1Db21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7R3JpZHN0ZXJJdGVtfSBmcm9tICcuL2dyaWRzdGVySXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHtDb21wYWN0VHlwZX0gZnJvbSAnLi9ncmlkc3RlckNvbmZpZy5pbnRlcmZhY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgR3JpZHN0ZXJDb21wYWN0IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdyaWRzdGVyOiBHcmlkc3RlckNvbXBvbmVudEludGVyZmFjZSkge1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBkZWxldGUgdGhpcy5ncmlkc3RlcjtcbiAgfVxuXG4gIGNoZWNrQ29tcGFjdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5jb21wYWN0VHlwZSAhPT0gQ29tcGFjdFR5cGUuTm9uZSkge1xuICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuY29tcGFjdFR5cGUgPT09IENvbXBhY3RUeXBlLkNvbXBhY3RVcCkge1xuICAgICAgICB0aGlzLmNoZWNrQ29tcGFjdFVwKCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuY29tcGFjdFR5cGUgPT09IENvbXBhY3RUeXBlLkNvbXBhY3RMZWZ0KSB7XG4gICAgICAgIHRoaXMuY2hlY2tDb21wYWN0TGVmdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmNvbXBhY3RUeXBlID09PSBDb21wYWN0VHlwZS5Db21wYWN0VXBBbmRMZWZ0KSB7XG4gICAgICAgIHRoaXMuY2hlY2tDb21wYWN0VXAoKTtcbiAgICAgICAgdGhpcy5jaGVja0NvbXBhY3RMZWZ0KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuY29tcGFjdFR5cGUgPT09IENvbXBhY3RUeXBlLkNvbXBhY3RMZWZ0QW5kVXApIHtcbiAgICAgICAgdGhpcy5jaGVja0NvbXBhY3RMZWZ0KCk7XG4gICAgICAgIHRoaXMuY2hlY2tDb21wYWN0VXAoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5jb21wYWN0VHlwZSA9PT0gQ29tcGFjdFR5cGUuQ29tcGFjdFJpZ2h0KSB7XG4gICAgICAgIHRoaXMuY2hlY2tDb21wYWN0UmlnaHQoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5jb21wYWN0VHlwZSA9PT0gQ29tcGFjdFR5cGUuQ29tcGFjdFVwQW5kUmlnaHQpIHtcbiAgICAgICAgdGhpcy5jaGVja0NvbXBhY3RVcCgpO1xuICAgICAgICB0aGlzLmNoZWNrQ29tcGFjdFJpZ2h0KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuY29tcGFjdFR5cGUgPT09IENvbXBhY3RUeXBlLkNvbXBhY3RSaWdodEFuZFVwKSB7XG4gICAgICAgIHRoaXMuY2hlY2tDb21wYWN0UmlnaHQoKTtcbiAgICAgICAgdGhpcy5jaGVja0NvbXBhY3RVcCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNoZWNrQ29tcGFjdEl0ZW0oaXRlbTogR3JpZHN0ZXJJdGVtKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuY29tcGFjdFR5cGUgIT09IENvbXBhY3RUeXBlLk5vbmUpIHtcbiAgICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmNvbXBhY3RUeXBlID09PSBDb21wYWN0VHlwZS5Db21wYWN0VXApIHtcbiAgICAgICAgdGhpcy5tb3ZlVXBUaWxsQ29sbGlzaW9uKGl0ZW0pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmNvbXBhY3RUeXBlID09PSBDb21wYWN0VHlwZS5Db21wYWN0TGVmdCkge1xuICAgICAgICB0aGlzLm1vdmVMZWZ0VGlsbENvbGxpc2lvbihpdGVtKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5jb21wYWN0VHlwZSA9PT0gQ29tcGFjdFR5cGUuQ29tcGFjdFVwQW5kTGVmdCkge1xuICAgICAgICB0aGlzLm1vdmVVcFRpbGxDb2xsaXNpb24oaXRlbSk7XG4gICAgICAgIHRoaXMubW92ZUxlZnRUaWxsQ29sbGlzaW9uKGl0ZW0pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmNvbXBhY3RUeXBlID09PSBDb21wYWN0VHlwZS5Db21wYWN0TGVmdEFuZFVwKSB7XG4gICAgICAgIHRoaXMubW92ZUxlZnRUaWxsQ29sbGlzaW9uKGl0ZW0pO1xuICAgICAgICB0aGlzLm1vdmVVcFRpbGxDb2xsaXNpb24oaXRlbSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuY29tcGFjdFR5cGUgPT09IENvbXBhY3RUeXBlLkNvbXBhY3RVcEFuZFJpZ2h0KSB7XG4gICAgICAgIHRoaXMubW92ZVVwVGlsbENvbGxpc2lvbihpdGVtKTtcbiAgICAgICAgdGhpcy5tb3ZlUmlnaHRUaWxsQ29sbGlzaW9uKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNoZWNrQ29tcGFjdFVwKCk6IHZvaWQge1xuICAgIGxldCB3aWRnZXRNb3ZlZFVwID0gZmFsc2UsIHdpZGdldDogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlLCBtb3ZlZDogYm9vbGVhbjtcbiAgICBjb25zdCBsID0gdGhpcy5ncmlkc3Rlci5ncmlkLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgd2lkZ2V0ID0gdGhpcy5ncmlkc3Rlci5ncmlkW2ldO1xuICAgICAgaWYgKHdpZGdldC4kaXRlbS5jb21wYWN0RW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBtb3ZlZCA9IHRoaXMubW92ZVVwVGlsbENvbGxpc2lvbih3aWRnZXQuJGl0ZW0pO1xuICAgICAgaWYgKG1vdmVkKSB7XG4gICAgICAgIHdpZGdldE1vdmVkVXAgPSB0cnVlO1xuICAgICAgICB3aWRnZXQuaXRlbS55ID0gd2lkZ2V0LiRpdGVtLnk7XG4gICAgICAgIHdpZGdldC5pdGVtQ2hhbmdlZCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAod2lkZ2V0TW92ZWRVcCkge1xuICAgICAgdGhpcy5jaGVja0NvbXBhY3QoKTtcbiAgICB9XG4gIH1cblxuICBtb3ZlVXBUaWxsQ29sbGlzaW9uKGl0ZW06IEdyaWRzdGVySXRlbSk6IGJvb2xlYW4ge1xuICAgIGl0ZW0ueSAtPSAxO1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLmNoZWNrQ29sbGlzaW9uKGl0ZW0pKSB7XG4gICAgICBpdGVtLnkgKz0gMTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb3ZlVXBUaWxsQ29sbGlzaW9uKGl0ZW0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tDb21wYWN0TGVmdCgpOiB2b2lkIHtcbiAgICBsZXQgd2lkZ2V0TW92ZWRVcCA9IGZhbHNlLCB3aWRnZXQ6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSwgbW92ZWQ6IGJvb2xlYW47XG4gICAgY29uc3QgbCA9IHRoaXMuZ3JpZHN0ZXIuZ3JpZC5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHdpZGdldCA9IHRoaXMuZ3JpZHN0ZXIuZ3JpZFtpXTtcbiAgICAgIGlmICh3aWRnZXQuJGl0ZW0uY29tcGFjdEVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbW92ZWQgPSB0aGlzLm1vdmVMZWZ0VGlsbENvbGxpc2lvbih3aWRnZXQuJGl0ZW0pO1xuICAgICAgaWYgKG1vdmVkKSB7XG4gICAgICAgIHdpZGdldE1vdmVkVXAgPSB0cnVlO1xuICAgICAgICB3aWRnZXQuaXRlbS54ID0gd2lkZ2V0LiRpdGVtLng7XG4gICAgICAgIHdpZGdldC5pdGVtQ2hhbmdlZCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAod2lkZ2V0TW92ZWRVcCkge1xuICAgICAgdGhpcy5jaGVja0NvbXBhY3QoKTtcbiAgICB9XG4gIH1cblxuICBjaGVja0NvbXBhY3RSaWdodCgpOiB2b2lkIHtcbiAgICBsZXQgd2lkZ2V0TW92ZWRVcCA9IGZhbHNlLCB3aWRnZXQ6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSwgbW92ZWQ6IGJvb2xlYW47XG4gICAgY29uc3QgbCA9IHRoaXMuZ3JpZHN0ZXIuZ3JpZC5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHdpZGdldCA9IHRoaXMuZ3JpZHN0ZXIuZ3JpZFtpXTtcbiAgICAgIGlmICh3aWRnZXQuJGl0ZW0uY29tcGFjdEVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbW92ZWQgPSB0aGlzLm1vdmVSaWdodFRpbGxDb2xsaXNpb24od2lkZ2V0LiRpdGVtKTtcbiAgICAgIGlmIChtb3ZlZCkge1xuICAgICAgICB3aWRnZXRNb3ZlZFVwID0gdHJ1ZTtcbiAgICAgICAgd2lkZ2V0Lml0ZW0ueCA9IHdpZGdldC4kaXRlbS54O1xuICAgICAgICB3aWRnZXQuaXRlbUNoYW5nZWQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHdpZGdldE1vdmVkVXApIHtcbiAgICAgIHRoaXMuY2hlY2tDb21wYWN0KCk7XG4gICAgfVxuICB9XG5cbiAgbW92ZUxlZnRUaWxsQ29sbGlzaW9uKGl0ZW06IEdyaWRzdGVySXRlbSk6IGJvb2xlYW4ge1xuICAgIGl0ZW0ueCAtPSAxO1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLmNoZWNrQ29sbGlzaW9uKGl0ZW0pKSB7XG4gICAgICBpdGVtLnggKz0gMTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb3ZlTGVmdFRpbGxDb2xsaXNpb24oaXRlbSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBtb3ZlUmlnaHRUaWxsQ29sbGlzaW9uKGl0ZW0pIHtcbiAgICBpdGVtLnggKz0gMTtcbiAgICBpZiAodGhpcy5ncmlkc3Rlci5jaGVja0NvbGxpc2lvbihpdGVtKSkge1xuICAgICAgaXRlbS54IC09IDE7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW92ZVJpZ2h0VGlsbENvbGxpc2lvbihpdGVtKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxufVxuIl19
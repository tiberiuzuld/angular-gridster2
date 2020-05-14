import { Injectable } from '@angular/core';
import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
import * as i0 from "@angular/core";
import * as i1 from "./gridsterItemComponent.interface";
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
    GridsterSwap.ɵfac = function GridsterSwap_Factory(t) { return new (t || GridsterSwap)(i0.ɵɵinject(i1.GridsterItemComponentInterface)); };
    GridsterSwap.ɵprov = i0.ɵɵdefineInjectable({ token: GridsterSwap, factory: GridsterSwap.ɵfac });
    return GridsterSwap;
}());
export { GridsterSwap };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(GridsterSwap, [{
        type: Injectable
    }], function () { return [{ type: i1.GridsterItemComponentInterface }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJTd2FwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWdyaWRzdGVyMi8iLCJzb3VyY2VzIjpbImxpYi9ncmlkc3RlclN3YXAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQyw4QkFBOEIsRUFBQyxNQUFNLG1DQUFtQyxDQUFDOzs7QUFHakY7SUFNRSxzQkFBWSxZQUE0QztRQUN0RCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDeEMsQ0FBQztJQUVELDhCQUFPLEdBQVA7UUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRUQsZ0NBQVMsR0FBVDtRQUNFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQy9CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRCxvQ0FBYSxHQUFiO1FBQ0UsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMxQyxJQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7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WTtrREFBWixZQUFZO2NBRHhCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZX0gZnJvbSAnLi9ncmlkc3Rlckl0ZW1Db21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7R3JpZHN0ZXJDb21wb25lbnRJbnRlcmZhY2V9IGZyb20gJy4vZ3JpZHN0ZXIuaW50ZXJmYWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEdyaWRzdGVyU3dhcCB7XG4gIHByaXZhdGUgc3dhcGVkSXRlbTogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIGdyaWRzdGVySXRlbTogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlO1xuICBwcml2YXRlIGdyaWRzdGVyOiBHcmlkc3RlckNvbXBvbmVudEludGVyZmFjZTtcblxuICBjb25zdHJ1Y3Rvcihncmlkc3Rlckl0ZW06IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSkge1xuICAgIHRoaXMuZ3JpZHN0ZXJJdGVtID0gZ3JpZHN0ZXJJdGVtO1xuICAgIHRoaXMuZ3JpZHN0ZXIgPSBncmlkc3Rlckl0ZW0uZ3JpZHN0ZXI7XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIGRlbGV0ZSB0aGlzLmdyaWRzdGVyO1xuICAgIGRlbGV0ZSB0aGlzLmdyaWRzdGVySXRlbTtcbiAgICBkZWxldGUgdGhpcy5zd2FwZWRJdGVtO1xuICB9XG5cbiAgc3dhcEl0ZW1zKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLnN3YXApIHtcbiAgICAgIHRoaXMuY2hlY2tTd2FwQmFjaygpO1xuICAgICAgdGhpcy5jaGVja1N3YXAodGhpcy5ncmlkc3Rlckl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrU3dhcEJhY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3dhcGVkSXRlbSkge1xuICAgICAgY29uc3QgeDogbnVtYmVyID0gdGhpcy5zd2FwZWRJdGVtLiRpdGVtLng7XG4gICAgICBjb25zdCB5OiBudW1iZXIgPSB0aGlzLnN3YXBlZEl0ZW0uJGl0ZW0ueTtcbiAgICAgIHRoaXMuc3dhcGVkSXRlbS4kaXRlbS54ID0gdGhpcy5zd2FwZWRJdGVtLml0ZW0ueCB8fCAwO1xuICAgICAgdGhpcy5zd2FwZWRJdGVtLiRpdGVtLnkgPSB0aGlzLnN3YXBlZEl0ZW0uaXRlbS55IHx8IDA7XG4gICAgICBpZiAodGhpcy5ncmlkc3Rlci5jaGVja0NvbGxpc2lvbih0aGlzLnN3YXBlZEl0ZW0uJGl0ZW0pKSB7XG4gICAgICAgIHRoaXMuc3dhcGVkSXRlbS4kaXRlbS54ID0geDtcbiAgICAgICAgdGhpcy5zd2FwZWRJdGVtLiRpdGVtLnkgPSB5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zd2FwZWRJdGVtLnNldFNpemUoKTtcbiAgICAgICAgdGhpcy5ncmlkc3Rlckl0ZW0uJGl0ZW0ueCA9IHRoaXMuZ3JpZHN0ZXJJdGVtLml0ZW0ueCB8fCAwO1xuICAgICAgICB0aGlzLmdyaWRzdGVySXRlbS4kaXRlbS55ID0gdGhpcy5ncmlkc3Rlckl0ZW0uaXRlbS55IHx8IDA7XG4gICAgICAgIHRoaXMuc3dhcGVkSXRlbSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH1cbiAgfVxuXG4gIHJlc3RvcmVTd2FwSXRlbSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zd2FwZWRJdGVtKSB7XG4gICAgICB0aGlzLnN3YXBlZEl0ZW0uJGl0ZW0ueCA9IHRoaXMuc3dhcGVkSXRlbS5pdGVtLnggfHwgMDtcbiAgICAgIHRoaXMuc3dhcGVkSXRlbS4kaXRlbS55ID0gdGhpcy5zd2FwZWRJdGVtLml0ZW0ueSB8fCAwO1xuICAgICAgdGhpcy5zd2FwZWRJdGVtLnNldFNpemUoKTtcbiAgICAgIHRoaXMuc3dhcGVkSXRlbSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBzZXRTd2FwSXRlbSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zd2FwZWRJdGVtKSB7XG4gICAgICB0aGlzLnN3YXBlZEl0ZW0uY2hlY2tJdGVtQ2hhbmdlcyh0aGlzLnN3YXBlZEl0ZW0uJGl0ZW0sIHRoaXMuc3dhcGVkSXRlbS5pdGVtKTtcbiAgICAgIHRoaXMuc3dhcGVkSXRlbSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBjaGVja1N3YXAocHVzaGVkQnk6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSk6IHZvaWQge1xuICAgIGxldCBncmlkc3Rlckl0ZW1Db2xsaXNpb247XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuc3dhcFdoaWxlRHJhZ2dpbmcpIHtcbiAgICAgIGdyaWRzdGVySXRlbUNvbGxpc2lvbiA9IHRoaXMuZ3JpZHN0ZXIuY2hlY2tDb2xsaXNpb25Gb3JTd2FwaW5nKHB1c2hlZEJ5LiRpdGVtKTtcbiAgICB9ZWxzZXtcbiAgICAgIGdyaWRzdGVySXRlbUNvbGxpc2lvbiA9IHRoaXMuZ3JpZHN0ZXIuY2hlY2tDb2xsaXNpb24ocHVzaGVkQnkuJGl0ZW0pO1xuICAgIH1cbiAgICBpZiAoZ3JpZHN0ZXJJdGVtQ29sbGlzaW9uICYmIGdyaWRzdGVySXRlbUNvbGxpc2lvbiAhPT0gdHJ1ZSAmJiBncmlkc3Rlckl0ZW1Db2xsaXNpb24uY2FuQmVEcmFnZ2VkKCkpIHtcbiAgICAgIGNvbnN0IGdyaWRzdGVySXRlbUNvbGxpZGU6IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSA9IGdyaWRzdGVySXRlbUNvbGxpc2lvbjtcbiAgICAgIGNvbnN0IGNvcHlDb2xsaXNpb25YID0gZ3JpZHN0ZXJJdGVtQ29sbGlkZS4kaXRlbS54O1xuICAgICAgY29uc3QgY29weUNvbGxpc2lvblkgPSBncmlkc3Rlckl0ZW1Db2xsaWRlLiRpdGVtLnk7XG4gICAgICBjb25zdCBjb3B5WCA9IHB1c2hlZEJ5LiRpdGVtLng7XG4gICAgICBjb25zdCBjb3B5WSA9IHB1c2hlZEJ5LiRpdGVtLnk7XG4gICAgICBncmlkc3Rlckl0ZW1Db2xsaWRlLiRpdGVtLnggPSBwdXNoZWRCeS5pdGVtLnggfHwgMDtcbiAgICAgIGdyaWRzdGVySXRlbUNvbGxpZGUuJGl0ZW0ueSA9IHB1c2hlZEJ5Lml0ZW0ueSB8fCAwO1xuICAgICAgcHVzaGVkQnkuJGl0ZW0ueCA9IGdyaWRzdGVySXRlbUNvbGxpZGUuaXRlbS54IHx8IDA7XG4gICAgICBwdXNoZWRCeS4kaXRlbS55ID0gZ3JpZHN0ZXJJdGVtQ29sbGlkZS5pdGVtLnkgfHwgMDtcbiAgICAgIGlmICh0aGlzLmdyaWRzdGVyLmNoZWNrQ29sbGlzaW9uKGdyaWRzdGVySXRlbUNvbGxpZGUuJGl0ZW0pIHx8IHRoaXMuZ3JpZHN0ZXIuY2hlY2tDb2xsaXNpb24ocHVzaGVkQnkuJGl0ZW0pKSB7XG4gICAgICAgIHB1c2hlZEJ5LiRpdGVtLnggPSBjb3B5WDtcbiAgICAgICAgcHVzaGVkQnkuJGl0ZW0ueSA9IGNvcHlZO1xuICAgICAgICBncmlkc3Rlckl0ZW1Db2xsaWRlLiRpdGVtLnggPSBjb3B5Q29sbGlzaW9uWDtcbiAgICAgICAgZ3JpZHN0ZXJJdGVtQ29sbGlkZS4kaXRlbS55ID0gY29weUNvbGxpc2lvblk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBncmlkc3Rlckl0ZW1Db2xsaWRlLnNldFNpemUoKTtcbiAgICAgICAgdGhpcy5zd2FwZWRJdGVtID0gZ3JpZHN0ZXJJdGVtQ29sbGlkZTtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuc3dhcFdoaWxlRHJhZ2dpbmcpIHtcbiAgICAgICAgICB0aGlzLmdyaWRzdGVySXRlbS5jaGVja0l0ZW1DaGFuZ2VzKHRoaXMuZ3JpZHN0ZXJJdGVtLiRpdGVtLCB0aGlzLmdyaWRzdGVySXRlbS5pdGVtKTtcbiAgICAgICAgICB0aGlzLnNldFN3YXBJdGVtKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
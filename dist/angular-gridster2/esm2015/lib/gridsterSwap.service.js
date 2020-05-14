import { Injectable } from '@angular/core';
import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
import * as i0 from "@angular/core";
import * as i1 from "./gridsterItemComponent.interface";
export class GridsterSwap {
    constructor(gridsterItem) {
        this.gridsterItem = gridsterItem;
        this.gridster = gridsterItem.gridster;
    }
    destroy() {
        delete this.gridster;
        delete this.gridsterItem;
        delete this.swapedItem;
    }
    swapItems() {
        if (this.gridster.$options.swap) {
            this.checkSwapBack();
            this.checkSwap(this.gridsterItem);
        }
    }
    checkSwapBack() {
        if (this.swapedItem) {
            const x = this.swapedItem.$item.x;
            const y = this.swapedItem.$item.y;
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
    }
    restoreSwapItem() {
        if (this.swapedItem) {
            this.swapedItem.$item.x = this.swapedItem.item.x || 0;
            this.swapedItem.$item.y = this.swapedItem.item.y || 0;
            this.swapedItem.setSize();
            this.swapedItem = undefined;
        }
    }
    setSwapItem() {
        if (this.swapedItem) {
            this.swapedItem.checkItemChanges(this.swapedItem.$item, this.swapedItem.item);
            this.swapedItem = undefined;
        }
    }
    checkSwap(pushedBy) {
        let gridsterItemCollision;
        if (this.gridster.$options.swapWhileDragging) {
            gridsterItemCollision = this.gridster.checkCollisionForSwaping(pushedBy.$item);
        }
        else {
            gridsterItemCollision = this.gridster.checkCollision(pushedBy.$item);
        }
        if (gridsterItemCollision && gridsterItemCollision !== true && gridsterItemCollision.canBeDragged()) {
            const gridsterItemCollide = gridsterItemCollision;
            const copyCollisionX = gridsterItemCollide.$item.x;
            const copyCollisionY = gridsterItemCollide.$item.y;
            const copyX = pushedBy.$item.x;
            const copyY = pushedBy.$item.y;
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
    }
}
GridsterSwap.ɵfac = function GridsterSwap_Factory(t) { return new (t || GridsterSwap)(i0.ɵɵinject(i1.GridsterItemComponentInterface)); };
GridsterSwap.ɵprov = i0.ɵɵdefineInjectable({ token: GridsterSwap, factory: GridsterSwap.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(GridsterSwap, [{
        type: Injectable
    }], function () { return [{ type: i1.GridsterItemComponentInterface }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJTd2FwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWdyaWRzdGVyMi8iLCJzb3VyY2VzIjpbImxpYi9ncmlkc3RlclN3YXAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQyw4QkFBOEIsRUFBQyxNQUFNLG1DQUFtQyxDQUFDOzs7QUFJakYsTUFBTSxPQUFPLFlBQVk7SUFLdkIsWUFBWSxZQUE0QztRQUN0RCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDeEMsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQy9CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFD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Y3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2V9IGZyb20gJy4vZ3JpZHN0ZXJJdGVtQ29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQge0dyaWRzdGVyQ29tcG9uZW50SW50ZXJmYWNlfSBmcm9tICcuL2dyaWRzdGVyLmludGVyZmFjZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBHcmlkc3RlclN3YXAge1xuICBwcml2YXRlIHN3YXBlZEl0ZW06IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBncmlkc3Rlckl0ZW06IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZTtcbiAgcHJpdmF0ZSBncmlkc3RlcjogR3JpZHN0ZXJDb21wb25lbnRJbnRlcmZhY2U7XG5cbiAgY29uc3RydWN0b3IoZ3JpZHN0ZXJJdGVtOiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UpIHtcbiAgICB0aGlzLmdyaWRzdGVySXRlbSA9IGdyaWRzdGVySXRlbTtcbiAgICB0aGlzLmdyaWRzdGVyID0gZ3JpZHN0ZXJJdGVtLmdyaWRzdGVyO1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBkZWxldGUgdGhpcy5ncmlkc3RlcjtcbiAgICBkZWxldGUgdGhpcy5ncmlkc3Rlckl0ZW07XG4gICAgZGVsZXRlIHRoaXMuc3dhcGVkSXRlbTtcbiAgfVxuXG4gIHN3YXBJdGVtcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5zd2FwKSB7XG4gICAgICB0aGlzLmNoZWNrU3dhcEJhY2soKTtcbiAgICAgIHRoaXMuY2hlY2tTd2FwKHRoaXMuZ3JpZHN0ZXJJdGVtKTtcbiAgICB9XG4gIH1cblxuICBjaGVja1N3YXBCYWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN3YXBlZEl0ZW0pIHtcbiAgICAgIGNvbnN0IHg6IG51bWJlciA9IHRoaXMuc3dhcGVkSXRlbS4kaXRlbS54O1xuICAgICAgY29uc3QgeTogbnVtYmVyID0gdGhpcy5zd2FwZWRJdGVtLiRpdGVtLnk7XG4gICAgICB0aGlzLnN3YXBlZEl0ZW0uJGl0ZW0ueCA9IHRoaXMuc3dhcGVkSXRlbS5pdGVtLnggfHwgMDtcbiAgICAgIHRoaXMuc3dhcGVkSXRlbS4kaXRlbS55ID0gdGhpcy5zd2FwZWRJdGVtLml0ZW0ueSB8fCAwO1xuICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIuY2hlY2tDb2xsaXNpb24odGhpcy5zd2FwZWRJdGVtLiRpdGVtKSkge1xuICAgICAgICB0aGlzLnN3YXBlZEl0ZW0uJGl0ZW0ueCA9IHg7XG4gICAgICAgIHRoaXMuc3dhcGVkSXRlbS4kaXRlbS55ID0geTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3dhcGVkSXRlbS5zZXRTaXplKCk7XG4gICAgICAgIHRoaXMuZ3JpZHN0ZXJJdGVtLiRpdGVtLnggPSB0aGlzLmdyaWRzdGVySXRlbS5pdGVtLnggfHwgMDtcbiAgICAgICAgdGhpcy5ncmlkc3Rlckl0ZW0uJGl0ZW0ueSA9IHRoaXMuZ3JpZHN0ZXJJdGVtLml0ZW0ueSB8fCAwO1xuICAgICAgICB0aGlzLnN3YXBlZEl0ZW0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9XG4gIH1cblxuICByZXN0b3JlU3dhcEl0ZW0oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3dhcGVkSXRlbSkge1xuICAgICAgdGhpcy5zd2FwZWRJdGVtLiRpdGVtLnggPSB0aGlzLnN3YXBlZEl0ZW0uaXRlbS54IHx8IDA7XG4gICAgICB0aGlzLnN3YXBlZEl0ZW0uJGl0ZW0ueSA9IHRoaXMuc3dhcGVkSXRlbS5pdGVtLnkgfHwgMDtcbiAgICAgIHRoaXMuc3dhcGVkSXRlbS5zZXRTaXplKCk7XG4gICAgICB0aGlzLnN3YXBlZEl0ZW0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgc2V0U3dhcEl0ZW0oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3dhcGVkSXRlbSkge1xuICAgICAgdGhpcy5zd2FwZWRJdGVtLmNoZWNrSXRlbUNoYW5nZXModGhpcy5zd2FwZWRJdGVtLiRpdGVtLCB0aGlzLnN3YXBlZEl0ZW0uaXRlbSk7XG4gICAgICB0aGlzLnN3YXBlZEl0ZW0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tTd2FwKHB1c2hlZEJ5OiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICBsZXQgZ3JpZHN0ZXJJdGVtQ29sbGlzaW9uO1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLnN3YXBXaGlsZURyYWdnaW5nKSB7XG4gICAgICBncmlkc3Rlckl0ZW1Db2xsaXNpb24gPSB0aGlzLmdyaWRzdGVyLmNoZWNrQ29sbGlzaW9uRm9yU3dhcGluZyhwdXNoZWRCeS4kaXRlbSk7XG4gICAgfWVsc2V7XG4gICAgICBncmlkc3Rlckl0ZW1Db2xsaXNpb24gPSB0aGlzLmdyaWRzdGVyLmNoZWNrQ29sbGlzaW9uKHB1c2hlZEJ5LiRpdGVtKTtcbiAgICB9XG4gICAgaWYgKGdyaWRzdGVySXRlbUNvbGxpc2lvbiAmJiBncmlkc3Rlckl0ZW1Db2xsaXNpb24gIT09IHRydWUgJiYgZ3JpZHN0ZXJJdGVtQ29sbGlzaW9uLmNhbkJlRHJhZ2dlZCgpKSB7XG4gICAgICBjb25zdCBncmlkc3Rlckl0ZW1Db2xsaWRlOiBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2UgPSBncmlkc3Rlckl0ZW1Db2xsaXNpb247XG4gICAgICBjb25zdCBjb3B5Q29sbGlzaW9uWCA9IGdyaWRzdGVySXRlbUNvbGxpZGUuJGl0ZW0ueDtcbiAgICAgIGNvbnN0IGNvcHlDb2xsaXNpb25ZID0gZ3JpZHN0ZXJJdGVtQ29sbGlkZS4kaXRlbS55O1xuICAgICAgY29uc3QgY29weVggPSBwdXNoZWRCeS4kaXRlbS54O1xuICAgICAgY29uc3QgY29weVkgPSBwdXNoZWRCeS4kaXRlbS55O1xuICAgICAgZ3JpZHN0ZXJJdGVtQ29sbGlkZS4kaXRlbS54ID0gcHVzaGVkQnkuaXRlbS54IHx8IDA7XG4gICAgICBncmlkc3Rlckl0ZW1Db2xsaWRlLiRpdGVtLnkgPSBwdXNoZWRCeS5pdGVtLnkgfHwgMDtcbiAgICAgIHB1c2hlZEJ5LiRpdGVtLnggPSBncmlkc3Rlckl0ZW1Db2xsaWRlLml0ZW0ueCB8fCAwO1xuICAgICAgcHVzaGVkQnkuJGl0ZW0ueSA9IGdyaWRzdGVySXRlbUNvbGxpZGUuaXRlbS55IHx8IDA7XG4gICAgICBpZiAodGhpcy5ncmlkc3Rlci5jaGVja0NvbGxpc2lvbihncmlkc3Rlckl0ZW1Db2xsaWRlLiRpdGVtKSB8fCB0aGlzLmdyaWRzdGVyLmNoZWNrQ29sbGlzaW9uKHB1c2hlZEJ5LiRpdGVtKSkge1xuICAgICAgICBwdXNoZWRCeS4kaXRlbS54ID0gY29weVg7XG4gICAgICAgIHB1c2hlZEJ5LiRpdGVtLnkgPSBjb3B5WTtcbiAgICAgICAgZ3JpZHN0ZXJJdGVtQ29sbGlkZS4kaXRlbS54ID0gY29weUNvbGxpc2lvblg7XG4gICAgICAgIGdyaWRzdGVySXRlbUNvbGxpZGUuJGl0ZW0ueSA9IGNvcHlDb2xsaXNpb25ZO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ3JpZHN0ZXJJdGVtQ29sbGlkZS5zZXRTaXplKCk7XG4gICAgICAgIHRoaXMuc3dhcGVkSXRlbSA9IGdyaWRzdGVySXRlbUNvbGxpZGU7XG4gICAgICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLnN3YXBXaGlsZURyYWdnaW5nKSB7XG4gICAgICAgICAgdGhpcy5ncmlkc3Rlckl0ZW0uY2hlY2tJdGVtQ2hhbmdlcyh0aGlzLmdyaWRzdGVySXRlbS4kaXRlbSwgdGhpcy5ncmlkc3Rlckl0ZW0uaXRlbSk7XG4gICAgICAgICAgdGhpcy5zZXRTd2FwSXRlbSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=
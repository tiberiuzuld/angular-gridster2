import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { GridsterUtils } from './gridsterUtils.service';
import { GridsterComponentInterface } from './gridster.interface';
let GridsterEmptyCell = class GridsterEmptyCell {
    constructor(gridster) {
        this.gridster = gridster;
    }
    destroy() {
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
    }
    updateOptions() {
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
            this.gridster.zone.runOutsideAngular(() => {
                this.emptyCellMove = this.gridster.renderer.listen(this.gridster.el, 'dragover', this.emptyCellDragOver.bind(this));
            });
            this.emptyCellExit = this.gridster.renderer.listen('document', 'dragend', () => {
                this.gridster.movingItem = null;
                this.gridster.previewStyle();
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
    }
    emptyCellClickCb(e) {
        if (this.gridster.movingItem || GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
            return;
        }
        const item = this.getValidItemFromEvent(e);
        if (!item) {
            return;
        }
        if (this.gridster.options.emptyCellClickCallback) {
            this.gridster.options.emptyCellClickCallback(e, item);
        }
        this.gridster.cdRef.markForCheck();
    }
    emptyCellContextMenuCb(e) {
        if (this.gridster.movingItem || GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const item = this.getValidItemFromEvent(e);
        if (!item) {
            return;
        }
        if (this.gridster.options.emptyCellContextMenuCallback) {
            this.gridster.options.emptyCellContextMenuCallback(e, item);
        }
        this.gridster.cdRef.markForCheck();
    }
    emptyCellDragDrop(e) {
        const item = this.getValidItemFromEvent(e);
        if (!item) {
            return;
        }
        if (this.gridster.options.emptyCellDropCallback) {
            this.gridster.options.emptyCellDropCallback(e, item);
        }
        this.gridster.cdRef.markForCheck();
    }
    emptyCellDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        const item = this.getValidItemFromEvent(e);
        if (item) {
            e.dataTransfer.dropEffect = 'move';
            this.gridster.movingItem = item;
        }
        else {
            e.dataTransfer.dropEffect = 'none';
            this.gridster.movingItem = null;
        }
        this.gridster.previewStyle();
    }
    emptyCellMouseDown(e) {
        if (GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const item = this.getValidItemFromEvent(e);
        const leftMouseButtonCode = 1;
        if (!item || e.buttons !== leftMouseButtonCode) {
            return;
        }
        this.initialItem = item;
        this.gridster.movingItem = item;
        this.gridster.previewStyle();
        this.gridster.zone.runOutsideAngular(() => {
            this.emptyCellMMove = this.gridster.renderer.listen('window', 'mousemove', this.emptyCellMouseMove.bind(this));
            this.emptyCellMMoveTouch = this.gridster.renderer.listen('window', 'touchmove', this.emptyCellMouseMove.bind(this));
        });
        this.emptyCellUp = this.gridster.renderer.listen('window', 'mouseup', this.emptyCellMouseUp.bind(this));
        this.emptyCellUpTouch = this.gridster.renderer.listen('window', 'touchend', this.emptyCellMouseUp.bind(this));
    }
    emptyCellMouseMove(e) {
        e.preventDefault();
        e.stopPropagation();
        const item = this.getValidItemFromEvent(e, this.initialItem);
        if (!item) {
            return;
        }
        this.gridster.movingItem = item;
        this.gridster.previewStyle();
    }
    emptyCellMouseUp(e) {
        this.emptyCellMMove();
        this.emptyCellMMoveTouch();
        this.emptyCellUp();
        this.emptyCellUpTouch();
        const item = this.getValidItemFromEvent(e, this.initialItem);
        if (item) {
            this.gridster.movingItem = item;
        }
        if (this.gridster.options.emptyCellDragCallback && this.gridster.movingItem) {
            this.gridster.options.emptyCellDragCallback(e, this.gridster.movingItem);
        }
        setTimeout(() => {
            this.initialItem = null;
            if (this.gridster) {
                this.gridster.movingItem = null;
                this.gridster.previewStyle();
            }
        });
        this.gridster.cdRef.markForCheck();
    }
    getValidItemFromEvent(e, oldItem) {
        e.preventDefault();
        e.stopPropagation();
        GridsterUtils.checkTouchEvent(e);
        const rect = this.gridster.el.getBoundingClientRect();
        const x = e.clientX + this.gridster.el.scrollLeft - rect.left - this.gridster.gridRenderer.getLeftMargin();
        const y = e.clientY + this.gridster.el.scrollTop - rect.top - this.gridster.gridRenderer.getTopMargin();
        const item = {
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
    }
};
GridsterEmptyCell.ctorParameters = () => [
    { type: GridsterComponentInterface }
];
GridsterEmptyCell = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [GridsterComponentInterface])
], GridsterEmptyCell);
export { GridsterEmptyCell };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJFbXB0eUNlbGwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ3JpZHN0ZXIyLyIsInNvdXJjZXMiOlsibGliL2dyaWRzdGVyRW1wdHlDZWxsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRXRELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR2hFLElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWlCO0lBZTVCLFlBQW9CLFFBQW9DO1FBQXBDLGFBQVEsR0FBUixRQUFRLENBQTRCO0lBQ3hELENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7UUFDaEMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTtZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3JCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFO1lBQ3ZILElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxR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RyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLG9CQUFvQixHQUFHLENBQUMsRUFBRTtnQkFDL0UsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDcEU7U0FDRjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4RixPQUFPO1NBQ1I7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRixDQUFBOztZQTVNK0IsMEJBQTBCOztBQWY3QyxpQkFBaUI7SUFEN0IsVUFBVSxFQUFFO3FDQWdCbUIsMEJBQTBCO0dBZjdDLGlCQUFpQixDQTJON0I7U0EzTlksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHcmlkc3RlclV0aWxzfSBmcm9tICcuL2dyaWRzdGVyVXRpbHMuc2VydmljZSc7XG5pbXBvcnQge0dyaWRzdGVySXRlbX0gZnJvbSAnLi9ncmlkc3Rlckl0ZW0uaW50ZXJmYWNlJztcbmltcG9ydCB7R3JpZHN0ZXJDb21wb25lbnRJbnRlcmZhY2V9IGZyb20gJy4vZ3JpZHN0ZXIuaW50ZXJmYWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEdyaWRzdGVyRW1wdHlDZWxsIHtcbiAgaW5pdGlhbEl0ZW06IEdyaWRzdGVySXRlbSB8IG51bGw7XG4gIGVtcHR5Q2VsbENsaWNrOiBGdW5jdGlvbiB8IG51bGw7XG4gIGVtcHR5Q2VsbENsaWNrVG91Y2g6IEZ1bmN0aW9uIHwgbnVsbDtcbiAgZW1wdHlDZWxsQ29udGV4dE1lbnU6IEZ1bmN0aW9uIHwgbnVsbDtcbiAgZW1wdHlDZWxsRHJvcDogRnVuY3Rpb24gfCBudWxsO1xuICBlbXB0eUNlbGxEcmFnOiBGdW5jdGlvbiB8IG51bGw7XG4gIGVtcHR5Q2VsbERyYWdUb3VjaDogRnVuY3Rpb24gfCBudWxsO1xuICBlbXB0eUNlbGxNTW92ZTogRnVuY3Rpb247XG4gIGVtcHR5Q2VsbE1Nb3ZlVG91Y2g6IEZ1bmN0aW9uO1xuICBlbXB0eUNlbGxVcDogRnVuY3Rpb247XG4gIGVtcHR5Q2VsbFVwVG91Y2g6IEZ1bmN0aW9uO1xuICBlbXB0eUNlbGxNb3ZlOiBGdW5jdGlvbiB8IG51bGw7XG4gIGVtcHR5Q2VsbEV4aXQ6IEZ1bmN0aW9uIHwgbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdyaWRzdGVyOiBHcmlkc3RlckNvbXBvbmVudEludGVyZmFjZSkge1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBkZWxldGUgdGhpcy5pbml0aWFsSXRlbTtcbiAgICBkZWxldGUgdGhpcy5ncmlkc3Rlci5tb3ZpbmdJdGVtO1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLnByZXZpZXdTdHlsZSkge1xuICAgICAgdGhpcy5ncmlkc3Rlci5wcmV2aWV3U3R5bGUoKTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuZ3JpZHN0ZXI7XG4gICAgaWYgKHRoaXMuZW1wdHlDZWxsRXhpdCkge1xuICAgICAgdGhpcy5lbXB0eUNlbGxFeGl0KCk7XG4gICAgICB0aGlzLmVtcHR5Q2VsbEV4aXQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU9wdGlvbnMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZW5hYmxlRW1wdHlDZWxsQ2xpY2sgJiYgIXRoaXMuZW1wdHlDZWxsQ2xpY2sgJiYgdGhpcy5ncmlkc3Rlci5vcHRpb25zLmVtcHR5Q2VsbENsaWNrQ2FsbGJhY2spIHtcbiAgICAgIHRoaXMuZW1wdHlDZWxsQ2xpY2sgPSB0aGlzLmdyaWRzdGVyLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmdyaWRzdGVyLmVsLCAnY2xpY2snLCB0aGlzLmVtcHR5Q2VsbENsaWNrQ2IuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmVtcHR5Q2VsbENsaWNrVG91Y2ggPSB0aGlzLmdyaWRzdGVyLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmdyaWRzdGVyLmVsLCAndG91Y2hlbmQnLCB0aGlzLmVtcHR5Q2VsbENsaWNrQ2IuYmluZCh0aGlzKSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5lbmFibGVFbXB0eUNlbGxDbGljayAmJiB0aGlzLmVtcHR5Q2VsbENsaWNrICYmIHRoaXMuZW1wdHlDZWxsQ2xpY2tUb3VjaCkge1xuICAgICAgdGhpcy5lbXB0eUNlbGxDbGljaygpO1xuICAgICAgdGhpcy5lbXB0eUNlbGxDbGlja1RvdWNoKCk7XG4gICAgICB0aGlzLmVtcHR5Q2VsbENsaWNrID0gbnVsbDtcbiAgICAgIHRoaXMuZW1wdHlDZWxsQ2xpY2tUb3VjaCA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmVuYWJsZUVtcHR5Q2VsbENvbnRleHRNZW51ICYmICF0aGlzLmVtcHR5Q2VsbENvbnRleHRNZW51ICYmXG4gICAgICB0aGlzLmdyaWRzdGVyLm9wdGlvbnMuZW1wdHlDZWxsQ29udGV4dE1lbnVDYWxsYmFjaykge1xuICAgICAgdGhpcy5lbXB0eUNlbGxDb250ZXh0TWVudSA9IHRoaXMuZ3JpZHN0ZXIucmVuZGVyZXIubGlzdGVuKHRoaXMuZ3JpZHN0ZXIuZWwsICdjb250ZXh0bWVudScsIHRoaXMuZW1wdHlDZWxsQ29udGV4dE1lbnVDYi5iaW5kKHRoaXMpKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmVuYWJsZUVtcHR5Q2VsbENvbnRleHRNZW51ICYmIHRoaXMuZW1wdHlDZWxsQ29udGV4dE1lbnUpIHtcbiAgICAgIHRoaXMuZW1wdHlDZWxsQ29udGV4dE1lbnUoKTtcbiAgICAgIHRoaXMuZW1wdHlDZWxsQ29udGV4dE1lbnUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5lbmFibGVFbXB0eUNlbGxEcm9wICYmICF0aGlzLmVtcHR5Q2VsbERyb3AgJiYgdGhpcy5ncmlkc3Rlci5vcHRpb25zLmVtcHR5Q2VsbERyb3BDYWxsYmFjaykge1xuICAgICAgdGhpcy5lbXB0eUNlbGxEcm9wID0gdGhpcy5ncmlkc3Rlci5yZW5kZXJlci5saXN0ZW4odGhpcy5ncmlkc3Rlci5lbCwgJ2Ryb3AnLCB0aGlzLmVtcHR5Q2VsbERyYWdEcm9wLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5ncmlkc3Rlci56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgdGhpcy5lbXB0eUNlbGxNb3ZlID0gdGhpcy5ncmlkc3Rlci5yZW5kZXJlci5saXN0ZW4odGhpcy5ncmlkc3Rlci5lbCwgJ2RyYWdvdmVyJywgdGhpcy5lbXB0eUNlbGxEcmFnT3Zlci5iaW5kKHRoaXMpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5lbXB0eUNlbGxFeGl0ID0gdGhpcy5ncmlkc3Rlci5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ2RyYWdlbmQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbSA9IG51bGw7XG4gICAgICAgIHRoaXMuZ3JpZHN0ZXIucHJldmlld1N0eWxlKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmVuYWJsZUVtcHR5Q2VsbERyb3AgJiYgdGhpcy5lbXB0eUNlbGxEcm9wICYmIHRoaXMuZW1wdHlDZWxsTW92ZSAmJiB0aGlzLmVtcHR5Q2VsbEV4aXQpIHtcbiAgICAgIHRoaXMuZW1wdHlDZWxsRHJvcCgpO1xuICAgICAgdGhpcy5lbXB0eUNlbGxNb3ZlKCk7XG4gICAgICB0aGlzLmVtcHR5Q2VsbEV4aXQoKTtcbiAgICAgIHRoaXMuZW1wdHlDZWxsTW92ZSA9IG51bGw7XG4gICAgICB0aGlzLmVtcHR5Q2VsbERyb3AgPSBudWxsO1xuICAgICAgdGhpcy5lbXB0eUNlbGxFeGl0ID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZW5hYmxlRW1wdHlDZWxsRHJhZyAmJiAhdGhpcy5lbXB0eUNlbGxEcmFnICYmIHRoaXMuZ3JpZHN0ZXIub3B0aW9ucy5lbXB0eUNlbGxEcmFnQ2FsbGJhY2spIHtcbiAgICAgIHRoaXMuZW1wdHlDZWxsRHJhZyA9IHRoaXMuZ3JpZHN0ZXIucmVuZGVyZXIubGlzdGVuKHRoaXMuZ3JpZHN0ZXIuZWwsICdtb3VzZWRvd24nLCB0aGlzLmVtcHR5Q2VsbE1vdXNlRG93bi5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZW1wdHlDZWxsRHJhZ1RvdWNoID0gdGhpcy5ncmlkc3Rlci5yZW5kZXJlci5saXN0ZW4odGhpcy5ncmlkc3Rlci5lbCwgJ3RvdWNoc3RhcnQnLCB0aGlzLmVtcHR5Q2VsbE1vdXNlRG93bi5iaW5kKHRoaXMpKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmVuYWJsZUVtcHR5Q2VsbERyYWcgJiYgdGhpcy5lbXB0eUNlbGxEcmFnICYmIHRoaXMuZW1wdHlDZWxsRHJhZ1RvdWNoKSB7XG4gICAgICB0aGlzLmVtcHR5Q2VsbERyYWcoKTtcbiAgICAgIHRoaXMuZW1wdHlDZWxsRHJhZ1RvdWNoKCk7XG4gICAgICB0aGlzLmVtcHR5Q2VsbERyYWcgPSBudWxsO1xuICAgICAgdGhpcy5lbXB0eUNlbGxEcmFnVG91Y2ggPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGVtcHR5Q2VsbENsaWNrQ2IoZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbSB8fCBHcmlkc3RlclV0aWxzLmNoZWNrQ29udGVudENsYXNzRm9yRW1wdHlDZWxsQ2xpY2tFdmVudCh0aGlzLmdyaWRzdGVyLCBlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpdGVtID0gdGhpcy5nZXRWYWxpZEl0ZW1Gcm9tRXZlbnQoZSk7XG4gICAgaWYgKCFpdGVtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLmdyaWRzdGVyLm9wdGlvbnMuZW1wdHlDZWxsQ2xpY2tDYWxsYmFjaykge1xuICAgICAgdGhpcy5ncmlkc3Rlci5vcHRpb25zLmVtcHR5Q2VsbENsaWNrQ2FsbGJhY2soZSwgaXRlbSk7XG4gICAgfVxuICAgIHRoaXMuZ3JpZHN0ZXIuY2RSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBlbXB0eUNlbGxDb250ZXh0TWVudUNiKGU6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0gfHwgR3JpZHN0ZXJVdGlscy5jaGVja0NvbnRlbnRDbGFzc0ZvckVtcHR5Q2VsbENsaWNrRXZlbnQodGhpcy5ncmlkc3RlciwgZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuZ2V0VmFsaWRJdGVtRnJvbUV2ZW50KGUpO1xuICAgIGlmICghaXRlbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5ncmlkc3Rlci5vcHRpb25zLmVtcHR5Q2VsbENvbnRleHRNZW51Q2FsbGJhY2spIHtcbiAgICAgIHRoaXMuZ3JpZHN0ZXIub3B0aW9ucy5lbXB0eUNlbGxDb250ZXh0TWVudUNhbGxiYWNrKGUsIGl0ZW0pO1xuICAgIH1cbiAgICB0aGlzLmdyaWRzdGVyLmNkUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZW1wdHlDZWxsRHJhZ0Ryb3AoZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuZ2V0VmFsaWRJdGVtRnJvbUV2ZW50KGUpO1xuICAgIGlmICghaXRlbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5ncmlkc3Rlci5vcHRpb25zLmVtcHR5Q2VsbERyb3BDYWxsYmFjaykge1xuICAgICAgdGhpcy5ncmlkc3Rlci5vcHRpb25zLmVtcHR5Q2VsbERyb3BDYWxsYmFjayhlLCBpdGVtKTtcbiAgICB9XG4gICAgdGhpcy5ncmlkc3Rlci5jZFJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGVtcHR5Q2VsbERyYWdPdmVyKGU6IGFueSk6IHZvaWQge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmdldFZhbGlkSXRlbUZyb21FdmVudChlKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgIHRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbSA9IGl0ZW07XG4gICAgfSBlbHNlIHtcbiAgICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnbm9uZSc7XG4gICAgICB0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0gPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLmdyaWRzdGVyLnByZXZpZXdTdHlsZSgpO1xuICB9XG5cbiAgZW1wdHlDZWxsTW91c2VEb3duKGU6IGFueSk6IHZvaWQge1xuICAgIGlmIChHcmlkc3RlclV0aWxzLmNoZWNrQ29udGVudENsYXNzRm9yRW1wdHlDZWxsQ2xpY2tFdmVudCh0aGlzLmdyaWRzdGVyLCBlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5nZXRWYWxpZEl0ZW1Gcm9tRXZlbnQoZSk7XG4gICAgY29uc3QgbGVmdE1vdXNlQnV0dG9uQ29kZSA9IDE7XG4gICAgaWYgKCFpdGVtIHx8IGUuYnV0dG9ucyAhPT0gbGVmdE1vdXNlQnV0dG9uQ29kZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmluaXRpYWxJdGVtID0gaXRlbTtcbiAgICB0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0gPSBpdGVtO1xuICAgIHRoaXMuZ3JpZHN0ZXIucHJldmlld1N0eWxlKCk7XG4gICAgdGhpcy5ncmlkc3Rlci56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuZW1wdHlDZWxsTU1vdmUgPSB0aGlzLmdyaWRzdGVyLnJlbmRlcmVyLmxpc3Rlbignd2luZG93JywgJ21vdXNlbW92ZScsIHRoaXMuZW1wdHlDZWxsTW91c2VNb3ZlLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5lbXB0eUNlbGxNTW92ZVRvdWNoID0gdGhpcy5ncmlkc3Rlci5yZW5kZXJlci5saXN0ZW4oJ3dpbmRvdycsICd0b3VjaG1vdmUnLCB0aGlzLmVtcHR5Q2VsbE1vdXNlTW92ZS5iaW5kKHRoaXMpKTtcbiAgICB9KTtcbiAgICB0aGlzLmVtcHR5Q2VsbFVwID0gdGhpcy5ncmlkc3Rlci5yZW5kZXJlci5saXN0ZW4oJ3dpbmRvdycsICdtb3VzZXVwJywgdGhpcy5lbXB0eUNlbGxNb3VzZVVwLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZW1wdHlDZWxsVXBUb3VjaCA9IHRoaXMuZ3JpZHN0ZXIucmVuZGVyZXIubGlzdGVuKCd3aW5kb3cnLCAndG91Y2hlbmQnLCB0aGlzLmVtcHR5Q2VsbE1vdXNlVXAuYmluZCh0aGlzKSk7XG4gIH1cblxuICBlbXB0eUNlbGxNb3VzZU1vdmUoZTogYW55KTogdm9pZCB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuZ2V0VmFsaWRJdGVtRnJvbUV2ZW50KGUsIHRoaXMuaW5pdGlhbEl0ZW0pO1xuICAgIGlmICghaXRlbSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbSA9IGl0ZW07XG4gICAgdGhpcy5ncmlkc3Rlci5wcmV2aWV3U3R5bGUoKTtcbiAgfVxuXG4gIGVtcHR5Q2VsbE1vdXNlVXAoZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5lbXB0eUNlbGxNTW92ZSgpO1xuICAgIHRoaXMuZW1wdHlDZWxsTU1vdmVUb3VjaCgpO1xuICAgIHRoaXMuZW1wdHlDZWxsVXAoKTtcbiAgICB0aGlzLmVtcHR5Q2VsbFVwVG91Y2goKTtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5nZXRWYWxpZEl0ZW1Gcm9tRXZlbnQoZSwgdGhpcy5pbml0aWFsSXRlbSk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIHRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbSA9IGl0ZW07XG4gICAgfVxuICAgIGlmICh0aGlzLmdyaWRzdGVyLm9wdGlvbnMuZW1wdHlDZWxsRHJhZ0NhbGxiYWNrICYmIHRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbSkge1xuICAgICAgdGhpcy5ncmlkc3Rlci5vcHRpb25zLmVtcHR5Q2VsbERyYWdDYWxsYmFjayhlLCB0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0pO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaW5pdGlhbEl0ZW0gPSBudWxsO1xuICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIpIHtcbiAgICAgICAgdGhpcy5ncmlkc3Rlci5tb3ZpbmdJdGVtID0gbnVsbDtcbiAgICAgICAgdGhpcy5ncmlkc3Rlci5wcmV2aWV3U3R5bGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmdyaWRzdGVyLmNkUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgZ2V0VmFsaWRJdGVtRnJvbUV2ZW50KGU6IGFueSwgb2xkSXRlbT86IEdyaWRzdGVySXRlbSB8IG51bGwpOiBHcmlkc3Rlckl0ZW0gfCB1bmRlZmluZWQge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIEdyaWRzdGVyVXRpbHMuY2hlY2tUb3VjaEV2ZW50KGUpO1xuICAgIGNvbnN0IHJlY3QgPSB0aGlzLmdyaWRzdGVyLmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHggPSBlLmNsaWVudFggKyB0aGlzLmdyaWRzdGVyLmVsLnNjcm9sbExlZnQgLSByZWN0LmxlZnQgLSB0aGlzLmdyaWRzdGVyLmdyaWRSZW5kZXJlci5nZXRMZWZ0TWFyZ2luKCk7XG4gICAgY29uc3QgeSA9IGUuY2xpZW50WSArIHRoaXMuZ3JpZHN0ZXIuZWwuc2Nyb2xsVG9wIC0gcmVjdC50b3AgLSB0aGlzLmdyaWRzdGVyLmdyaWRSZW5kZXJlci5nZXRUb3BNYXJnaW4oKTtcbiAgICBjb25zdCBpdGVtOiBHcmlkc3Rlckl0ZW0gPSB7XG4gICAgICB4OiB0aGlzLmdyaWRzdGVyLnBpeGVsc1RvUG9zaXRpb25YKHgsIE1hdGguZmxvb3IsIHRydWUpLFxuICAgICAgeTogdGhpcy5ncmlkc3Rlci5waXhlbHNUb1Bvc2l0aW9uWSh5LCBNYXRoLmZsb29yLCB0cnVlKSxcbiAgICAgIGNvbHM6IHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZGVmYXVsdEl0ZW1Db2xzLFxuICAgICAgcm93czogdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5kZWZhdWx0SXRlbVJvd3NcbiAgICB9O1xuICAgIGlmIChvbGRJdGVtKSB7XG4gICAgICBpdGVtLmNvbHMgPSBNYXRoLm1pbihNYXRoLmFicyhvbGRJdGVtLnggLSBpdGVtLngpICsgMSwgdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5lbXB0eUNlbGxEcmFnTWF4Q29scyk7XG4gICAgICBpdGVtLnJvd3MgPSBNYXRoLm1pbihNYXRoLmFicyhvbGRJdGVtLnkgLSBpdGVtLnkpICsgMSwgdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5lbXB0eUNlbGxEcmFnTWF4Um93cyk7XG4gICAgICBpZiAob2xkSXRlbS54IDwgaXRlbS54KSB7XG4gICAgICAgIGl0ZW0ueCA9IG9sZEl0ZW0ueDtcbiAgICAgIH0gZWxzZSBpZiAob2xkSXRlbS54IC0gaXRlbS54ID4gdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5lbXB0eUNlbGxEcmFnTWF4Q29scyAtIDEpIHtcbiAgICAgICAgaXRlbS54ID0gdGhpcy5ncmlkc3Rlci5tb3ZpbmdJdGVtID8gdGhpcy5ncmlkc3Rlci5tb3ZpbmdJdGVtLnggOiAwO1xuICAgICAgfVxuICAgICAgaWYgKG9sZEl0ZW0ueSA8IGl0ZW0ueSkge1xuICAgICAgICBpdGVtLnkgPSBvbGRJdGVtLnk7XG4gICAgICB9IGVsc2UgaWYgKG9sZEl0ZW0ueSAtIGl0ZW0ueSA+IHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZW1wdHlDZWxsRHJhZ01heFJvd3MgLSAxKSB7XG4gICAgICAgIGl0ZW0ueSA9IHRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbSA/IHRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbS55IDogMDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmVuYWJsZU9jY3VwaWVkQ2VsbERyb3AgJiYgdGhpcy5ncmlkc3Rlci5jaGVja0NvbGxpc2lvbihpdGVtKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gaXRlbTtcbiAgfVxufVxuIl19
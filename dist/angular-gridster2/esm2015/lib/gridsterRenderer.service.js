import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { GridsterComponentInterface } from './gridster.interface';
import { DirTypes, GridType } from './gridsterConfig.interface';
let GridsterRenderer = class GridsterRenderer {
    constructor(gridster) {
        this.gridster = gridster;
    }
    destroy() {
        delete this.gridster;
    }
    updateItem(el, item, renderer) {
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
            const x = Math.round(this.gridster.curColWidth * item.x);
            const y = Math.round(this.gridster.curRowHeight * item.y);
            const width = this.gridster.curColWidth * item.cols - this.gridster.$options.margin;
            const height = (this.gridster.curRowHeight * item.rows - this.gridster.$options.margin);
            // set the cell style
            this.setCellPosition(renderer, el, x, y);
            renderer.setStyle(el, 'width', width + 'px');
            renderer.setStyle(el, 'height', height + 'px');
            let marginBottom = null;
            let marginRight = null;
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
    }
    updateGridster() {
        let addClass = '';
        let removeClass1 = '';
        let removeClass2 = '';
        let removeClass3 = '';
        if (this.gridster.$options.gridType === GridType.Fit) {
            addClass = GridType.Fit;
            removeClass1 = GridType.ScrollVertical;
            removeClass2 = GridType.ScrollHorizontal;
            removeClass3 = GridType.Fixed;
        }
        else if (this.gridster.$options.gridType === GridType.ScrollVertical) {
            this.gridster.curRowHeight = this.gridster.curColWidth;
            addClass = GridType.ScrollVertical;
            removeClass1 = GridType.Fit;
            removeClass2 = GridType.ScrollHorizontal;
            removeClass3 = GridType.Fixed;
        }
        else if (this.gridster.$options.gridType === GridType.ScrollHorizontal) {
            this.gridster.curColWidth = this.gridster.curRowHeight;
            addClass = GridType.ScrollHorizontal;
            removeClass1 = GridType.Fit;
            removeClass2 = GridType.ScrollVertical;
            removeClass3 = GridType.Fixed;
        }
        else if (this.gridster.$options.gridType === GridType.Fixed) {
            this.gridster.curColWidth = this.gridster.$options.fixedColWidth +
                (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
            this.gridster.curRowHeight = this.gridster.$options.fixedRowHeight +
                (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
            addClass = GridType.Fixed;
            removeClass1 = GridType.Fit;
            removeClass2 = GridType.ScrollVertical;
            removeClass3 = GridType.ScrollHorizontal;
        }
        else if (this.gridster.$options.gridType === GridType.VerticalFixed) {
            this.gridster.curRowHeight = this.gridster.$options.fixedRowHeight +
                (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
            addClass = GridType.ScrollVertical;
            removeClass1 = GridType.Fit;
            removeClass2 = GridType.ScrollHorizontal;
            removeClass3 = GridType.Fixed;
        }
        else if (this.gridster.$options.gridType === GridType.HorizontalFixed) {
            this.gridster.curColWidth = this.gridster.$options.fixedColWidth +
                (this.gridster.$options.ignoreMarginInRow ? 0 : this.gridster.$options.margin);
            addClass = GridType.ScrollHorizontal;
            removeClass1 = GridType.Fit;
            removeClass2 = GridType.ScrollVertical;
            removeClass3 = GridType.Fixed;
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
    }
    getGridColumnStyle(i) {
        return Object.assign(Object.assign({}, this.getLeftPosition(this.gridster.curColWidth * i)), { width: this.gridster.curColWidth - this.gridster.$options.margin + 'px', height: this.gridster.gridRows.length * this.gridster.curRowHeight - this.gridster.$options.margin + 'px' });
    }
    getGridRowStyle(i) {
        return Object.assign(Object.assign({}, this.getTopPosition(this.gridster.curRowHeight * i)), { width: this.gridster.gridColumns.length * this.gridster.curColWidth - this.gridster.$options.margin + 'px', height: this.gridster.curRowHeight - this.gridster.$options.margin + 'px' });
    }
    getLeftPosition(d) {
        const dPosition = this.gridster.$options.dirType === DirTypes.RTL ? -d : d;
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
    }
    getTopPosition(d) {
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
    }
    clearCellPosition(renderer, el) {
        if (this.gridster.$options.useTransformPositioning) {
            renderer.setStyle(el, 'transform', '');
        }
        else {
            renderer.setStyle(el, 'top', '');
            renderer.setStyle(el, 'left', '');
        }
    }
    setCellPosition(renderer, el, x, y) {
        const xPosition = this.gridster.$options.dirType === DirTypes.RTL ? -x : x;
        if (this.gridster.$options.useTransformPositioning) {
            const transform = 'translate3d(' + xPosition + 'px, ' + y + 'px, 0)';
            renderer.setStyle(el, 'transform', transform);
        }
        else {
            renderer.setStyle(el, 'left', this.getLeftMargin() + xPosition + 'px');
            renderer.setStyle(el, 'top', this.getTopMargin() + y + 'px');
        }
    }
    getLeftMargin() {
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
    }
    getTopMargin() {
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
    }
};
GridsterRenderer.ctorParameters = () => [
    { type: GridsterComponentInterface }
];
GridsterRenderer = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [GridsterComponentInterface])
], GridsterRenderer);
export { GridsterRenderer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJSZW5kZXJlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1ncmlkc3RlcjIvIiwic291cmNlcyI6WyJsaWIvZ3JpZHN0ZXJSZW5kZXJlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBRXBELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFJOUQsSUFBYSxnQkFBZ0IsR0FBN0IsTUFBYSxnQkFBZ0I7SUFFM0IsWUFBb0IsUUFBb0M7UUFBcEMsYUFBUSxHQUFSLFFBQVEsQ0FBNEI7SUFDeEQsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELFVBQVUsQ0FBQyxFQUFPLEVBQUUsSUFBa0IsRUFBRSxRQUFtQjtRQUN6RCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDckMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDbEQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUM3RjtpQkFBTTtnQkFDTCxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJ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QkFDTCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzthQUN0QztTQUNGO2FBQU07WUFDTCxPQUFPLENBQUMsQ0FBQztTQUNWO0lBQ0gsQ0FBQztJQUVELFlBQVk7UUFDVixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtZQUN0QyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGNBQWMsS0FBSyxJQUFJLEVBQUU7Z0JBQ2xELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO2FBQzlDO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2FBQ3RDO1NBQ0Y7YUFBTTtZQUNMLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7SUFDSCxDQUFDO0NBQ0YsQ0FBQTs7WUFyTStCLDBCQUEwQjs7QUFGN0MsZ0JBQWdCO0lBRDVCLFVBQVUsRUFBRTtxQ0FHbUIsMEJBQTBCO0dBRjdDLGdCQUFnQixDQXVNNUI7U0F2TVksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlLCBSZW5kZXJlcjJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0dyaWRzdGVyQ29tcG9uZW50SW50ZXJmYWNlfSBmcm9tICcuL2dyaWRzdGVyLmludGVyZmFjZSc7XG5pbXBvcnQge0RpclR5cGVzLCBHcmlkVHlwZX0gZnJvbSAnLi9ncmlkc3RlckNvbmZpZy5pbnRlcmZhY2UnO1xuaW1wb3J0IHtHcmlkc3Rlckl0ZW19IGZyb20gJy4vZ3JpZHN0ZXJJdGVtLmludGVyZmFjZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBHcmlkc3RlclJlbmRlcmVyIHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdyaWRzdGVyOiBHcmlkc3RlckNvbXBvbmVudEludGVyZmFjZSkge1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBkZWxldGUgdGhpcy5ncmlkc3RlcjtcbiAgfVxuXG4gIHVwZGF0ZUl0ZW0oZWw6IGFueSwgaXRlbTogR3JpZHN0ZXJJdGVtLCByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIubW9iaWxlKSB7XG4gICAgICB0aGlzLmNsZWFyQ2VsbFBvc2l0aW9uKHJlbmRlcmVyLCBlbCk7XG4gICAgICBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5rZWVwRml4ZWRIZWlnaHRJbk1vYmlsZSkge1xuICAgICAgICByZW5kZXJlci5zZXRTdHlsZShlbCwgJ2hlaWdodCcsIChpdGVtLnJvd3MgKiB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmZpeGVkUm93SGVpZ2h0KSArICdweCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoZWwsICdoZWlnaHQnLCAoaXRlbS5yb3dzICogdGhpcy5ncmlkc3Rlci5jdXJXaWR0aCAvIGl0ZW0uY29scykgKyAncHgnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmtlZXBGaXhlZFdpZHRoSW5Nb2JpbGUpIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoZWwsICd3aWR0aCcsIHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZml4ZWRDb2xXaWR0aCArICdweCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoZWwsICd3aWR0aCcsICcnKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoZWwsICdtYXJnaW4tYm90dG9tJywgdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5tYXJnaW4gKyAncHgnKTtcbiAgICAgIHJlbmRlcmVyLnNldFN0eWxlKGVsLCAnbWFyZ2luLXJpZ2h0JywgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB4ID0gTWF0aC5yb3VuZCh0aGlzLmdyaWRzdGVyLmN1ckNvbFdpZHRoICogaXRlbS54KTtcbiAgICAgIGNvbnN0IHkgPSBNYXRoLnJvdW5kKHRoaXMuZ3JpZHN0ZXIuY3VyUm93SGVpZ2h0ICogaXRlbS55KTtcbiAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5ncmlkc3Rlci5jdXJDb2xXaWR0aCAqIGl0ZW0uY29scyAtIHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMubWFyZ2luO1xuICAgICAgY29uc3QgaGVpZ2h0ID0gKHRoaXMuZ3JpZHN0ZXIuY3VyUm93SGVpZ2h0ICogaXRlbS5yb3dzIC0gdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5tYXJnaW4pO1xuICAgICAgLy8gc2V0IHRoZSBjZWxsIHN0eWxlXG4gICAgICB0aGlzLnNldENlbGxQb3NpdGlvbihyZW5kZXJlciwgZWwsIHgsIHkpO1xuICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoZWwsICd3aWR0aCcsIHdpZHRoICsgJ3B4Jyk7XG4gICAgICByZW5kZXJlci5zZXRTdHlsZShlbCwgJ2hlaWdodCcsIGhlaWdodCArICdweCcpO1xuICAgICAgbGV0IG1hcmdpbkJvdHRvbTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgICBsZXQgbWFyZ2luUmlnaHQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMub3V0ZXJNYXJnaW4pIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIucm93cyA9PT0gaXRlbS5yb3dzICsgaXRlbS55KSB7XG4gICAgICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMub3V0ZXJNYXJnaW5Cb3R0b20gIT09IG51bGwpIHtcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbSA9IHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMub3V0ZXJNYXJnaW5Cb3R0b20gKyAncHgnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXJnaW5Cb3R0b20gPSB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm1hcmdpbiArICdweCc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdyaWRzdGVyLmNvbHVtbnMgPT09IGl0ZW0uY29scyArIGl0ZW0ueCkge1xuICAgICAgICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm91dGVyTWFyZ2luQm90dG9tICE9PSBudWxsKSB7XG4gICAgICAgICAgICBtYXJnaW5SaWdodCA9IHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMub3V0ZXJNYXJnaW5SaWdodCArICdweCc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hcmdpblJpZ2h0ID0gdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5tYXJnaW4gKyAncHgnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zZXRTdHlsZShlbCwgJ21hcmdpbi1ib3R0b20nLCBtYXJnaW5Cb3R0b20pO1xuICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoZWwsICdtYXJnaW4tcmlnaHQnLCBtYXJnaW5SaWdodCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlR3JpZHN0ZXIoKSB7XG4gICAgbGV0IGFkZENsYXNzID0gJyc7XG4gICAgbGV0IHJlbW92ZUNsYXNzMSA9ICcnO1xuICAgIGxldCByZW1vdmVDbGFzczIgPSAnJztcbiAgICBsZXQgcmVtb3ZlQ2xhc3MzID0gJyc7XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZ3JpZFR5cGUgPT09IEdyaWRUeXBlLkZpdCkge1xuICAgICAgYWRkQ2xhc3MgPSBHcmlkVHlwZS5GaXQ7XG4gICAgICByZW1vdmVDbGFzczEgPSBHcmlkVHlwZS5TY3JvbGxWZXJ0aWNhbDtcbiAgICAgIHJlbW92ZUNsYXNzMiA9IEdyaWRUeXBlLlNjcm9sbEhvcml6b250YWw7XG4gICAgICByZW1vdmVDbGFzczMgPSBHcmlkVHlwZS5GaXhlZDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZ3JpZFR5cGUgPT09IEdyaWRUeXBlLlNjcm9sbFZlcnRpY2FsKSB7XG4gICAgICB0aGlzLmdyaWRzdGVyLmN1clJvd0hlaWdodCA9IHRoaXMuZ3JpZHN0ZXIuY3VyQ29sV2lkdGg7XG4gICAgICBhZGRDbGFzcyA9IEdyaWRUeXBlLlNjcm9sbFZlcnRpY2FsO1xuICAgICAgcmVtb3ZlQ2xhc3MxID0gR3JpZFR5cGUuRml0O1xuICAgICAgcmVtb3ZlQ2xhc3MyID0gR3JpZFR5cGUuU2Nyb2xsSG9yaXpvbnRhbDtcbiAgICAgIHJlbW92ZUNsYXNzMyA9IEdyaWRUeXBlLkZpeGVkO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5ncmlkVHlwZSA9PT0gR3JpZFR5cGUuU2Nyb2xsSG9yaXpvbnRhbCkge1xuICAgICAgdGhpcy5ncmlkc3Rlci5jdXJDb2xXaWR0aCA9IHRoaXMuZ3JpZHN0ZXIuY3VyUm93SGVpZ2h0O1xuICAgICAgYWRkQ2xhc3MgPSBHcmlkVHlwZS5TY3JvbGxIb3Jpem9udGFsO1xuICAgICAgcmVtb3ZlQ2xhc3MxID0gR3JpZFR5cGUuRml0O1xuICAgICAgcmVtb3ZlQ2xhc3MyID0gR3JpZFR5cGUuU2Nyb2xsVmVydGljYWw7XG4gICAgICByZW1vdmVDbGFzczMgPSBHcmlkVHlwZS5GaXhlZDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZ3JpZFR5cGUgPT09IEdyaWRUeXBlLkZpeGVkKSB7XG4gICAgICB0aGlzLmdyaWRzdGVyLmN1ckNvbFdpZHRoID0gdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5maXhlZENvbFdpZHRoICtcbiAgICAgICAgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuaWdub3JlTWFyZ2luSW5Sb3cgPyAwIDogdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5tYXJnaW4pO1xuICAgICAgdGhpcy5ncmlkc3Rlci5jdXJSb3dIZWlnaHQgPSB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmZpeGVkUm93SGVpZ2h0ICtcbiAgICAgICAgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuaWdub3JlTWFyZ2luSW5Sb3cgPyAwIDogdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5tYXJnaW4pO1xuICAgICAgYWRkQ2xhc3MgPSBHcmlkVHlwZS5GaXhlZDtcbiAgICAgIHJlbW92ZUNsYXNzMSA9IEdyaWRUeXBlLkZpdDtcbiAgICAgIHJlbW92ZUNsYXNzMiA9IEdyaWRUeXBlLlNjcm9sbFZlcnRpY2FsO1xuICAgICAgcmVtb3ZlQ2xhc3MzID0gR3JpZFR5cGUuU2Nyb2xsSG9yaXpvbnRhbDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZ3JpZFR5cGUgPT09IEdyaWRUeXBlLlZlcnRpY2FsRml4ZWQpIHtcbiAgICAgIHRoaXMuZ3JpZHN0ZXIuY3VyUm93SGVpZ2h0ID0gdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5maXhlZFJvd0hlaWdodCArXG4gICAgICAgICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmlnbm9yZU1hcmdpbkluUm93ID8gMCA6IHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMubWFyZ2luKTtcbiAgICAgIGFkZENsYXNzID0gR3JpZFR5cGUuU2Nyb2xsVmVydGljYWw7XG4gICAgICByZW1vdmVDbGFzczEgPSBHcmlkVHlwZS5GaXQ7XG4gICAgICByZW1vdmVDbGFzczIgPSBHcmlkVHlwZS5TY3JvbGxIb3Jpem9udGFsO1xuICAgICAgcmVtb3ZlQ2xhc3MzID0gR3JpZFR5cGUuRml4ZWQ7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmdyaWRUeXBlID09PSBHcmlkVHlwZS5Ib3Jpem9udGFsRml4ZWQpIHtcbiAgICAgIHRoaXMuZ3JpZHN0ZXIuY3VyQ29sV2lkdGggPSB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmZpeGVkQ29sV2lkdGggK1xuICAgICAgICAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5pZ25vcmVNYXJnaW5JblJvdyA/IDAgOiB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm1hcmdpbik7XG4gICAgICBhZGRDbGFzcyA9IEdyaWRUeXBlLlNjcm9sbEhvcml6b250YWw7XG4gICAgICByZW1vdmVDbGFzczEgPSBHcmlkVHlwZS5GaXQ7XG4gICAgICByZW1vdmVDbGFzczIgPSBHcmlkVHlwZS5TY3JvbGxWZXJ0aWNhbDtcbiAgICAgIHJlbW92ZUNsYXNzMyA9IEdyaWRUeXBlLkZpeGVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmdyaWRzdGVyLm1vYmlsZSkge1xuICAgICAgdGhpcy5ncmlkc3Rlci5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmdyaWRzdGVyLmVsLCBhZGRDbGFzcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZ3JpZHN0ZXIucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5ncmlkc3Rlci5lbCwgYWRkQ2xhc3MpO1xuICAgIH1cbiAgICB0aGlzLmdyaWRzdGVyLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZ3JpZHN0ZXIuZWwsIHJlbW92ZUNsYXNzMSk7XG4gICAgdGhpcy5ncmlkc3Rlci5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmdyaWRzdGVyLmVsLCByZW1vdmVDbGFzczIpO1xuICAgIHRoaXMuZ3JpZHN0ZXIucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5ncmlkc3Rlci5lbCwgcmVtb3ZlQ2xhc3MzKTtcbiAgfVxuXG4gIGdldEdyaWRDb2x1bW5TdHlsZShpOiBudW1iZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5nZXRMZWZ0UG9zaXRpb24odGhpcy5ncmlkc3Rlci5jdXJDb2xXaWR0aCAqIGkpLFxuICAgICAgd2lkdGg6IHRoaXMuZ3JpZHN0ZXIuY3VyQ29sV2lkdGggLSB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm1hcmdpbiArICdweCcsXG4gICAgICBoZWlnaHQ6IHRoaXMuZ3JpZHN0ZXIuZ3JpZFJvd3MubGVuZ3RoICogdGhpcy5ncmlkc3Rlci5jdXJSb3dIZWlnaHQgLSB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm1hcmdpbiArICdweCdcbiAgICB9O1xuICB9XG5cbiAgZ2V0R3JpZFJvd1N0eWxlKGk6IG51bWJlcikge1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmdldFRvcFBvc2l0aW9uKHRoaXMuZ3JpZHN0ZXIuY3VyUm93SGVpZ2h0ICogaSksXG4gICAgICB3aWR0aDogdGhpcy5ncmlkc3Rlci5ncmlkQ29sdW1ucy5sZW5ndGggKiB0aGlzLmdyaWRzdGVyLmN1ckNvbFdpZHRoIC0gdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5tYXJnaW4gKyAncHgnLFxuICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRzdGVyLmN1clJvd0hlaWdodCAtIHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMubWFyZ2luICsgJ3B4J1xuICAgIH07XG4gIH1cblxuICBnZXRMZWZ0UG9zaXRpb24oZDogbnVtYmVyKTogeyBsZWZ0Pzogc3RyaW5nLCB0cmFuc2Zvcm0/OiBzdHJpbmcgfSB7XG4gICAgY29uc3QgZFBvc2l0aW9uID0gdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5kaXJUeXBlID09PSBEaXJUeXBlcy5SVEwgPyAtZCA6IGQ7XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMudXNlVHJhbnNmb3JtUG9zaXRpb25pbmcpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoJyArIGRQb3NpdGlvbiArICdweCknLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGVmdDogKHRoaXMuZ2V0TGVmdE1hcmdpbigpICsgZFBvc2l0aW9uKSArICdweCdcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZ2V0VG9wUG9zaXRpb24oZDogbnVtYmVyKTogeyB0b3A/OiBzdHJpbmcsIHRyYW5zZm9ybT86IHN0cmluZyB9IHtcbiAgICBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy51c2VUcmFuc2Zvcm1Qb3NpdGlvbmluZykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgnICsgZCArICdweCknLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiB0aGlzLmdldFRvcE1hcmdpbigpICsgZCArICdweCdcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgY2xlYXJDZWxsUG9zaXRpb24ocmVuZGVyZXI6IFJlbmRlcmVyMiwgZWw6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLnVzZVRyYW5zZm9ybVBvc2l0aW9uaW5nKSB7XG4gICAgICByZW5kZXJlci5zZXRTdHlsZShlbCwgJ3RyYW5zZm9ybScsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoZWwsICd0b3AnLCAnJyk7XG4gICAgICByZW5kZXJlci5zZXRTdHlsZShlbCwgJ2xlZnQnLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgc2V0Q2VsbFBvc2l0aW9uKHJlbmRlcmVyOiBSZW5kZXJlcjIsIGVsOiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgeFBvc2l0aW9uID0gdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5kaXJUeXBlID09PSBEaXJUeXBlcy5SVEwgPyAteCA6IHg7XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMudXNlVHJhbnNmb3JtUG9zaXRpb25pbmcpIHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybSA9ICd0cmFuc2xhdGUzZCgnICsgeFBvc2l0aW9uICsgJ3B4LCAnICsgeSArICdweCwgMCknO1xuICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoZWwsICd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW5kZXJlci5zZXRTdHlsZShlbCwgJ2xlZnQnLCB0aGlzLmdldExlZnRNYXJnaW4oKSArIHhQb3NpdGlvbiArICdweCcpO1xuICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoZWwsICd0b3AnLCB0aGlzLmdldFRvcE1hcmdpbigpICsgeSArICdweCcpO1xuICAgIH1cbiAgfVxuXG4gIGdldExlZnRNYXJnaW4oKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5vdXRlck1hcmdpbikge1xuICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMub3V0ZXJNYXJnaW5MZWZ0ICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm91dGVyTWFyZ2luTGVmdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm1hcmdpbjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG5cbiAgZ2V0VG9wTWFyZ2luKCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMub3V0ZXJNYXJnaW4pIHtcbiAgICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm91dGVyTWFyZ2luVG9wICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm91dGVyTWFyZ2luVG9wO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMubWFyZ2luO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
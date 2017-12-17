import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Host, OnDestroy, Renderer2} from '@angular/core';

import {GridsterComponent} from './gridster.component';

@Component({
  selector: 'gridster-grid',
  templateUrl: './gridsterGrid.html',
  styleUrls: ['./gridsterGrid.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GridsterGridComponent implements OnDestroy {
  el: any;
  gridster: GridsterComponent;
  columns: Array<any>;
  rows: Array<any>;
  height: number;
  width: number;
  margin: number;
  columnsHeight: number;
  rowsWidth: number;

  constructor(el: ElementRef, @Host() gridster: GridsterComponent, public renderer: Renderer2,
              private cdRef: ChangeDetectorRef) {
    this.el = el.nativeElement;
    this.gridster = gridster;
    this.gridster.gridLines = this;
    this.columns = [];
    this.rows = [];
    this.height = 0;
    this.width = 0;
    this.columnsHeight = 0;
    this.rowsWidth = 0;
  }

  ngOnDestroy(): void {
    delete this.el;
    delete this.gridster.gridLines;
    delete this.gridster;
  }

  updateGrid(): void {
    if (this.gridster.$options.displayGrid === 'always' && !this.gridster.mobile) {
      this.renderer.setStyle(this.el, 'display', 'block');
    } else if (this.gridster.$options.displayGrid === 'onDrag&Resize' && this.gridster.dragInProgress) {
      this.renderer.setStyle(this.el, 'display', 'block');
    } else if (this.gridster.$options.displayGrid === 'none' || !this.gridster.dragInProgress || this.gridster.mobile) {
      this.renderer.setStyle(this.el, 'display', 'none');
    }
    this.gridster.setGridDimensions();
    this.margin = this.gridster.$options.margin;
    this.height = this.gridster.curRowHeight - this.margin;
    this.width = this.gridster.curColWidth - this.margin;
    this.columns.length = Math.max(this.gridster.columns, Math.floor(this.gridster.curWidth / this.gridster.curColWidth)) || 0;
    this.rows.length = Math.max(this.gridster.rows, Math.floor(this.gridster.curHeight / this.gridster.curRowHeight)) || 0;
    this.columnsHeight = this.gridster.curRowHeight * this.rows.length;
    this.rowsWidth = this.gridster.curColWidth * this.columns.length;
    this.cdRef.markForCheck();
  }
}

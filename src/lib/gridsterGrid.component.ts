import {Component, ElementRef, Host, Renderer2} from '@angular/core';
import {GridsterComponent} from './gridster.component';
@Component({
  selector: 'gridster-grid',
  templateUrl: './gridsterGrid.html',
  styleUrls: ['./gridsterGrid.css']
})

export class GridsterGridComponent {
  el: any;
  gridster: GridsterComponent;
  columns: Array<any>;
  rows: Array<any>;
  height: number;
  width: number;
  margin: number;
  columnsHeight: number;
  rowsWidth: number;

  constructor(el: ElementRef, @Host() gridster: GridsterComponent, public renderer: Renderer2) {
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

  updateGrid(dragOn?: boolean): void {
    if (this.gridster.$options.displayGrid === 'always' && !this.gridster.mobile) {
      this.renderer.setStyle(this.el, 'display', 'block');
    } else if (this.gridster.$options.displayGrid === 'onDrag&Resize' && dragOn) {
      this.renderer.setStyle(this.el, 'display', 'block');
    } else if (this.gridster.$options.displayGrid === 'none' || !dragOn || this.gridster.mobile) {
      this.renderer.setStyle(this.el, 'display', 'none');
      return;
    }
    this.margin = this.gridster.$options.margin;
    this.height = this.gridster.curRowHeight - this.margin;
    this.width = this.gridster.curColWidth - this.margin;
    this.columns.length = Math.max(this.gridster.columns, Math.floor(this.gridster.curWidth / this.gridster.curColWidth));
    this.rows.length = Math.max(this.gridster.rows, Math.floor(this.gridster.curHeight / this.gridster.curRowHeight));
    this.columnsHeight = this.gridster.curRowHeight * this.rows.length;
    this.rowsWidth = this.gridster.curColWidth * this.columns.length;
  }
}

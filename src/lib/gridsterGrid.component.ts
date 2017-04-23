import {Component, ElementRef, Host, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {GridsterComponent} from './gridster.component';
@Component({
  selector: 'gridster-grid',
  templateUrl: './gridsterGrid.html',
  styleUrls: ['./gridsterGrid.css']
})

export class GridsterGridComponent implements OnInit {
  el: any;
  gridster: GridsterComponent;
  columns: Array<any>;
  rows: Array<any>;
  height: number;
  width: number;
  margin: number;

  constructor(el: ElementRef, @Host() gridster: GridsterComponent, public renderer: Renderer2) {
    this.el = el.nativeElement;
    this.gridster = gridster;
    this.gridster.gridLines = this;
    this.columns = [];
    this.rows = [];
    this.height = 0;
    this.width = 0;
  }

  ngOnInit() {
    this.updateGrid();
  }

  updateGrid() {
    console.log('update', this.gridster, this.gridster.curRowHeight, this.gridster.curColWidth);
    if (this.gridster.$options.displayGrid === 'always') {
      this.renderer.setStyle(this.el, 'display', 'block');
    } else if (this.gridster.$options.displayGrid === 'onDrag&Resize') {
      this.renderer.setStyle(this.el, 'display', 'block'); // TODO display only when drag/resize enabled
    } else if (this.gridster.$options.displayGrid === 'none') {
      this.renderer.setStyle(this.el, 'display', 'none');
    }
    this.columns.length = this.gridster.columns;
    this.rows.length = this.gridster.rows;
    this.margin = this.gridster.$options.margin;
    this.height = this.gridster.curRowHeight - this.margin;
    this.width = this.gridster.curColWidth - this.margin;
  }
}

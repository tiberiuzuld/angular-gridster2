import { NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CompactType,
  DirTypes,
  DisplayGrid,
  Draggable,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridType,
  Resizable
} from 'angular-gridster2';
import { MarkdownModule } from 'ngx-markdown';

interface Safe extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
}

@Component({
  selector: 'app-rtl',
  templateUrl: './rtl.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,

    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,

    MarkdownModule,

    GridsterComponent,
    GridsterItemComponent
  ]
})
export class RtlComponent implements OnInit, OnDestroy {
  options: Safe;
  dashboard: Array<GridsterItem>;

  ngOnInit(): void {
    document.body.setAttribute('dir', 'rtl');

    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
      dirType: DirTypes.RTL
    };

    this.dashboard = [
      { cols: 2, rows: 1, y: 0, x: 0 },
      { cols: 2, rows: 2, y: 0, x: 2, hasContent: true },
      { cols: 1, rows: 1, y: 0, x: 4 },
      { cols: 1, rows: 1, y: 2, x: 5 },
      { cols: 1, rows: 1, y: 1, x: 0 },
      { cols: 1, rows: 1, y: 1, x: 0 },
      {
        cols: 2,
        rows: 2,
        y: 3,
        x: 5,
        minItemRows: 2,
        minItemCols: 2,
        label: 'Min rows & cols = 2'
      },
      {
        cols: 2,
        rows: 2,
        y: 2,
        x: 0,
        maxItemRows: 2,
        maxItemCols: 2,
        label: 'Max rows & cols = 2'
      },
      {
        cols: 2,
        rows: 1,
        y: 2,
        x: 2,
        dragEnabled: true,
        resizeEnabled: true,
        label: 'Drag&Resize Enabled'
      },
      {
        cols: 1,
        rows: 1,
        y: 2,
        x: 4,
        dragEnabled: false,
        resizeEnabled: false,
        label: 'Drag&Resize Disabled'
      },
      { cols: 1, rows: 1, y: 2, x: 6 }
    ];

    this.dashboard = [
      { cols: 2, rows: 1, y: 0, x: 0 },
      { cols: 2, rows: 2, y: 0, x: 2, hasContent: true },
      { cols: 1, rows: 1, y: 0, x: 4 },
      { cols: 1, rows: 1, y: 2, x: 5 },
      { cols: 1, rows: 1, y: 1, x: 0 },
      { cols: 1, rows: 1, y: 1, x: 0 },
      {
        cols: 2,
        rows: 2,
        y: 3,
        x: 5,
        minItemRows: 2,
        minItemCols: 2,
        label: 'Min rows & cols = 2'
      },
      {
        cols: 2,
        rows: 2,
        y: 2,
        x: 0,
        maxItemRows: 2,
        maxItemCols: 2,
        label: 'Max rows & cols = 2'
      },
      {
        cols: 2,
        rows: 1,
        y: 2,
        x: 2,
        dragEnabled: true,
        resizeEnabled: true,
        label: 'Drag&Resize Enabled'
      },
      {
        cols: 1,
        rows: 1,
        y: 2,
        x: 4,
        dragEnabled: false,
        resizeEnabled: false,
        label: 'Drag&Resize Disabled'
      },
      { cols: 1, rows: 1, y: 2, x: 6 }
    ];
  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  removeItem($event: MouseEvent | TouchEvent, item): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void {
    this.dashboard.push({ x: 0, y: 0, cols: 1, rows: 1 });
  }

  ngOnDestroy(): void {
    document.body.removeAttribute('dir');
  }
}

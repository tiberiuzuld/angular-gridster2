import { signal } from '@angular/core';

import { Gridster } from '../gridster';
import { GridsterEmptyCell } from '../gridsterEmptyCell';
import { GridsterItemConfig } from '../gridsterItemConfig';

const baseOptions = {
  scale: undefined,
  defaultItemCols: 1,
  defaultItemRows: 1,
  minItemCols: 6,
  minItemRows: 5,
  maxItemCols: 100,
  maxItemRows: 100,
  minItemArea: 1,
  maxItemArea: 2500,
  maxCols: 100,
  maxRows: 100,
  emptyCellDragMaxCols: 50,
  emptyCellDragMaxRows: 50,
  enableOccupiedCellDrop: false
};

type EmptyCellOptions = typeof baseOptions;

function getMinItemCols(options: EmptyCellOptions, item: GridsterItemConfig): number {
  return item.minItemCols === undefined ? options.minItemCols : item.minItemCols;
}

function getMinItemRows(options: EmptyCellOptions, item: GridsterItemConfig): number {
  return item.minItemRows === undefined ? options.minItemRows : item.minItemRows;
}

function createEmptyCell(overrides: Partial<EmptyCellOptions> = {}): GridsterEmptyCell {
  const $options = {
    ...baseOptions,
    ...overrides
  };
  const gridster = {
    el: {
      scrollLeft: 0,
      scrollTop: 0,
      getBoundingClientRect: () => ({ left: 0, top: 0 })
    },
    gridRenderer: {
      getLeftMargin: () => 0,
      getTopMargin: () => 0
    },
    options: signal({ scale: undefined }),
    $options: signal($options),
    pixelsToPositionX: (x: number) => Math.floor(x),
    pixelsToPositionY: (y: number) => Math.floor(y),
    checkCollision: (item: GridsterItemConfig) =>
      item.x < 0 ||
      item.y < 0 ||
      item.cols < getMinItemCols($options, item) ||
      item.rows < getMinItemRows($options, item) ||
      item.cols > $options.maxItemCols ||
      item.rows > $options.maxItemRows ||
      item.x + item.cols > $options.maxCols ||
      item.y + item.rows > $options.maxRows
  } as unknown as Gridster;
  return new GridsterEmptyCell(gridster);
}

function mouseAt(clientX: number, clientY: number): MouseEvent {
  return {
    clientX,
    clientY,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn()
  } as unknown as MouseEvent;
}

describe('gridster empty cell drag', () => {
  it('creates the initial empty cell item at the configured minimum size', () => {
    const emptyCell = createEmptyCell();

    expect(emptyCell.getValidItemFromEvent(mouseAt(2, 3))).toEqual({
      x: 2,
      y: 3,
      cols: 6,
      rows: 5
    });
  });

  it('keeps minimum rows when dragging an empty cell item to the right', () => {
    const emptyCell = createEmptyCell();

    expect(emptyCell.getValidItemFromEvent(mouseAt(4, 3), { x: 2, y: 3, cols: 6, rows: 5 })).toEqual({
      x: 2,
      y: 3,
      cols: 6,
      rows: 5
    });
  });

  it('keeps minimum columns when dragging an empty cell item down', () => {
    const emptyCell = createEmptyCell();

    expect(emptyCell.getValidItemFromEvent(mouseAt(2, 6), { x: 2, y: 3, cols: 6, rows: 5 })).toEqual({
      x: 2,
      y: 3,
      cols: 6,
      rows: 5
    });
  });
});

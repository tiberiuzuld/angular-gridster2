import { Renderer2 } from '@angular/core';

import { Gridster } from '../gridster';
import { DirTypes, GridType } from '../gridsterConfig';
import { GridsterItem } from '../gridsterItem';
import { GridsterItemConfig } from '../gridsterItemConfig';
import { GridsterRenderer } from '../gridsterRenderer';

describe('GridsterRenderer', () => {
  const item: GridsterItemConfig = { cols: 13, rows: 6, y: 0, x: 0 };

  function makeGridster() {
    const options = {
      gridType: GridType.VerticalFixed,
      margin: 20,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      fixedColWidth: 20,
      fixedRowHeight: 20,
      keepFixedHeightInMobile: true,
      keepFixedWidthInMobile: false,
      ignoreMarginInRow: true,
      useTransformPositioning: false,
      dirType: DirTypes.LTR
    };

    return {
      $options: () => options,
      options: () => ({}),
      mobile: false,
      curColWidth: 50,
      curRowHeight: 20,
      curWidth: 1000,
      rows: 20,
      columns: 20,
      gridRows: new Array(20),
      gridColumns: new Array(20)
    } as unknown as Gridster;
  }

  it('does not subtract row margin from item height when ignoreMarginInRow is true', () => {
    const gridster = makeGridster();
    const renderer = new GridsterRenderer(gridster);
    const styles: Record<string, string | null> = {};
    const angularRenderer = {
      setStyle: (_el: Element, style: string, value: string | null) => {
        styles[style] = value;
      }
    } as Renderer2;

    renderer.updateItem(document.createElement('div'), item, angularRenderer);

    expect(styles.height).toBe('120px');
    expect(styles.width).toBe('630px');
  });

  it('uses the same row margin calculation for display grid rows', () => {
    const gridster = makeGridster();
    const renderer = new GridsterRenderer(gridster);

    expect(renderer.getGridRowStyle(0).height).toBe('20px');
    expect(renderer.getGridColumnStyle(0).height).toBe('400px');
  });
});

describe('GridsterItem', () => {
  it('keeps cached item height in sync with renderer sizing when ignoreMarginInRow is true', () => {
    const gridster = {
      options: () => ({}),
      $options: () => ({
        gridType: GridType.VerticalFixed,
        margin: 20,
        ignoreMarginInRow: true,
        scrollToNewItems: false
      }),
      curColWidth: 50,
      curRowHeight: 20
    } as unknown as Gridster;

    const itemComponent = {
      gridster,
      $item: () => ({ cols: 13, rows: 6, y: 0, x: 0 }),
      item: () => ({}),
      init: true,
      width: 0,
      height: 0,
      itemResize: { emit: () => undefined }
    } as unknown as GridsterItem;

    GridsterItem.prototype.updateItemSize.call(itemComponent);

    expect(itemComponent.height).toBe(120);
    expect(itemComponent.width).toBe(630);
  });
});

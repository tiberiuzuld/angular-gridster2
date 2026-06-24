import { NO_ERRORS_SCHEMA, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gridster } from '../gridster';
import { GridsterItem } from '../gridsterItem';
import { GridsterPreview } from '../gridsterPreview';

describe('gridster component', () => {
  let fixture: ComponentFixture<Gridster>;
  let gridsterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [Gridster, GridsterItem, GridsterPreview],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Gridster);
    gridsterComponent = fixture.componentInstance;
  });

  it('excludes the unused outer margin from fixed grid size', async () => {
    fixture.componentRef.setInput('options', {
      gridType: 'fixed',
      setGridSize: true,
      outerMargin: false,
      minCols: 2,
      minRows: 2,
      fixedColWidth: 100,
      fixedRowHeight: 100,
      mobileBreakpoint: 0,
      margin: 10
    });
    fixture.detectChanges();

    await fixture.whenStable();

    gridsterComponent.api.calculateLayout();

    expect(gridsterComponent.el.style.width).toBe('210px');
    expect(gridsterComponent.el.style.height).toBe('210px');
  });

  it('does not grow verticalFixed grid width on repeated layout', async () => {
    Object.defineProperty(gridsterComponent.el, 'offsetWidth', {
      configurable: true,
      get: () => Number.parseFloat(gridsterComponent.el.style.width) || 300
    });

    fixture.componentRef.setInput('options', {
      gridType: 'verticalFixed',
      setGridSize: true,
      outerMargin: false,
      minCols: 2,
      minRows: 2,
      fixedRowHeight: 100,
      mobileBreakpoint: 0,
      margin: 10
    });
    fixture.detectChanges();

    await fixture.whenStable();

    gridsterComponent.api.calculateLayout();
    gridsterComponent.api.calculateLayout();

    expect(gridsterComponent.el.style.width).toBe('300px');
  });
});

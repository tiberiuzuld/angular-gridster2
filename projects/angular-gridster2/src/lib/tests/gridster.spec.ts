import { NO_ERRORS_SCHEMA, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gridster } from '../gridster';
import { GridsterPreview } from '../gridsterPreview';

describe('gridster position helpers', () => {
  let fixture: ComponentFixture<Gridster>;
  let gridsterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [Gridster, GridsterPreview],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Gridster);
    gridsterComponent = fixture.componentInstance;
    gridsterComponent.options = signal({
      maxCols: 3,
      maxRows: 2
    });

    await fixture.whenStable();

    gridsterComponent.curColWidth = 100;
    gridsterComponent.curRowHeight = 100;
  });

  it('should clamp pixel positions to the configured grid bounds', () => {
    expect(gridsterComponent.pixelsToPositionX(260, Math.round)).toBe(2);
    expect(gridsterComponent.pixelsToPositionY(160, Math.round)).toBe(1);
  });

  it('should allow unlimited pixel positions when noLimit is true', () => {
    expect(gridsterComponent.pixelsToPositionX(260, Math.round, true)).toBe(3);
    expect(gridsterComponent.pixelsToPositionY(160, Math.round, true)).toBe(2);
  });
});

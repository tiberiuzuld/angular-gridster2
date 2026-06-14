import { NO_ERRORS_SCHEMA, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gridster } from '../gridster';
import { GridType } from '../gridsterConfig';
import { GridsterConfigService } from '../gridsterConfig.constant';
import { GridsterItem } from '../gridsterItem';
import { GridsterPreview } from '../gridsterPreview';

describe('Gridster public API', () => {
  let fixture: ComponentFixture<Gridster>;
  let gridster: Gridster;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [Gridster, GridsterItem, GridsterPreview],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Gridster);
    gridster = fixture.componentInstance;
    Object.defineProperty(gridster, 'options', {
      value: signal({
        ...GridsterConfigService,
        gridType: GridType.Fixed,
        disableWarnings: true
      })
    });
  });

  it('exposes calculateLayout for ViewChild consumers', () => {
    expect(() => gridster.calculateLayout()).not.toThrow();
  });
});

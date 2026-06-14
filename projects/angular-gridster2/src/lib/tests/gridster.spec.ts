import { NO_ERRORS_SCHEMA, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gridster } from '../gridster';
import { GridType } from '../gridsterConfig';

describe('gridster component', () => {
  let fixture: ComponentFixture<Gridster>;
  let resizeObserverCallback: ResizeObserverCallback;
  let observe: ReturnType<typeof vi.fn>;
  let disconnect: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    observe = vi.fn();
    disconnect = vi.fn();

    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeObserverCallback = callback;
        }

        observe = observe;
        disconnect = disconnect;
      }
    );

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [Gridster],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Gridster);
    fixture.componentInstance.options = signal({
      disableWindowResize: true,
      gridType: GridType.Fixed
    }) as unknown as Gridster['options'];
  });

  afterEach(() => {
    fixture?.destroy();
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
  });

  it('should resize when the gridster element changes size', () => {
    const gridster = fixture.componentInstance;
    const resize = vi.spyOn(gridster, 'onResize');

    fixture.detectChanges();

    expect(observe).toHaveBeenCalledWith(gridster.el);

    resizeObserverCallback([], {} as ResizeObserver);

    expect(resize).toHaveBeenCalled();
  });

  it('should disconnect the resize observer when destroyed', () => {
    fixture.detectChanges();

    fixture.destroy();

    expect(disconnect).toHaveBeenCalled();
  });
});

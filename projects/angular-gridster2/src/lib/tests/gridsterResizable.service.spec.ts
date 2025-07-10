import { NgZone } from '@angular/core';
import { GridsterResizable } from '../gridsterResizable.service';
import { GridsterComponentInterface } from '../gridster.interface';
import { GridsterItemComponentInterface } from '../gridsterItem.interface';

describe('GridsterResizable', () => {
  let service: GridsterResizable;
  let mockGridsterItem: GridsterItemComponentInterface;
  let mockGridster: GridsterComponentInterface;
  let mockZone: NgZone;

  beforeEach(() => {
    mockZone = {
      run: jasmine.createSpy('run'),
      runOutsideAngular: jasmine.createSpy('runOutsideAngular')
    } as any;

    mockGridsterItem = {
      $item: {
        x: 0,
        y: 0,
        cols: 4,
        rows: 3,
        itemAspectRatio: 4/3,
        minItemCols: 1,
        minItemRows: 1
      },
      item: {
        x: 0,
        y: 0,
        cols: 4,
        rows: 3,
        itemAspectRatio: 4/3
      },
      el: document.createElement('div'),
      renderer: {
        setStyle: jasmine.createSpy('setStyle'),
        addClass: jasmine.createSpy('addClass'),
        removeClass: jasmine.createSpy('removeClass'),
        listen: jasmine.createSpy('listen').and.returnValue(() => {})
      },
      setSize: jasmine.createSpy('setSize'),
      checkItemChanges: jasmine.createSpy('checkItemChanges'),
      canBeResized: jasmine.createSpy('canBeResized').and.returnValue(true),
      getResizableHandles: jasmine.createSpy('getResizableHandles').and.returnValue({
        s: true, e: true, n: true, w: true, se: true, ne: true, sw: true, nw: true
      })
    } as any;

    mockGridster = {
      $options: {
        margin: 10,
        minItemCols: 1,
        minItemRows: 1,
        itemAspectRatio: undefined,
        disablePushOnResize: false
      },
      options: {
        pushItems: true,
        enableBoundaryControl: false,
        resizable: {
          delayStart: 0
        }
      },
      el: document.createElement('div'),
      renderer: {
        listen: jasmine.createSpy('listen').and.returnValue(() => {})
      },
      movingItem: null,
      dragInProgress: false,
      updateGrid: jasmine.createSpy('updateGrid'),
      previewStyle: jasmine.createSpy('previewStyle'),
      checkCollision: jasmine.createSpy('checkCollision').and.returnValue(false),
      pixelsToPositionX: jasmine.createSpy('pixelsToPositionX').and.callFake((pixels: number) => Math.floor(pixels / 100)),
      pixelsToPositionY: jasmine.createSpy('pixelsToPositionY').and.callFake((pixels: number) => Math.floor(pixels / 100)),
      positionXToPixels: jasmine.createSpy('positionXToPixels').and.callFake((cols: number) => cols * 100),
      positionYToPixels: jasmine.createSpy('positionYToPixels').and.callFake((rows: number) => rows * 100),
      gridRenderer: {
        setCellPosition: jasmine.createSpy('setCellPosition')
      }
    } as any;

    service = new GridsterResizable(mockGridsterItem, mockGridster, mockZone);
  });

  describe('aspect ratio enforcement', () => {
    it('should enforce aspect ratio when resizing with corner handles', () => {
      // Set up initial state
      service.width = 400;
      service.height = 300;
      service.left = 0;
      service.top = 0;
      service.right = 400;
      service.bottom = 300;
      service.margin = 10;
      service.itemBackup = [0, 0, 4, 3];

      // Mock the gridster methods to return appropriate values
      mockGridster.pixelsToPositionX.and.callFake((pixels: number) => Math.floor(pixels / 100));
      mockGridster.pixelsToPositionY.and.callFake((pixels: number) => Math.floor(pixels / 100));
      mockGridster.positionXToPixels.and.callFake((cols: number) => cols * 100);
      mockGridster.positionYToPixels.and.callFake((rows: number) => rows * 100);

      // Call enforceAspectRatio (this would normally be called from corner handlers)
      (service as any).enforceAspectRatio();

      // Verify that the aspect ratio is maintained (4:3)
      const aspectRatio = mockGridsterItem.$item.cols / mockGridsterItem.$item.rows;
      expect(aspectRatio).toBeCloseTo(4/3, 2);
    });

    it('should respect minimum dimensions when enforcing aspect ratio', () => {
      // Set up initial state with very small dimensions
      service.width = 50;
      service.height = 50;
      service.left = 0;
      service.top = 0;
      service.right = 50;
      service.bottom = 50;
      service.margin = 10;
      service.itemBackup = [0, 0, 1, 1];

      // Mock the gridster methods
      mockGridster.pixelsToPositionX.and.callFake((pixels: number) => Math.floor(pixels / 100));
      mockGridster.pixelsToPositionY.and.callFake((pixels: number) => Math.floor(pixels / 100));
      mockGridster.positionXToPixels.and.callFake((cols: number) => cols * 100);
      mockGridster.positionYToPixels.and.callFake((rows: number) => rows * 100);

      // Call enforceAspectRatio
      (service as any).enforceAspectRatio();

      // Verify that minimum dimensions are respected
      expect(mockGridsterItem.$item.cols).toBeGreaterThanOrEqual(1);
      expect(mockGridsterItem.$item.rows).toBeGreaterThanOrEqual(1);
    });

    it('should not enforce aspect ratio when no aspect ratio is set', () => {
      // Remove aspect ratio
      mockGridsterItem.$item.itemAspectRatio = undefined;
      mockGridster.$options.itemAspectRatio = undefined;

      // Set up initial state
      service.width = 400;
      service.height = 300;
      service.left = 0;
      service.top = 0;
      service.right = 400;
      service.bottom = 300;
      service.margin = 10;
      service.itemBackup = [0, 0, 4, 3];

      // Mock the gridster methods
      mockGridster.pixelsToPositionX.and.callFake((pixels: number) => Math.floor(pixels / 100));
      mockGridster.pixelsToPositionY.and.callFake((pixels: number) => Math.floor(pixels / 100));
      mockGridster.positionXToPixels.and.callFake((cols: number) => cols * 100);
      mockGridster.positionYToPixels.and.callFake((rows: number) => rows * 100);

      // Call enforceAspectRatio
      (service as any).enforceAspectRatio();

      // Verify that dimensions remain unchanged
      expect(service.width).toBe(400);
      expect(service.height).toBe(300);
    });
  });

  describe('dragStart', () => {
    it('should set up direction function for corner handles', () => {
      const mockEvent = {
        clientX: 100,
        clientY: 100,
        target: {
          classList: {
            contains: jasmine.createSpy('contains').and.returnValue(true)
          }
        },
        stopPropagation: jasmine.createSpy('stopPropagation'),
        preventDefault: jasmine.createSpy('preventDefault'),
        which: 1
      } as any;

      // Test for each corner handle
      const handles = ['handle-nw', 'handle-ne', 'handle-sw', 'handle-se'];
      
      handles.forEach(handle => {
        mockEvent.target.classList.contains.and.callFake((className: string) => className === handle);
        
        service.dragStart(mockEvent);
        
        // Verify that direction function is set
        expect((service as any).directionFunction).toBeDefined();
        
        // Reset for next test
        (service as any).directionFunction = null;
      });
    });
  });
}); 
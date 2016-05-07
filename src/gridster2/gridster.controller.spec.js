(function () {
  'use strict';

  describe('GridsterController', function () {
    var vm, gridsterConfig, $scope, $rootScope;

    beforeEach(module('gridster2App'));
    beforeEach(inject(function (_$controller_, _gridsterConfig_, _$rootScope_, _$compile_) {

      function mockDebounce(debFunction) {
        return function () {
          debFunction();
        }
      }

      spyOn(_, 'debounce').and.callFake(mockDebounce);
      gridsterConfig = _gridsterConfig_;
      $rootScope = _$rootScope_;
      var element = _$compile_("<div gridster></div>")($rootScope);
      $rootScope.$digest();

      $scope = element.scope();
      vm = _$controller_('GridsterController', {$scope: $scope, gridsterConfig: gridsterConfig});
      vm.element = element;
    }));

    it('calculate layout', function () {
      vm.grid.push({
        x: 0, y: 0, rows: 10, cols: 10, setSize: function () {
        }, drag: {
          toggle: function () {
          }
        }, resize: {
          toggle: function () {
          }
        }
      });
      vm.curWidth = 1920;
      vm.curHeight = 1000;
      vm.gridType = 'fit';
      vm.outerMargin = true;
      vm.margin = 10;
      vm.calculateLayout();
      expect(vm.curColWidth).toEqual(191);
      expect(vm.curRowHeight).toEqual(99);

      vm.outerMargin = false;
      vm.calculateLayout();
      expect(vm.curColWidth).toEqual(193);
      expect(vm.curRowHeight).toEqual(101);

      vm.gridType = 'scrollVertical';
      vm.calculateLayout();
      expect(vm.curColWidth).toEqual(vm.curRowHeight);
      expect(vm.curColWidth).toEqual(193);

      vm.outerMargin = true;
      vm.calculateLayout();
      expect(vm.curColWidth).toEqual(vm.curRowHeight);
      expect(vm.curColWidth).toEqual(191);

      vm.gridType = 'scrollHorizontal';
      vm.calculateLayout();
      expect(vm.curColWidth).toEqual(vm.curRowHeight);
      expect(vm.curColWidth).toEqual(99);

      vm.outerMargin = false;
      vm.calculateLayout();
      expect(vm.curColWidth).toEqual(vm.curRowHeight);
      expect(vm.curColWidth).toEqual(101);

      vm.mobile = true;
      vm.calculateLayout();
      expect(vm.element.hasClass('mobile')).toEqual(false);


      vm.curWidth = 480;
      vm.curHeight = 640;
      vm.mobile = false;
      vm.calculateLayout();
      expect(vm.element.hasClass('mobile')).toEqual(true);


      vm.gridType = '';
      vm.calculateLayout();
      expect(vm.curColWidth).toEqual(vm.curRowHeight);
      expect(vm.curColWidth).toEqual(65);
    });

    it('set options for grid', function () {
      expect(vm.setOptions()).toEqual(undefined);

      vm.setOptions({mobile: true});

      expect(vm.mobile).toEqual(true);
    });

    it('add and remove item to grid', function () {
      var item = {
        setSize: function () {
        }, drag: {
          toggle: function () {
          }
        }, resize: {
          toggle: function () {
          }
        }, initCallback: function () {
        }
      };
      vm.addItem(item);
      expect(item.cols).toEqual(vm.defaultItemCols);
      expect(item.rows).toEqual(vm.defaultItemRows);
      expect(item.x).toEqual(0);
      expect(item.y).toEqual(0);
      vm.removeItem(item);

      item = {
        setSize: function () {
        }, drag: {
          toggle: function () {
          }
        }, resize: {
          toggle: function () {
          }
        },
        x: 0,
        cols: 4,
        rows: 3
      };

      vm.addItem(item);
      expect(item.cols).toEqual(4);
      expect(item.rows).toEqual(3);
      expect(item.x).toEqual(0);
      expect(item.y).toEqual(0);
      vm.removeItem(item);

      item = {
        setSize: function () {
        }, drag: {
          toggle: function () {
          }
        }, resize: {
          toggle: function () {
          }
        },
        x: 10,
        y: 10,
        cols: 4,
        rows: 3
      };
      vm.addItem(item);
      expect(item.cols).toEqual(4);
      expect(item.rows).toEqual(3);
      expect(item.x).toEqual(10);
      expect(item.y).toEqual(10);
      vm.removeItem(item);
    });

    it('check item collision', function () {
      var item = {cols: 5, rows: 3, x: -1, y: -1};
      expect(vm.checkCollision(item)).toBeTruthy();

      item.x = 0;
      item.y = 4;
      vm.grid.push({cols: 5, rows: 5, x: 0, y: 0});
      expect(vm.checkCollision(item)).toBeTruthy();

      item.y = 5;
      expect(vm.checkCollision(item)).toBeFalsy();
    });

    it('auto position item in grid', function () {
      var item = {cols: 5, rows: 3};
      vm.autoPositionItem(item);
      expect(item.y).toEqual(0);
      expect(item.x).toEqual(0);

      var dummyItem = {cols: 5, rows: 5, x: 0, y: 0};
      vm.grid.push(dummyItem);
      vm.autoPositionItem(item);
      expect(item.y).toEqual(0);
      expect(item.x).toEqual(5);

      vm.grid.pop();
      dummyItem.rows = 3;
      vm.grid.push(dummyItem);
      vm.autoPositionItem(item);
      expect(item.y).toEqual(3);
      expect(item.x).toEqual(0);
    });

    it('pixels to position transformation', function () {
      vm.outerMargin = true;
      vm.curColWidth = 150;
      vm.curRowHeight = 150;
      var position = vm.pixelsToPosition(50, 50);
      expect(position[0]).toEqual(0);
      expect(position[1]).toEqual(0);
      position = vm.pixelsToPosition(4580, 4875);
      expect(position[0]).toEqual(30);
      expect(position[1]).toEqual(32);

      vm.outerMargin = false;
      position = vm.pixelsToPosition(4580, 4875);
      expect(position[0]).toEqual(31);
      expect(position[1]).toEqual(33);
    });

  });
})();

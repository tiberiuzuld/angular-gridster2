import { GridsterUtils } from '../gridsterUtils.service';

describe('merge method', () => {
  it('should check if merge is working correctly', () => {
    const obj1 = { key1: 'value1', key2: 'value2' };
    const obj2 = { key1: 'value2', key2: 'value4' };
    const properties = { key1: 'value2', key2: 'value5' };
    expect(JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))).toBe(
      JSON.stringify(obj2)
    );
    expect(
      JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))
    ).not.toBe(JSON.stringify(properties));
  });
  it("should check if 'properties' doesn't contain any part of 'obj2", () => {
    const obj1 = { key1: 'value1' };
    const obj2 = { key1: 'value3', key2: 'value4' };
    const properties = { key3: 'value2' };
    expect(JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))).toBe(
      JSON.stringify(obj1)
    );
    expect(
      JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))
    ).not.toBe(JSON.stringify(properties));
  });
  it("should check obj1 when typeof obj2['p'] == 'object", () => {
    const obj1 = { key1: 'value1', key3: {} };
    const obj2 = { key1: 'value3', key2: 'value4', key3: { key4: 'value10' } };
    const properties = { key1: 'value3', key3: { key4: 'value11' } };
    const output = { key1: 'value3', key3: { key4: 'value10' } };
    expect(JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))).toBe(
      JSON.stringify(output)
    );
    expect(
      JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))
    ).not.toBe(JSON.stringify(obj2));
    expect(
      JSON.stringify(GridsterUtils.merge(obj1, obj2, properties))
    ).not.toBe(JSON.stringify(properties));
  });
});

describe('check touch event', () => {
  it('should check when clientX is present', () => {
    const event = { clientX: 100, clientY: 100 };
    GridsterUtils.checkTouchEvent(event);
    expect(event.clientX).toBe(100);
    expect(event.clientY).toBe(100);
  });

  it('should check when clientX is undefined', () => {
    const event: any = {
      clientX: undefined,
      clientY: undefined,
      touches: [{ clientX: 100, clientY: 100 }]
    };
    GridsterUtils.checkTouchEvent(event);
    expect(event.clientX).not.toBe(undefined);
    expect(event.clientY).not.toBe(undefined);
    expect(event.clientX).toBe(100);
    expect(event.clientY).toBe(100);
  });
});

describe('check content class for event', () => {
  const div = document.createElement('div');
  div.setAttribute('class', 'divClass');
  document.body.appendChild(div);
  const body = document.body;
  body.setAttribute('class', 'body');
  const event: any = document.createEvent('Event');
  event.initEvent('testing', true, true);
  div.addEventListener('testing', function () {});
  div.dispatchEvent(event);

  it('should check when ignoreContent is true and target & currentTarget is same', () => {
    const gridster: any = {
      $options: {
        draggable: {
          ignoreContent: true,
          dragHandleClass: 'class1',
          ignoreContentClass: 'class2'
        }
      }
    };
    const e: any = { target: 'element', currentTarget: 'element' };
    expect(GridsterUtils.checkContentClassForEvent(gridster, e)).toBe(true);
  });
  it('should check when ignoreContent is true but target and currentTarget is not same', () => {
    const gridster: any = {
      $options: {
        draggable: {
          ignoreContent: true,
          dragHandleClass: 'divClass',
          ignoreContentClass: 'class2'
        }
      }
    };
    expect(GridsterUtils.checkContentClassForEvent(gridster, event)).toBe(
      false
    );
  });
  it('should check when draghandleClass is false but ignoreContentClass is true', () => {
    const gridster: any = {
      $options: {
        draggable: {
          ignoreContent: false,
          dragHandleClass: 'divClass1',
          ignoreContentClass: 'body'
        }
      }
    };
    expect(GridsterUtils.checkContentClassForEvent(gridster, event)).toBe(true);
  });
});

describe('check content class', () => {
  const div = document.createElement('div');
  div.setAttribute('class', 'divClass');
  document.body.appendChild(div);
  const body = document.body;
  body.setAttribute('class', 'body');
  const event: any = document.createEvent('Event');
  event.initEvent('testing', true, true);
  div.addEventListener('testing', function () {});
  div.dispatchEvent(event);

  it('should check target == current', () => {
    const target = 'element';
    const current = 'element';
    const contentClass = 'class1';
    // expect(GridsterUtils.checkContentClass(target, current, contentClass)).toBe(false);
  });
  it('should check in classList', () => {
    expect(
      GridsterUtils.checkContentClass(
        event.target,
        event.currentTarget,
        'divClass'
      )
    ).toBe(true);
    expect(
      GridsterUtils.checkContentClass(event.target, event.currentTarget, 'body')
    ).toBe(true);
  });
});

describe('check compare items', () => {
  it('should return -1, when the first item is further away from origin based on y-value', () => {
    const firstItem = { x: 2, y: 2 };
    const secondItem = { x: 1, y: 1 };
    expect(-1).toBe(GridsterUtils.compareItems(firstItem, secondItem));
  });
  it('should return -1, when the first item is further away from origin based on x-value', () => {
    const firstItem = { x: 2, y: 2 };
    const secondItem = { x: 1, y: 2 };
    expect(-1).toBe(GridsterUtils.compareItems(firstItem, secondItem));
  });
  it('should return 1, when the second item is further away from origin based on y-value', () => {
    const firstItem = { x: 1, y: 1 };
    const secondItem = { x: 2, y: 2 };
    expect(1).toBe(GridsterUtils.compareItems(firstItem, secondItem));
  });
  it('should return 1, when the second item further away from origin based on x-value', () => {
    const firstItem = { x: 1, y: 2 };
    const secondItem = { x: 2, y: 2 };
    expect(1).toBe(GridsterUtils.compareItems(firstItem, secondItem));
  });
});

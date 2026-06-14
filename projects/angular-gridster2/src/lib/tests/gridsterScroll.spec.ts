import { isMovingTowardScrollEdge } from '../gridsterScroll';

describe('scroll edge direction', () => {
  it('allows bottom-edge scrolling only while the pointer moves down or stays in place', () => {
    expect(isMovingTowardScrollEdge(100, 110, 1)).toBe(true);
    expect(isMovingTowardScrollEdge(100, 100, 1)).toBe(true);
    expect(isMovingTowardScrollEdge(110, 100, 1)).toBe(false);
  });

  it('allows top-edge scrolling only while the pointer moves up or stays in place', () => {
    expect(isMovingTowardScrollEdge(110, 100, -1)).toBe(true);
    expect(isMovingTowardScrollEdge(100, 100, -1)).toBe(true);
    expect(isMovingTowardScrollEdge(100, 110, -1)).toBe(false);
  });
});

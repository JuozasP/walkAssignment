import {PolarPoint, Vector} from '@shopify/react-native-skia';

export const cartesian2Canvas = (v: Vector, center: Vector) => {
  'worklet';
  return {
    x: v.x + center.x,
    y: -1 * v.y + center.y,
  };
};

export const polar2Cartesian = (p: PolarPoint) => {
  'worklet';
  return {
    x: p.radius * Math.cos(p.theta),
    y: p.radius * Math.sin(p.theta),
  };
};

export const polar2Canvas = (p: PolarPoint, center: Vector) => {
  'worklet';
  return cartesian2Canvas(polar2Cartesian(p), center);
};

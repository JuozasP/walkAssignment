import React from 'react';
import {Path, Svg} from 'react-native-svg';

type Props = {
  opacity?: number;
  size?: number;
  color?: string;
};

export default function Chevron({
  color = '#52486A',
  opacity = 0.4,
  size = 12,
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 14" fill="none">
      <Path
        d="M4.00768 12.8269L3.29808 12.1173L7.41539 8.00001L3.29808 3.8827L4.00768 3.1731L8.83459 8.00001L4.00768 12.8269Z"
        fill={color}
        fillOpacity={opacity}
      />
    </Svg>
  );
}

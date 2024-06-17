// ZigzagPattern.js
import React from 'react';
import { Svg, Polygon } from 'react-native-svg';
import { View } from 'react-native';

const generateZigzagPoints = (width, height, numZigzags) => {
  const step = width / numZigzags;
  let points = '';

  for (let i = 0; i <= numZigzags; i++) {
    const x = i * step;
    const y = i % 2 === 0 ? 0 : height;
    points += `${x},${y} `;
  }

  return points;
};

const ZigzagPattern = ({ width, numZigzags = 20 }) => {
  const height = 20; // height of the zigzag pattern
  const points = generateZigzagPoints(width, height, numZigzags);

  return (
    <View style={{ position: 'absolute', bottom: -20, left: 0 }}>
      <Svg height={height} width={width}>
        <Polygon points={points} fill="#e1f5fe" />
      </Svg>
    </View>
  );
};

export default ZigzagPattern;

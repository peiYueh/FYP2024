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

const ZigzagPattern = ({ width, positionTop, numZigzags = 20 }) => {
  const height = 25; // height of the zigzag pattern
  const points = generateZigzagPoints(width, height, numZigzags);

  return (
    <View style={{ position: 'absolute', top: positionTop -2, left: 40 }}>
      <Svg height={height} width={width + 10}>
        <Polygon points={points} fill="rgb(220, 228, 232)" />
      </Svg>
    </View>
  );
};

export default ZigzagPattern;

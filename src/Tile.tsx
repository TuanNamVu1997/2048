import React from 'react';
import styles from './tileStyles';

export interface Cell {
  row: number;
  col: number;
}

export interface TileProps extends Cell {
  value: number;
  id: string;
}

function Tile({ value, id, col, row }: TileProps) {
  let innerValue = value;
  while (innerValue > 1024) {
    innerValue /= 1024;
  }
  let base = Math.log(innerValue) / Math.log(2);

  const numberOfDigits = value.toString().length;
  let fontSize = 80;
  if (numberOfDigits > 4) {
    fontSize = 40;
  } else if (numberOfDigits > 3) {
    fontSize = 50;
  } else if (numberOfDigits > 2) {
    fontSize = 60;
  }
  return (
    <div
      key={id}
      style={{
        left: 132 * col,
        top: 132 * row,
        backgroundColor: styles[base] ? styles[base].bg : '#ffa07a',
        fontSize: fontSize,
        color: '#333',
      }}
      className="tile"
    >
      {value}
    </div>
  );
}

export default Tile;

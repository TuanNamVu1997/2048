import React from 'react';

interface GridProps {
  children: React.ReactNode;
  size: number;
}
function Grid({ children, size }: GridProps) {
  let gridVector = new Array(size).fill(0);
  return (
    <div className="grid">
      {gridVector.map((_) => (
        <div className="row">
          {gridVector.map((_) => (
            <div className="cell" />
          ))}
        </div>
      ))}
      {children}
    </div>
  );
}

export default Grid;

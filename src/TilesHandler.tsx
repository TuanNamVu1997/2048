import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSwipeable } from 'react-swipeable';
import { TileProps, Cell } from './Tile';

interface TilesHandlerProps {
  children: React.ReactNode;
  tiles: TileProps[];
  vectorLength: number;
  onTilesChange: (tiles: TileProps[]) => void;
}

const getRandomIndex = (length: number) => Math.floor(Math.random() * length);

function findTile(tiles: TileProps[], col: number, row: number) {
  return tiles.find((tile) => tile.col === col && tile.row === row);
}

export function getRandomTile(length: number, _tiles: TileProps[] = []): TileProps {
  let cell: Cell;
  do cell = { col: getRandomIndex(length), row: getRandomIndex(length) };
  while (findTile(_tiles, cell.col, cell.row));
  return { ...cell, value: 2, id: uuidv4() };
}

function TilesHandler({ children, vectorLength, onTilesChange, tiles }: TilesHandlerProps) {
  const handlers = useSwipeable({ onSwiped: (e) => handleMovement(e.dir) });
  const [end, setEnd] = useState(false);

  function updateVector(newTiles: TileProps[], idx: number, type: keyof Cell, reverse?: boolean) {
    const tilesInVector = tiles.filter((tile) => tile[type] === idx);
    const oppositeVectorType: keyof Cell = type === 'col' ? 'row' : 'col';
    let sortedTiles = tilesInVector.sort((a, b) => b[oppositeVectorType] - a[oppositeVectorType]);
    if (reverse) {
      sortedTiles.reverse();
    }
    let counter = vectorLength - 1;
    let hasPredecessorMerged = false;

    sortedTiles.forEach((tile, pos) => {
      let newIndex = reverse ? Math.abs(vectorLength - 1 - counter) : counter;
      const prevTile = sortedTiles[pos - 1];
      const nextTile = sortedTiles[pos + 1];
      if (prevTile && prevTile.value === tile.value && !hasPredecessorMerged) {
        newTiles.push({
          ...tile,
          value: tile.value * 2,
          [oppositeVectorType]: newIndex,
        });
        counter--;
        hasPredecessorMerged = true;
      } else if ((nextTile && nextTile.value !== tile.value) || nextTile === undefined) {
        newTiles.push({ ...tile, [oppositeVectorType]: newIndex });
        counter--;
        hasPredecessorMerged = false;
      } else {
        hasPredecessorMerged = false;
      }
    });
  }
  const haveTilesMoved = (prevTiles: TileProps[], newTiles: TileProps[]) =>
    JSON.stringify(newTiles) !== JSON.stringify(prevTiles);

  function updateTiles(newTiles: TileProps[]) {
    if (haveTilesMoved(tiles, newTiles)) {
      newTiles.push(getRandomTile(vectorLength, newTiles));
      onTilesChange(newTiles);
    }
    if (newTiles.length === Math.pow(vectorLength, 2)) {
      let possibleMoves = false;
      for (let direction of ['Up', 'Right', 'Down', 'Left']) {
        if (haveTilesMoved(newTiles, getTilesAfterMovement(direction, newTiles))) {
          possibleMoves = true;
        }
      }
      if (!possibleMoves) {
        setEnd(true);
      }
    }
  }
  function getTilesAfterMovement(direction: string, prevTiles: TileProps[]) {
    const vector: keyof Cell = ['Right', 'Left'].includes(direction) ? 'row' : 'col';
    const reverse = ['Up', 'Left'].includes(direction);

    let newTiles: TileProps[] = [];
    for (let i = 0; i < vectorLength; i++) {
      updateVector(newTiles, i, vector, reverse);
    }

    newTiles = prevTiles
      .map((tile) => newTiles.find((newTile) => newTile.id === tile.id))
      .filter((tile) => tile !== undefined) as TileProps[];
    return newTiles;
  }

  function handleMovement(direction: string) {
    const newTiles = getTilesAfterMovement(direction, tiles);
    updateTiles(newTiles);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      handleMovement(event.key.replace('Arrow', ''));
    }
  }

  return (
    <div className="App" onKeyUp={handleKeyPress} tabIndex={0} {...handlers}>
      {children}
      <span>{end && 'END'}</span>
    </div>
  );
}

export default TilesHandler;

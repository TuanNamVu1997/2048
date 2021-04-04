import React, { useState } from 'react';
import Tile, { TileProps } from './Tile';
import Grid from './Grid';
import './App.css';
import TilesHandler, { getRandomTile } from './TilesHandler';

function App() {
  const ITEMS_PER_VECTOR = 4;
  let initialTiles = [getRandomTile(ITEMS_PER_VECTOR)];
  initialTiles = [...initialTiles, getRandomTile(ITEMS_PER_VECTOR, initialTiles)];
  const [tiles, setTiles] = useState<TileProps[]>(initialTiles);

  return (
    <TilesHandler vectorLength={ITEMS_PER_VECTOR} onTilesChange={setTiles} tiles={tiles}>
      <Grid size={ITEMS_PER_VECTOR}>
        {tiles.map(tile => (
          <Tile col={tile.col} id={tile.id} key={tile.id} row={tile.row} value={tile.value} />
        ))}
      </Grid>
    </TilesHandler>
  );
}

export default App;

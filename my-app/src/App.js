import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer';
import './App.css';

const numRows = 68;
const numCols = 68;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
]

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }

    return rows;
  });

  const[running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + x;
              if (newI >= 0 && newI < numRows)
            })
          }
        }
      })
    })    
    setTimeout(runSimulation, 1000);
  }, [])

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
        }}
      >
        {running ? 'stop' : 'start'}</button>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 10px)`
      }}>
        {grid.map((rows, i) => 
          rows.map((col, k) => 
          <div 
          key={`${i}-${k}`}
          onClick={() => {
            const newGrid = produce(grid, gridCopy => {
              gridCopy[i][k] = grid[i][k] ? 0 : 1;

            })
            setGrid(newGrid);
          }}
            style={{
              width: 10,
              height: 10, 
              backgroundColor: grid[i][k] ? 'pink' : undefined,
              border: "solid 1px black"
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;

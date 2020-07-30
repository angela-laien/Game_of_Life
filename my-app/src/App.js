import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer';
import './App.scss';

// An appropriate data structure to hold a grid of cells that is at least 25x25
const numRows = 28;
const numCols = 28;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const emptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }

  return rows;
}

const generateCell = (g) => {
  return produce(g, gridCopy => {
    for (let i = 0; i < numRows; i++) {
      for (let h = 0; h < numCols; h++) {
        // Examine state of all eight neighbors
        let neighbors = 0;
        operations.forEach(([x, y]) => {
          const newI = i + x;
          const newH = h + y;
          // Apply rules of life to determine if this cell will change states
          if (newI >= 0 && newI < numRows && newH >= 0 && newH < numCols) {
            neighbors += g[newI][newH]
          }
        })
        if (neighbors < 2 || neighbors > 3) {
          gridCopy[i][h] = 0;
        } else if (g[i][h] === 0 && neighbors === 3) {
          gridCopy[i][h] = 1;
        }
      }
    }
  });
}

function App() {
  // Grid to display cells
  const [grid, setGrid] = useState(() => {
    return emptyGrid()
  });

  const[running, setRunning] = useState(false);

  const [speed, setSpeed] = useState(false);

  const [generation, setGeneration] = useState(0);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGeneration(generation => generation + 1);
    setGrid((g) => {
      return generateCell(g);
    });    
    // Utilize a timeout function to build the next generation of cells
    setTimeout(runSimulation, speed ? 100 : 1000);
  }, [speed]);

  const generationStep = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGeneration(generation => generation + 1);
    setGrid((g) => {
      return generateCell(g);
    });
  }, []);

  return (
    <div className="App">
      <h1>Game of Life</h1>
      <div className="desktop-mobile">
        <div className="left">
          <h2>Instructions</h2>
          <li>Click on any white cell to generate a live green cell.</li>
          <li>Any live cell with less than 2 neighbors dies.</li>
          <li>Any live cell with 2 or 3 neighbors lives on to the next generation.</li>
        {/* Button(s) that start & stop the animation */}
          <div className="button-sec">
            <button
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSimulation();
                }
              }}
            >
              {running ? 'Stop' : 'Start'}
            </button>
            {/* Provide functionality to manually step through the simulation one generation at a time, as opposed to animating automatically */}
            <button
              onClick={() => {
                runningRef.current = true;
                generationStep();
              }}
            >
              Generate
            </button>
            {/* CUSTOM FEATURES #1 Add an option that creates a random cell configuration that users can run */}
            <button onClick={() => {
              const rows = [];
              for (let i = 0; i < numRows; i++) {
                rows.push(
                  Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0)))
              }
            
              setGrid(rows);
              setGeneration(0);
            }}>
              Random
            </button>
            {/* CUSTOM FEATURES #2 Allow users to specify the speed of the simulation */}
            {!speed ? (
                <button
                  onClick={() => {
                    setSpeed(true);
                  }}
                > 
                  10x Speed 
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSpeed(false);
                  }}
                >
                  1x Speed 
                </button>
              )}
            {/* Button to clear the grid */}
            <button onClick={() => {
              setGrid(emptyGrid());
              setGeneration(0);
            }}>
              Clear
            </button>
          </div>
          <p className="generation">Generations: {generation}</p>
        </div>
        {/* Cell objects or components properties*/}
        <div className ="right" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 15px)`,
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0% 0.5%'
        }}>
          {grid.map((rows, i) => 
            rows.map((col, h) => 
            <div 
            key={`${i}-${h}`}
            // Clickable/Tappable
            onClick={() => {
              // can be clicked to allow user to setup initial cell configuration
              const newGrid = produce(grid, gridCopy => {
                // Toggle state functionality: switch between alive & dead either because user manually toggled cell before starting simulation
                gridCopy[i][h] = grid[i][h] ? 0 : 1;
              })
              setGrid(newGrid);
            }}
              style={{
                width: 15,
                height: 15, 
                // current state: (alive, dead), (green, white)
                backgroundColor: grid[i][h] ? 'green' : undefined,
                border: "solid 1px black"
              }}
            />
          ))}
        </div>
      </div>
    </ div>
  );
}

export default App;

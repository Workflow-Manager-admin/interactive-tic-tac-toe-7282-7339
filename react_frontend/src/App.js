import React, { useState, useEffect } from "react";
import "./App.css";

/*
  Colors (from requirements):
  --primary:   #1976d2  (main blue; Player X, primary button, highlights)
  --accent:    #ffca28  (accent for highlights/draw state)
  --secondary: #424242  (secondary/dull black for lines, info, Player O)
*/

// PUBLIC_INTERFACE
function App() {
  // The 9 squares of the board: null, "X", or "O"
  const [squares, setSquares] = useState(Array(9).fill(null));
  // True if it's X's turn
  const [xIsNext, setXIsNext] = useState(true);
  // Game outcome: null | {winner:'X'|'O'|'draw', line:[idx,...] }
  const [gameStatus, setGameStatus] = useState(null);
  // For light/dark mode toggle (keep the provided system)
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Handle click on a single cell
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (gameStatus || squares[idx]) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    setGameStatus(computeGameStatus(nextSquares));
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameStatus(null);
  }

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }

  // Handle updating game status after each move
  useEffect(() => {
    setGameStatus(computeGameStatus(squares));
  }, [squares]);

  // Helper: computes if game is won, draw, or ongoing
  function computeGameStatus(sq) {
    // All win lines
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
        return { winner: sq[a], line };
      }
    }
    if (sq.every(Boolean)) {
      return { winner: "draw" };
    }
    return null;
  }

  // UI: Determine status text and color
  let status;
  if (gameStatus) {
    if (gameStatus.winner === "draw") {
      status = (
        <span className="status draw">
          <strong>It's a draw!</strong>
        </span>
      );
    } else {
      status = (
        <span
          className={`status win ${gameStatus.winner.toLowerCase()}`}
        >
          <strong>Player {gameStatus.winner} wins!</strong>
        </span>
      );
    }
  } else {
    status = (
      <span className="status turn">
        <span
          className={xIsNext ? "player-x" : "player-o"}
        >
          Player {xIsNext ? "X" : "O"}
        </span>
        ’s turn
      </span>
    );
  }

  // Render a single cell
  function renderSquare(idx) {
    const value = squares[idx];
    let highlight = "";
    if (gameStatus?.line?.includes(idx)) {
      highlight = "highlight";
    }
    return (
      <button
        className={`ttt-square ${value ? value.toLowerCase() : ""} ${highlight}`}
        onClick={() => handleClick(idx)}
        aria-label={`tic tac toe cell ${idx + 1} ${value ? value : ""}`}
        key={idx}
        disabled={!!squares[idx] || !!gameStatus}
      >
        {value}
      </button>
    );
  }

  return (
    <div className="App">
      <div className="tictactoe-container">
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-board">
          {[0,1,2].map(row => (
            <div className="ttt-row" key={row}>
              { [0,1,2].map(col => renderSquare(row*3 + col)) }
            </div>
          ))}
        </div>
        <div className="ttt-statusbar">
          {status}
        </div>
        <button className="restart-btn" onClick={handleRestart}>Restart Game</button>
        <p className="ttt-footer">
          Minimalistic React Tic Tac Toe &mdash; Player vs Player
        </p>
      </div>
    </div>
  );
}

export default App;

import {createSlice} from '@reduxjs/toolkit';

// src/redux/gameSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Вспомогательная функция: найти пустые ячейки
const getEmptyCells = (grid) => {
  const emptyCells = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
};

// Вспомогательная функция: добавить плитку
const spawnTile = (grid) => {
  const newGrid = JSON.parse(JSON.stringify(grid));
  const emptyCells = getEmptyCells(newGrid);

  if (emptyCells.length > 0) {
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    newGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  return newGrid;
};

// Вспомогательная функция: обработать линию (горизонталь или вертикаль)
const processLine = (line, reverseBefore = false, reverseAfter = false) => {
  let filtered = line.filter(val => val !== 0);
  if (reverseBefore) filtered = [...filtered].reverse();

  const merged = [];
  for (let i = 0; i < filtered.length; i++) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      i++;
    } else {
      merged.push(filtered[i]);
    }
  }

  while (merged.length < 4) {
    merged.push(0);
  }

  if (reverseAfter) {
    merged.reverse();
  }

  return merged;
};

// Проверка на конец игры
const checkGameOver = (grid) => {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === 0) return false;
      if (col < 3 && grid[row][col] === grid[row][col + 1]) return false;
      if (row < 3 && grid[row][col] === grid[row + 1][col]) return false;
    }
  }
  return true;
};

// Создаём начальную сетку
const createInitialGrid = () => {
  let grid = Array(4).fill().map(() => Array(4).fill(0));
  grid = spawnTile(grid);
  grid = spawnTile(grid);
  return grid;
};

const initialState = {
  grid: createInitialGrid(),
  score: 0,
  gameOver: false,
  gameWon: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    moveLeft: (state) => {
      if (state.gameOver) return;

      let changed = false;
      let gainedScore = 0;

      for (let row = 0; row < 4; row++) {
        const oldRow = [...state.grid[row]];
        const processed = processLine(oldRow, false, false);
        state.grid[row] = processed;

        if (oldRow.some((val, i) => val !== processed[i])) {
          changed = true;
        }

        processed.forEach((val, i) => {
          if (val !== oldRow[i] && val === oldRow[i] * 2) {
            gainedScore += val;
          }
        });
      }

      if (changed) {
        state.score += gainedScore;
        const nextGrid = spawnTile(state.grid);
        Object.assign(state.grid, nextGrid);

        if (!state.gameWon && state.grid.flat().includes(2048)) {
          state.gameWon = true;
        }

        if (checkGameOver(state.grid)) {
          state.gameOver = true;
        }
      }
    },

    moveRight: (state) => {
      if (state.gameOver) return;

      let changed = false;
      let gainedScore = 0;

      for (let row = 0; row < 4; row++) {
        const oldRow = [...state.grid[row]];
        const processed = processLine(oldRow, true, true);
        state.grid[row] = processed;

        if (oldRow.some((val, i) => val !== processed[i])) {
          changed = true;
        }

        processed.forEach((val, i) => {
          if (val !== oldRow[i] && val === oldRow[i] * 2) {
            gainedScore += val;
          }
        });
      }

      if (changed) {
        state.score += gainedScore;
        const nextGrid = spawnTile(state.grid);
        Object.assign(state.grid, nextGrid);

        if (!state.gameWon && state.grid.flat().includes(2048)) {
          state.gameWon = true;
        }

        if (checkGameOver(state.grid)) {
          state.gameOver = true;
        }
      }
    },

    moveUp: (state) => {
      if (state.gameOver) return;

      let changed = false;
      let gainedScore = 0;

      for (let col = 0; col < 4; col++) {
        const column = [state.grid[0][col], state.grid[1][col], state.grid[2][col], state.grid[3][col]];
        const oldCol = [...column];
        const processed = processLine(column, false, false);

        for (let row = 0; row < 4; row++) {
          state.grid[row][col] = processed[row];
        }

        if (oldCol.some((val, i) => val !== processed[i])) {
          changed = true;
        }

        processed.forEach((val, i) => {
          if (val !== oldCol[i] && val === oldCol[i] * 2) {
            gainedScore += val;
          }
        });
      }

      if (changed) {
        state.score += gainedScore;
        const nextGrid = spawnTile(state.grid);
        Object.assign(state.grid, nextGrid);

        if (!state.gameWon && state.grid.flat().includes(2048)) {
          state.gameWon = true;
        }

        if (checkGameOver(state.grid)) {
          state.gameOver = true;
        }
      }
    },

    moveDown: (state) => {
      if (state.gameOver) return;

      let changed = false;
      let gainedScore = 0;

      for (let col = 0; col < 4; col++) {
        const column = [state.grid[0][col], state.grid[1][col], state.grid[2][col], state.grid[3][col]];
        const oldCol = [...column];
        const processed = processLine(column, true, true);

        for (let row = 0; row < 4; row++) {
          state.grid[row][col] = processed[row];
        }

        if (oldCol.some((val, i) => val !== processed[i])) {
          changed = true;
        }

        processed.forEach((val, i) => {
          if (val !== oldCol[i] && val === oldCol[i] * 2) {
            gainedScore += val;
          }
        });
      }

      if (changed) {
        state.score += gainedScore;
        const nextGrid = spawnTile(state.grid);
        Object.assign(state.grid, nextGrid);

        if (!state.gameWon && state.grid.flat().includes(2048)) {
          state.gameWon = true;
        }

        if (checkGameOver(state.grid)) {
          state.gameOver = true;
        }
      }
    },

    resetGame: (state) => {
      state.grid = createInitialGrid();
      state.score = 0;
      state.gameOver = false;
      state.gameWon = false;
    },
  },
});

export const { moveLeft, moveRight, moveUp, moveDown, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
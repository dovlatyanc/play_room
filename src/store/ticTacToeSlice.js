// src/store/ticTacToeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Вспомогательная функция для определения победителя
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const initialState = {
  squares: Array(9).fill(null),
  xIsNext: true,
  winner: null,
  isDraw: false,
};

export const ticTacToeSlice = createSlice({
  name: 'ticTacToe',
  initialState,
  reducers: {
    makeMove: (state, action) => {
      const index = action.payload;

      // Если клетка занята или уже есть победитель
      if (state.squares[index] || state.winner) return;

      // Ставим X или O
      state.squares[index] = state.xIsNext ? 'X' : 'O';
      state.xIsNext = !state.xIsNext;

      // Проверяем победителя
      const winner = calculateWinner(state.squares);
      if (winner) {
        state.winner = winner;
      } else if (state.squares.every(square => square !== null)) {
        state.isDraw = true;
      }
    },

    resetGame: (state) => {
      state.squares = Array(9).fill(null);
      state.xIsNext = true;
      state.winner = null;
      state.isDraw = false;
    },
  },
});

export const { makeMove, resetGame } = ticTacToeSlice.actions;

export default ticTacToeSlice.reducer;
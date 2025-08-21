import { createSlice } from '@reduxjs/toolkit';

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    matrix: [],
    flippedCards: [],
    startTime: null,
    gameOver: false,
    clickCount: 0,
  },
  reducers: {
    incrementClickCount(state) {
      state.clickCount += 1;
    },
    resetClickCount(state) {
      state.clickCount = 0;
    },
    saveCurrentGame(state, action) {
      return { ...state, ...action.payload };
    },
    clearCurrentGame(state) {
      state.matrix = [];
      state.flippedCards = [];
      state.startTime = null;
      state.gameOver = false;
      state.clickCount = 0;
    },
    flipCard(state, action) {
      const { rowIndex, colIndex } = action.payload;
      const card = state.matrix[rowIndex][colIndex];
      if (!card.isFlipped && !card.isMatched) {
        state.matrix[rowIndex][colIndex] = { ...card, isFlipped: true };
        // Добавляем карту в flippedCards
        state.flippedCards.push({ row: rowIndex, col: colIndex });
      }
    },
    unflipCard(state, action) {
      const { row, col } = action.payload;
      const card = state.matrix[row][col];
      if (card.isFlipped && !card.isMatched) {
        state.matrix[row][col] = { ...card, isFlipped: false };
        // Удаляем из flippedCards
        state.flippedCards = state.flippedCards.filter(
          c => !(c.row === row && c.col === col)
        );
      }
    },
    matchCards(state, action) {
      const { first, second } = action.payload;
      state.matrix[first.row][first.col].isMatched = true;
      state.matrix[second.row][second.col].isMatched = true;
      // Очищаем flippedCards
      state.flippedCards = [];
    },
    startNewGame(state, action) {
      return { ...state, ...action.payload };
    },
     setGameOver(state) {
      state.gameOver = true;
    }, 
  },
});

export const {
  incrementClickCount,
  resetClickCount,
  saveCurrentGame,
  clearCurrentGame,
  flipCard,
  unflipCard,
  matchCards,
  startNewGame,
  setGameOver
} = gameSlice.actions;

export default gameSlice.reducer;
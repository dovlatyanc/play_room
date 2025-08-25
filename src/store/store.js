import { configureStore } from '@reduxjs/toolkit'
import gameSlice from './slice'
import authReducer from './authSlice';
import ticTacToeReducer from './ticTacToeSlice'
import game2048Reducer from './game2048slice';

export default configureStore({
  reducer: {
    ticTacToe: ticTacToeReducer,
    game: gameSlice,
    auth: authReducer,
    game2048: game2048Reducer
  },
})
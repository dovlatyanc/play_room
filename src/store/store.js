import { configureStore } from '@reduxjs/toolkit'
import gameSlice from './slice'
import authReducer from './authSlice';
import ticTacToeReducer from './ticTacToeSlice'

export default configureStore({
  reducer: {
    ticTacToe: ticTacToeReducer,
    game: gameSlice,
    auth: authReducer
  },
})
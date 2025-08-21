import { useSelector, useDispatch } from 'react-redux';
import { makeMove, resetGame } from '../../store/ticTacToeSlice';
import '../../styles/tictactoe.css';

export default function TicTacToe() {
  const dispatch = useDispatch();

  // Получаем состояние из Redux
  const { squares, xIsNext, winner, isDraw } = useSelector(
    (state) => state.ticTacToe
  );

  // Определяем статус
  let status;
  if (winner) {
    status = `Победитель: ${winner}`;
  } else if (isDraw) {
    status = 'Ничья!';
  } else {
    status = `Очередь: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="tic-tac-toe">
      <h1>Крестики-нолики</h1>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((value, index) => (
          <button
            key={index}
            onClick={() => dispatch(makeMove(index))}
          >
            {value}
          </button>
        ))}
      </div>
      <button
        className="reset-button"
        onClick={() => dispatch(resetGame())}
      >
        Начать заново
      </button>
    </div>
  );
}
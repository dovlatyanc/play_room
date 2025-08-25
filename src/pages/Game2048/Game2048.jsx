import '../../styles/game2048.css';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moveLeft, moveRight, moveUp, moveDown, resetGame } from '../../store/game2048slice';
import Tile from '../../components/Tile';

export default function Game2048() {
  const { grid, score, gameOver, gameWon } = useSelector((state) => state.game2048);
  const dispatch = useDispatch();


  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
          dispatch(moveUp());
          break;
        case 'ArrowDown':
          dispatch(moveDown());
          break;
        case 'ArrowLeft':
          dispatch(moveLeft());
          break;
        case 'ArrowRight':
          dispatch(moveRight());
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return (
    <div className="game-container">
      <div className="header">
        <h2>2048</h2>
        <div>Очки: {score}</div>
        <button onClick={() => dispatch(resetGame())}>Новая игра</button>
      </div>

      {gameWon && <div className="message">🎉 Победа! 2048 достигнуто!</div>}
      {gameOver && !gameWon && <div className="message">💥 Игра окончена! Нет ходов.</div>}

      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Tile key={`${rowIndex}-${colIndex}`} value={cell} />
          ))
        )}
      </div>
    </div>
  );
}
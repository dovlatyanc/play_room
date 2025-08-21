
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, register } from '../store/authSlice';
import '../styles/AuthForm.css'; // ← импортируем стили

export default function AuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await dispatch(login({ username, password })).unwrap();
      } else {
        await dispatch(register({ username, password })).unwrap();
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка');
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>

      <button
        type="button"
        className="toggle-btn"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? 'Нет аккаунта? Зарегистрироваться'
          : 'Уже есть аккаунт? Войти'}
      </button>
    </div>
  );
}
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

import '../../styles/navbar.css'

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        

        {/* Бургер-иконка */}
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
        </div>

        {/* Меню */}
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              {t('home')}
            </Link>
          </li>
          <li>
            <Link to="/About" className={location.pathname === '/About' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              {t('about')}
            </Link>
          </li>
          <li>
            <Link to="/game" className={location.pathname === '/game' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              {t('games')}
            </Link>
          </li>
          <li>
            <Link to="/2048" className={location.pathname === '/2048' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              {t('game_2048')}
            </Link>
          </li>
          <li>
            <Link to="/tictactoe" className={location.pathname === '/tictactoe' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              {t('tictactoe')}
            </Link>
           
          </li>
           <li>
            <Link to="/roguelike" className={location.pathname === '/roguelike' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              {t('roguelike')}
            </Link>
          </li>
          <li>
            <Link to="/418" className={location.pathname === '/418' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              {t('418')}
            </Link>
          </li>
          <div className="buttonAuth">
            <Link to="/Auth" className={location.pathname === '/Auth' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              {t('auth')}
            </Link>
          </div>
        </ul>

        {/* Переключатель языка */}
        <div className="navbar-language">
          <LanguageSwitcher />
        </div>
         
      </div>
    </nav>
  );
}
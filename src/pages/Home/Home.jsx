import "../../styles/Home2.css"

export default function Home() {
  return (
    <div className="home-page">
      <h1 className="title">Добро пожаловать в мир игр!</h1>
      
      <div className="intro-section">
        <p className="intro-text">
          🎮 Выберите игру по вкусу и окунитесь в мир развлечений, стратегий и адреналина!
        </p>
      </div>


      <div className="advantages-section">
        <h2 className="section-title">🚀 Почему выбирают нас?</h2>
        <ul className="advantages-list">
          <li className="advantage-item">✅ Бесплатный доступ к играм</li>
          <li className="advantage-item">✅ Регулярные обновления и новые релизы</li>
          <li className="advantage-item">✅ Удобный интерфейс – играйте прямо на странице браузера</li>
        </ul>
      </div>

      <div className="cta-section">
        <p className="cta-text">👉 Начните играть прямо сейчас!</p>
        <p className="cta-moto">🔥 Готовы к вызову? Ваше приключение начинается здесь!</p>
      </div>
    </div>
  );
}
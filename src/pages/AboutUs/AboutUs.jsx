import "../../styles/AboutUs.css"
export default function AboutUs() {
  return (
    <div className="about-us">
      <header className="about-header">
        <h1>О нашей игровой платформе</h1>
        <p className="tagline">Играйте, соревнуйтесь, побеждайте!</p>
      </header>

      <section className="about-content">
        <div className="mission">
          <h2>Наша миссия</h2>
          <p>
            Мы создаем пространство, где каждый может найти игру по душе - 
            будь то захватывающие приключения, интеллектуальные головоломки 
            или динамичные аркады. Наша цель - дарить радость и положительные эмоции.
          </p>
        </div>

        <div className="team">
          <h2>Наша команда</h2>
          <p>
            Мы - группа энтузиастов, объединенных любовью к играм. 
            В нашем коллективе:
          </p>
          <ul>
            <li>Опытные разработчики</li>
            <li>Креативные дизайнеры</li>
            <li>Профессиональные гейм-тестеры</li>
            <li>Дружелюбная служба поддержки</li>
          </ul>
        </div>

        <div className="features">
          <h2>Что мы предлагаем</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Игры</h3>
              <p>в перспективе огромный выбор на любой вкус</p>
            </div>
            <div className="feature-card">
              <h3>Бесплатно</h3>
              <p>Никаких скрытых платежей</p>
            </div>
            <div className="feature-card">
              <h3>Без регистрации</h3>
              <p>Начинайте играть сразу</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <p>Присоединяйтесь к нашему игровому сообществу!</p>
        
      </footer>
    </div>
  );
}
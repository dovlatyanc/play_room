
export default function Card({ card, icon: Icon, onClick }) {
  return (
    <div 
      className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`} 
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">
          {/* Рубашка карты */}
        </div>
        <div className="card-back">
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </div>
  );
}


const Tile = ({ value }) => {
  const tileStyle = {
    backgroundColor:
      value === 2 ? '#a49e9eff' :
      value === 4 ? '#fee3b1ff' :
      value === 8 ? '#f2b179' :
      value === 16 ? '#f59563' :
      value === 32 ? '#f67c5f' :
      value === 64 ? '#f65e3b' :
      value === 128 ? '#edcf72' :
      value === 256 ? '#edcc61' :
      value === 512 ? '#edc850' :
      value === 1024 ? '#edc53f' :
      value === 2048 ? '#edc22e' : '#f9f9f9', // для пустых плиток
    color: value !== 0 ? '#fff' : '#ccc',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '10px',
    margin: '5px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxShadow: 'inset 0 0 2px rgba(0, 0, 0, 0.1)',
  };

  return <div style={tileStyle}>{value !== 0 && value}</div>;
};

export default Tile;
import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/roguelike.css';

// Импортируем изображения 
const tileImages = {
  default: '/img/tile-.png',
  wall: '/img/tile-W.png',
  enemy: '/img/tile-Enemy.png',
  player: '/img/tile-P.png',
  healthPotion: '/img/tile-HP.png',
  sword: '/img/tile-SW.png'
};
const Roguelike = () => {
  // Константы игры
  const WIDTH = 30; 
  const HEIGHT = 18;
  const TILE_SIZE = 50;

  // Состояние игры
  const [map, setMap] = useState([]);
  const [hero, setHero] = useState({ x: 0, y: 0, health: 30, maxHealth: 30, attackPower: 1 });
  const [enemies, setEnemies] = useState([]);
  const [swords, setSwords] = useState([]);
  const [potions, setPotions] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  // Создание героя
   const createHero = useCallback(() => ({
    x: 0,
    y: 0,
    health: 30,
    maxHealth: 30,
    attackPower: 1
  }), []);

  // Генерация карты
   const generateConnectedMap = useCallback(() => {
    const newMap = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(1));
    const rooms = generateRooms(newMap, 3, 4);
    connectAllRooms(newMap, rooms);
    ensureConnectivity(newMap);
    return newMap;
  }, [HEIGHT, WIDTH]);

  const createEmptyMap = useCallback(() => {
    return Array(HEIGHT).fill().map(() => Array(WIDTH).fill(1));
  }, [HEIGHT, WIDTH]);

  const generateRooms = useCallback((map, minRooms, maxRooms) => {
    const rooms = [];
    const roomCount = Math.floor(Math.random() * (maxRooms - minRooms + 1)) + minRooms;
    
    for (let i = 0; i < roomCount; i++) {
      const room = generateValidRoom(map, rooms);
      if (room) {
        rooms.push(room);
        carveRoom(map, room);
      }
    }
    
    return rooms;
  }, []);

  const generateValidRoom = useCallback((map, existingRooms, maxAttempts = 50) => {
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      const w = Math.floor(Math.random() * 4) + 4;
      const h = Math.floor(Math.random() * 3) + 4;
      const x = Math.floor(Math.random() * (WIDTH - w - 4)) + 2;
      const y = Math.floor(Math.random() * (HEIGHT - h - 4)) + 2;
      
      const room = { x, y, w, h, centerX: Math.floor(x + w/2), centerY: Math.floor(y + h/2) };
      
      if (!doesRoomOverlap(room, existingRooms)) {
        return room;
      }
    }
    return null;
  }, [WIDTH, HEIGHT]);

  const doesRoomOverlap = useCallback((room, existingRooms) => {
    return existingRooms.some(existingRoom => 
      room.x < existingRoom.x + existingRoom.w + 2 &&
      room.x + room.w + 2 > existingRoom.x &&
      room.y < existingRoom.y + existingRoom.h + 2 &&
      room.y + room.h + 2 > existingRoom.y
    );
  }, []);

  const carveRoom = useCallback((map, room) => {
    for (let dy = 0; dy < room.h; dy++) {
      for (let dx = 0; dx < room.w; dx++) {
        map[room.y + dy][room.x + dx] = 0;
      }
    }
  }, []);

  // Соединение комнат
  const connectAllRooms = useCallback((map, rooms) => {
    if (rooms.length < 2) return;
    
    const connections = createRoomConnections(rooms);
    const mst = findMinimumSpanningTree(connections, rooms.length);
    createExtraConnections(map, connections, mst, rooms);
  }, []);

  const createRoomConnections = useCallback((rooms) => {
    const connections = [];
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const distance = Math.abs(rooms[i].centerX - rooms[j].centerX) + 
                       Math.abs(rooms[i].centerY - rooms[j].centerY);
        connections.push({ from: i, to: j, distance });
      }
    }
    return connections.sort((a, b) => a.distance - b.distance);
  }, []);

  const findMinimumSpanningTree = useCallback((connections, roomCount) => {
    const parent = {};
    for (let i = 0; i < roomCount; i++) parent[i] = i;
    
    const find = (x) => {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    };
    
    const mst = [];
    for (const conn of connections) {
      const rootFrom = find(conn.from);
      const rootTo = find(conn.to);
      
      if (rootFrom !== rootTo) {
        mst.push(conn);
        parent[rootFrom] = rootTo;
      }
    }
    
    return mst;
  }, []);

  const createExtraConnections = useCallback((map, connections, mst, rooms) => {
    const extraConnections = Math.min(2, connections.length - mst.length);
    for (let i = 0; i < extraConnections; i++) {
      const randomConn = connections[Math.floor(Math.random() * connections.length)];
      if (!mst.includes(randomConn)) {
        connectRooms(map, rooms[randomConn.from], rooms[randomConn.to]);
      }
    }
  }, []);

  const connectRooms = useCallback((map, room1, room2) => {
    let x = room1.centerX;
    let y = room1.centerY;
    
    const horizontalFirst = Math.random() > 0.5;
    
    if (horizontalFirst) {
      createHorizontalCorridor(map, x, room2.centerX, y);
      createVerticalCorridor(map, y, room2.centerY, room2.centerX);
    } else {
      createVerticalCorridor(map, y, room2.centerY, x);
      createHorizontalCorridor(map, x, room2.centerX, room2.centerY);
    }
    
    map[room2.centerY][room2.centerX] = 0;
  }, []);

  const createHorizontalCorridor = useCallback((map, startX, endX, y) => {
    const step = startX < endX ? 1 : -1;
    for (let x = startX; x !== endX; x += step) {
      map[y][x] = 0;
    }
  }, []);

  const createVerticalCorridor = useCallback((map, startY, endY, x) => {
    const step = startY < endY ? 1 : -1;
    for (let y = startY; y !== endY; y += step) {
      map[y][x] = 0;
    }
  }, []);

  // Обеспечение связности
  const ensureConnectivity = useCallback((map) => {
    const visited = Array(HEIGHT).fill().map(() => Array(WIDTH).fill(false));
    const components = findConnectedComponents(map, visited);
    
    if (components.length > 1) {
      connectComponents(map, components);
    }
  }, [HEIGHT, WIDTH]);

  const findConnectedComponents = useCallback((map, visited) => {
    const components = [];
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if (map[y][x] === 0 && !visited[y][x]) {
          const component = [];
          floodFill(map, x, y, visited, component);
          components.push(component);
        }
      }
    }
    return components;
  }, [HEIGHT, WIDTH]);

  const floodFill = useCallback((map, x, y, visited, component) => {
    const stack = [{x, y}];
    const directions = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}];
    
    while (stack.length > 0) {
      const current = stack.pop();
      
      if (isInvalidCell(map, current.x, current.y, visited)) continue;
      
      visited[current.y][current.x] = true;
      component.push({ x: current.x, y: current.y });
      
      directions.forEach(dir => {
        stack.push({x: current.x + dir.x, y: current.y + dir.y});
      });
    }
  }, []);

  const isInvalidCell = useCallback((map, x, y, visited) => {
    return x < 0 || x >= WIDTH || 
           y < 0 || y >= HEIGHT ||
           visited[y][x] || 
           map[y][x] === 1;
  }, [WIDTH, HEIGHT]);

  const connectComponents = useCallback((map, components) => {
    for (let i = 0; i < components.length - 1; i++) {
      const point1 = components[i][Math.floor(Math.random() * components[i].length)];
      const point2 = components[i + 1][Math.floor(Math.random() * components[i + 1].length)];
      connectPoints(map, point1, point2);
    }
  }, []);

  const connectPoints = useCallback((map, point1, point2) => {
    let x = point1.x;
    let y = point1.y;
    
    while (x !== point2.x || y !== point2.y) {
      map[y][x] = 0;
      
      if (x !== point2.x && (y === point2.y || Math.random() > 0.5)) {
        x += (x < point2.x) ? 1 : -1;
      } else {
        y += (y < point2.y) ? 1 : -1;
      }
    }
    
    map[y][x] = 0;
  }, []);

  // Движение и взаимодействия
  const isValidMove = useCallback((x, y) => {
    return x >= 0 && x < WIDTH &&
           y >= 0 && y < HEIGHT &&
           map[y] && map[y][x] === 0;
  }, [map, WIDTH, HEIGHT]);

  const isCellOccupied = useCallback((x, y, excludeEnemy = null) => {
    if (hero.x === x && hero.y === y) return true;
    
    const enemyOccupied = enemies.some(enemy => 
      enemy.x === x && enemy.y === y && (!excludeEnemy || enemy !== excludeEnemy)
    );
    
    if (enemyOccupied) return true;
    
    return swords.some(sword => sword.x === x && sword.y === y) ||
           potions.some(potion => potion.x === x && potion.y === y);
  }, [hero, enemies, swords, potions]);

  const moveHero = useCallback((dx, dy) => {
    if (gameOver || victory) return;

    const newX = hero.x + dx;
    const newY = hero.y + dy;

    if (isValidMove(newX, newY)) {
      const newHero = { ...hero, x: newX, y: newY };
      setHero(newHero);
      checkInteractions(newX, newY);
    }
  }, [hero, gameOver, victory, isValidMove]);

   const checkInteractions = useCallback((x, y) => {
    // Проверка мечей
    const swordIndex = swords.findIndex(s => s.x === x && s.y === y);
    if (swordIndex !== -1) {
      setSwords(prev => prev.filter((_, i) => i !== swordIndex));
      setHero(prev => ({ ...prev, attackPower: prev.attackPower + 2 }));
    }

    // Проверка зелий
    const potionIndex = potions.findIndex(p => p.x === x && p.y === y);
    if (potionIndex !== -1) {
      setPotions(prev => prev.filter((_, i) => i !== potionIndex));
      setHero(prev => ({ 
        ...prev, 
        health: Math.min(prev.maxHealth, prev.health + 20) 
      }));
    }

    // Проверка врагов
    const enemyIndex = enemies.findIndex(e => e.x === x && e.y === y);
    if (enemyIndex !== -1) {
      const enemy = enemies[enemyIndex];
      const newHealth = hero.health - enemy.attackPower;
      
      setHero(prev => ({ ...prev, health: newHealth }));
      
      if (newHealth <= 0) {
        setGameOver(true);
      }
    }
  }, [swords, potions, enemies, hero.health]);

  

   const attack = useCallback(() => {
    if (gameOver || victory) return;

    const directions = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
    let hit = false;
    let newEnemies = [...enemies];

    directions.forEach(dir => {
      const ex = hero.x + dir.x;
      const ey = hero.y + dir.y;

      const enemyIndex = newEnemies.findIndex(e => e.x === ex && e.y === ey);
      if (enemyIndex !== -1) {
        hit = true;
        newEnemies[enemyIndex] = {
          ...newEnemies[enemyIndex],
          health: newEnemies[enemyIndex].health - hero.attackPower
        };

        if (newEnemies[enemyIndex].health <= 0) {
          newEnemies.splice(enemyIndex, 1);
        }
      }
    });

    if (hit) {
      setEnemies(newEnemies);
      if (newEnemies.length === 0) {
        setVictory(true);
      }
    }
  }, [hero, enemies, gameOver, victory]);

  
const enemiesAttack = useCallback(() => {
  if (gameOver || victory) return;

  enemies.forEach(enemy => {
    const distance = Math.abs(enemy.x - hero.x) + Math.abs(enemy.y - hero.y);
    
    if (distance === 1) { // Враг рядом с героем
      const newHealth = hero.health - enemy.attackPower;
      setHero(prev => ({ ...prev, health: newHealth }));
      
      if (newHealth <= 0) {
        setGameOver(true);
      }
    }
  });
}, [enemies, hero, gameOver, victory]);

  const moveEnemy = useCallback((enemy, allEnemies) => {
    const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
    const validMoves = directions.filter(dir => {
      const newX = enemy.x + dir.x;
      const newY = enemy.y + dir.y;
      
      return isValidMove(newX, newY) && !isCellOccupied(newX, newY, enemy);
    });
    
    if (validMoves.length > 0) {
      const move = validMoves[Math.floor(Math.random() * validMoves.length)];
      return { ...enemy, x: enemy.x + move.x, y: enemy.y + move.y };
    }
    
    return enemy;
  }, [isValidMove, isCellOccupied]);

  const moveEnemies = useCallback(() => {
  if (gameOver || victory) return;

  setEnemies(prevEnemies => {
    const updatedEnemies = prevEnemies.map(enemy => {
      if (Math.random() > 0.7) {
        return moveEnemy(enemy, prevEnemies);
      }
      return enemy;
    });
    
    // После обновления врагов проверяем атаку
    setTimeout(() => {
      enemiesAttack();
    }, 0);
    
    return updatedEnemies;
  });
}, [gameOver, victory, moveEnemy, enemiesAttack]);


  // Управление игрой
  const gameOverFunc = useCallback(() => {
    setGameOver(true);
  }, []);

  const checkVictory = useCallback((currentEnemies) => {
    if (currentEnemies.length === 0) {
      setVictory(true);
      return true;
    }
    return false;
  }, []);

  // Размещение предметов
  const getEmptyCells = useCallback(() => {
    const cells = [];
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if (map[y][x] === 0) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  }, [map, HEIGHT, WIDTH]);

  const shuffleArray = useCallback((array) => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }, []);

  const placeItems = useCallback(() => {
    let emptyCells = shuffleArray(getEmptyCells());

    if (emptyCells.length > 0) {
      const heroCell = emptyCells.pop();
      setHero(prev => ({ ...prev, x: heroCell.x, y: heroCell.y }));
    }

    placeEnemies(emptyCells, 10);
    placeSwords(emptyCells, 2);
    placePotions(emptyCells, 10);
  }, [getEmptyCells, shuffleArray]);

  const placeEnemies = useCallback((cells, count) => {
    const newEnemies = [];
    for (let i = 0; i < count && cells.length > 0; i++) {
      const cell = cells.pop();
      newEnemies.push({ 
        x: cell.x, 
        y: cell.y, 
        health: 15,
        maxHealth: 15,
        attackPower: Math.floor(Math.random() * 3) + 2
      });
    }
    setEnemies(newEnemies);
  }, []);

  const placeSwords = useCallback((cells, count) => {
    const newSwords = [];
    for (let i = 0; i < count && cells.length > 0; i++) {
      newSwords.push(cells.pop());
    }
    setSwords(newSwords);
  }, []);

  const placePotions = useCallback((cells, count) => {
    const newPotions = [];
    for (let i = 0; i < count && cells.length > 0; i++) {
      newPotions.push(cells.pop());
    }
    setPotions(newPotions);
  }, []);

  // Инициализация игры
  useEffect(() => {
    const initGame = () => {
      const newMap = generateConnectedMap();
      setMap(newMap);
      setHero(createHero());
      setEnemies([]);
      setSwords([]);
      setPotions([]);
      setGameOver(false);
      setVictory(false);

      // Размещение предметов после генерации карты
      const emptyCells = [];
      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
          if (newMap[y][x] === 0) {
            emptyCells.push({ x, y });
          }
        }
      }

      // Перемешиваем клетки
      const shuffledCells = [...emptyCells].sort(() => Math.random() - 0.5);

      if (shuffledCells.length > 0) {
        // Размещаем героя
        const heroCell = shuffledCells.pop();
        setHero(prev => ({ ...prev, x: heroCell.x, y: heroCell.y }));

        // Размещаем врагов (5 врагов)
        const newEnemies = [];
        for (let i = 0; i < 5 && shuffledCells.length > 0; i++) {
          const cell = shuffledCells.pop();
          newEnemies.push({ 
            x: cell.x, 
            y: cell.y, 
            health: 15,
            maxHealth: 15,
            attackPower: Math.floor(Math.random() * 3) + 2
          });
        }
        setEnemies(newEnemies);

        // Размещаем мечи (2 меча)
        const newSwords = [];
        for (let i = 0; i < 2 && shuffledCells.length > 0; i++) {
          newSwords.push(shuffledCells.pop());
        }
        setSwords(newSwords);

        // Размещаем зелья (5 зелий)
        const newPotions = [];
        for (let i = 0; i < 5 && shuffledCells.length > 0; i++) {
          newPotions.push(shuffledCells.pop());
        }
        setPotions(newPotions);
      }
    };

    initGame();
  }, [generateConnectedMap, createHero, HEIGHT, WIDTH]);

useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || victory) return;

      const keyMap = {
        'w': () => moveHero(0, -1),
        'ц': () => moveHero(0, -1),
        's': () => moveHero(0, 1),
        'ы': () => moveHero(0, 1),
        'a': () => moveHero(-1, 0),
        'ф': () => moveHero(-1, 0),
        'd': () => moveHero(1, 0),
        'в': () => moveHero(1, 0),
        ' ': () => attack()
      };

      const action = keyMap[e.key.toLowerCase()];
      if (action) {
        e.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveHero, attack, gameOver, victory]);

  // Движение врагов
  useEffect(() => {
    if (gameOver || victory) return;

    const interval = setInterval(() => {
      moveEnemies();
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, victory, moveEnemies]);

  // Отрисовка
  const renderTile = (x, y) => {
    if (!map[y] || map[y][x] === undefined) return null;

    const isWall = map[y][x] === 1;
    const isPlayer = hero.x === x && hero.y === y;
    const isEnemy = enemies.some(e => e.x === x && e.y === y);
    const isSword = swords.some(s => s.x === x && s.y === y);
    const isPotion = potions.some(p => p.x === x && p.y === y);

    let tileClass = 'tile';
    let healthBar = null;

    if (isWall) {
      tileClass += ' tileW';
    } else if (isPlayer) {
      tileClass += ' tileP';
      healthBar = (
        <div className="health" style={{ width: `${(hero.health / hero.maxHealth) * 100}%` }}></div>
      );
    } else if (isEnemy) {
      tileClass += ' tileE';
      const enemy = enemies.find(e => e.x === x && e.y === y);
      if (enemy) {
        healthBar = (
          <div className="health" style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}></div>
        );
      }
    } else if (isSword) {
      tileClass += ' tileSW';
    } else if (isPotion) {
      tileClass += ' tileHP';
    }

    return (
      <div
        key={`${x}-${y}`}
        className={tileClass}
        style={{
          left: x * TILE_SIZE,
          top: y * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE
        }}
      >
        {healthBar}
      </div>
    );
  };


  return (
    <div className="game-container">
      <h1>Roguelike Game</h1>
      
      <div className="stats">
        <div>Здоровье: {hero.health}/{hero.maxHealth}</div>
        <div>Атака: {hero.attackPower}</div>
        <div>Врагов осталось: {enemies.length}</div>
      </div>
      
      <div className="field-box">
        <div 
          className="field" 
          style={{ width: WIDTH * TILE_SIZE, height: HEIGHT * TILE_SIZE }}
        >
          {map.map((row, y) => row.map((_, x) => renderTile(x, y)))}
        </div>
      </div>

      <div className="cl"></div>

      {gameOver && (
        <div className="game-overlay">
          <div className="game-message">
            <h2>Игра окончена! Герой погиб.</h2>
            <button onClick={() => window.location.reload()}>Новая игра</button>
          </div>
        </div>
      )}

      {victory && (
        <div className="game-overlay">
          <div className="game-message">
            <h2>Поздравляем! Вы победили!</h2>
            <button onClick={() => window.location.reload()}>Новая игра</button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Roguelike;
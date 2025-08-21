const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  console.error('FATAL ERROR: JWT_SECRET is not defined');
  process.exit(1);
}

// Временное хранилище данных 
const users = [];
const records = [];

// Создаем объект класса приложения express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


const app_folder = "C:\\Users\\User\\Desktop\\new-appIcons-master\\dist";
app.use('/', express.static(app_folder));

// Обслуживаем корневую директорию
app.all('/', (req, res) => {
    res.status(200).sendFile('/', { root: app_folder });
});

// Регистрация нового пользователя
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Имя пользователя и пароль обязательны' });
    }
    
    // Проверка существования пользователя
    if (users.some(u => u.username === username)) {
        return res.status(409).json({ message: 'Пользователь уже существует' });
    }
    // Сохраняем
    users.push({ username, password });
    res.status(201).json({ message: 'Регистрация успешна' });
});

// Аутентификация
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Поиск пользователя
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ message: 'Неверные учетные данные' });
    }
    
    // Создаем JWT токен
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    
    res.json({ 
        message: 'Аутентификация успешна',
        token,
        user: { username }
    });
});

// Middleware проверки аутентификации
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Сохранение рекорда (требует аутентификации)
app.post('/api/save-record', authenticateToken, (req, res) => {
    const { time } = req.body;
    const username = req.user.username;
    
    if (typeof time !== 'number') {
        return res.status(400).json({ message: 'Некорректное время' });
    }
    
    // Сохраняем рекорд
    records.push({
        username,
        time,
        date: new Date().toISOString()
    });
    
    res.status(201).json({ message: 'Рекорд сохранен' });
});

// Получение рекордов пользователя
app.get('/api/records', authenticateToken, (req, res) => {
    const username = req.user.username;
    const userRecords = records
        .filter(r => r.username === username)
        .sort((a, b) => a.time - b.time)
        .slice(0, 10); // Топ-10 результатов
    
    res.json(userRecords);
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Статические файлы обслуживаются из: ${app_folder}`);
});
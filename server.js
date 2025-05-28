// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Создаем папку videos, если она не существует
const videosDir = path.join(__dirname, 'videos');
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir);
}

// Настройка Multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'videos/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalName));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /mp4|mov|avi|mkv/;
        const extname = filetypes.test(path.extname(file.originalName).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Разрешены только видеофайлы (mp4, mov, avi, mkv)!'));
        }
    },
    limits: { fileSize: 100 * 1024 * 1024 } // Ограничение размера файла до 100 МБ
});

// Статическое обслуживание файлов из папки videos
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// API для загрузки видео
app.post('/api/upload-video', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Видеофайл не загружен или неверный тип файла' });
    }

    const videoUrl = `/videos/${req.file.filename}`;
    res.json({ message: 'Видео успешно загружено', videoUrl });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
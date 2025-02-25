const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000; // Render использует свой порт, поэтому лучше использовать переменную окружения

// Middleware для обработки JSON
app.use(express.json());

// Обработка GET-запросов к корневому пути
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

// Маршрут для обработки запросов от фронтенда
app.post('/ask-assistant', async (req, res) => {
  const userInput = req.body.userInput;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4", // или "gpt-3.5-turbo"
        messages: [
          { role: "system", content: "Вы — помощник, который подсказывает пользователям, присылает ссылки и предлагает документы." },
          { role: "user", content: userInput }
        ],
        max_tokens: 500 // Ограничиваем длину ответа
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const generatedText = response.data.choices[0].message.content;
    res.json({ result: generatedText });
  } catch (error) {
    console.error('Ошибка:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Ошибка при обработке запроса', details: error.message });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
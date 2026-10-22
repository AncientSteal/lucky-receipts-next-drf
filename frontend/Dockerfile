FROM node:22-slim

WORKDIR /app

# Копируем файлы конфигурации зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код нового фронтенда
COPY . .

# Next.js по умолчанию работает на порту 3000
EXPOSE 3000

# Запускаем сервер разработки Next.js
CMD ["npm", "run", "dev"]
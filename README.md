# hibi

Трекер привычек с недельной сеткой.

**Demo:** [hibiflow.ru](https://hibiflow.ru/)  
**Backend:** [dotnil/hibi-hono](https://github.com/dotnil/hibi-hono)

## Возможности
- регистрация
- авторизация
- CRUD привычек
- недельная сетка
- ежедневные отметки

## Стек

| Слой      | Решение                                   |
|-----------|-------------------------------------------|
| Framework | Vue 3, Composition API (`<script setup>`) |
| Routing   | Vue Router 5 (HTML5 history)              |
| Build     | Vite 8                                    |
| DevEnv    | Nix flakes + direnv                       |
| Deploy    | `buildNpmPackage` → статика               |

## Установка и запуск

### Требования

- Node.js 24+
- npm

(Опционально) Nix + direnv — окружение активируется автоматически.

### Установка

npm install

### Сервер разработки

npm run dev — http://localhost:3000

## Сборка

npm run build     # production сборка в dist/
npm run preview   # предпросмотр
nix build         # Nix сборка (./result/)

## Переменные окружения

| Переменная  | Dev                     | Prod                      |
|-------------|-------------------------|---------------------------|
| `VITE_BACK` | `http://localhost:3003` | `https://api.hibiflow.ru` |


## Инженерные решения

Архитектура → ARCHITECTURE.md

### Минимум зависимостей

Только `vue` + `vue-router`. HTTP — нативный `fetch`.
Зависимости считаются кодом: чем их меньше, тем проще поддерживать.

### JWT в httpOnly cookie

Токен живёт в httpOnly cookie, сервер управляет его жизненным циклом.
Клиент просто отправляет `credentials: 'include'` — не нужно хранить, обновлять
или передавать токен вручную.

### Nix flakes для воспроизводимости

`flake.nix` фиксирует версию Node.js и переменные окружения.
Одна команда `nix build` — воспроизводимый production-артефакт без «works on my machine».

### Separation of concerns

```
src/
  api-client/   — абстракция над fetch (один модуль на ресурс)
  pages/        — страницы, владеют состоянием
  components/   — презентационные, общаются через emits
  utils/        — чистые функции
```


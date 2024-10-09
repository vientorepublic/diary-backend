# Diary Backend

[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
[![stars - diary-backend](https://img.shields.io/github/stars/vientorepublic/diary-backend?style=social)](https://github.com/vientorepublic/diary-backend)
[![forks - diary-backend](https://img.shields.io/github/forks/vientorepublic/diary-backend?style=social)](https://github.com/vientorepublic/diary-backend)
[![Nodejs CI](https://github.com/vientorepublic/diary-backend/actions/workflows/nodejs.yml/badge.svg)](https://github.com/vientorepublic/diary-backend/actions/workflows/nodejs.yml)

[글귀저장소](https://github.com/vientorepublic/diary-backend)의 백엔드 서버 구현체입니다.

# Requirements

- Node.js 20.x
- MariaDB Database Server

# Environment Variables

```
PORT=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
FRONTEND_HOST=
RECAPTCHA_SECRET=
JWT_SECRET=
```

Generate JWT Secret: `openssl rand -hex 64`

# Install Dependency

```
npm install
```

# Production Build

```
npm run build
```

# Development Server

```
npm run start:dev
```

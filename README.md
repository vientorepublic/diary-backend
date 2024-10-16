# Diary Backend

[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
[![stars - diary-backend](https://img.shields.io/github/stars/vientorepublic/diary-backend?style=social)](https://github.com/vientorepublic/diary-backend)
[![forks - diary-backend](https://img.shields.io/github/forks/vientorepublic/diary-backend?style=social)](https://github.com/vientorepublic/diary-backend)
[![Nodejs CI](https://github.com/vientorepublic/diary-backend/actions/workflows/nodejs.yml/badge.svg)](https://github.com/vientorepublic/diary-backend/actions/workflows/nodejs.yml)

[글귀저장소](https://github.com/vientorepublic/diary-backend)의 백엔드 서버 구현체입니다.

# Requirements

- Node.js 20.x
- MariaDB Database Server

# SQL Tables

- users

```sql
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL,
  `passphrase` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profile_image` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `permission` int(11) NOT NULL DEFAULT 2,
  `verified` tinyint(4) NOT NULL DEFAULT 0,
  `verify_identifier` varchar(255) DEFAULT NULL,
  `verify_expiresAt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

- posts

```sql
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL,
  `title` varchar(50) NOT NULL,
  `preview` varchar(100) NOT NULL,
  `text` text NOT NULL,
  `public_post` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` varchar(255) NOT NULL,
  `edited_at` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

- drafts

```sql
CREATE TABLE `drafts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `modified_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

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
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
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

# Backend for "disk space" web-service

You can find frontend here - https://github.com/polioan/disk-space-frontend

## System requirements
- **nodejs** >= 15
- **npm** > 8

## How to launch

First create .env file and fill it with values (check example .env.example)
```
touch .env
```

Install dependencies
```
npm ci
```

Migrate  db
```
npm run migrate-dev
```

Start in dev
```
npm run dev
```

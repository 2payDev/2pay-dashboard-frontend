# Terminal Dashboard Frontend

React TypeScript frontend for the Terminal Dashboard LCD display.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from `.env.example` and update the API URL:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL (default: `http://localhost:8000`)

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Build for Production

To build the app for production deployment:

```bash
npm run build
```

The build folder will contain the optimized production build.

## Features

- Auto-refreshes every 60 seconds
- Modern, responsive design optimized for LCD displays
- Real-time transaction updates
- Progress bar for target achievement
- Beautiful gradient backgrounds and animations

## Configuration

- Auto-refresh interval: Set in `App.tsx` (currently 60000ms = 1 minute)
- API URL: Configure in `.env` file
- Styling: Customize in `src/components/Dashboard.css`


# Unity Frontend

Multi-app React frontend for Unity Hub, built with Vite + TypeScript.  
This repository hosts multiple domain apps in one shell (eMandi, MoneyTrail, SmartHome, PotatoStock) with shared layout, auth context, and Redux store.

## Apps and Routes

| App | Base Route | Primary Pages |
| --- | --- | --- |
| eMandi | `/emandi` | dashboard, gate passes, parties |
| MoneyTrail | `/moneytrail` | dashboard, review |
| SmartHome | `/smarthome` | dashboard, devices |
| PotatoStock | `/potatostock` | dashboard, inventory, transfer, price update |

Entry/login routes:
- `/` -> login
- `/app-selection` -> app switcher

## Tech Stack

- React 19
- TypeScript
- Vite 5
- Redux Toolkit + RTK Query
- React Router 7
- Ant Design 5
- Tailwind CSS
- Lucide React icons

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- Unity backend running locally (default proxy target: `http://localhost:8080`)

## Environment Variables

Create a `.env` file in repo root:

```env
VITE_BING_MAPS_KEY=your_bing_maps_key
```

Used for distance/map lookups in MoneyTrail.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Ensure backend API is reachable at `http://localhost:8080` (or update proxy in `vite.config.ts`).
3. Start frontend:

```bash
npm run dev
```

4. Open `http://localhost:5173`.

## Available Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

Type-check only:

```bash
npx tsc --noEmit
```
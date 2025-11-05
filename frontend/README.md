# YouTube Agent Frontend

Modern React frontend built with Vite, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Build for Production

```bash
# Build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── Chat.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Message.tsx
│   │   └── ExampleQueries.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useChat.ts
│   ├── services/        # API service layer
│   │   └── api.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file (optional):

```env
VITE_API_URL=http://localhost:8000
```

## 🎨 Styling

This project uses Tailwind CSS with custom theme configuration. See `tailwind.config.js` for theme customization.

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Hooks** - State management


# Card Game Frontend

A modern card game frontend built with Vite, React 19, TypeScript, and Tailwind CSS.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 19** - Latest React version
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
frontend-vite/
├── src/
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components (Login, Register)
│   │   └── ...           # Game components
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── services/         # API services
│   │   └── api.ts        # API client with JWT token management
│   ├── types/            # TypeScript types
│   │   └── api.ts        # API request/response types
│   ├── utils/            # Utility functions
│   │   └── token.ts      # Token storage utilities
│   ├── config/           # Configuration
│   │   └── api.ts        # API configuration
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles with Tailwind
├── public/               # Static assets
├── index.html            # HTML template
└── vite.config.ts        # Vite configuration
```

## Authentication

The app uses JWT-based authentication integrated with the backend API.

### Features

- **Login/Register**: User authentication with JWT tokens
- **Token Management**: Automatic token storage and validation
- **Protected Routes**: Components wrapped with authentication checks
- **Auto-logout**: Token validation on app load
- **User Context**: Global authentication state management

### API Configuration

The API base URL can be configured via environment variable:

```bash
VITE_API_BASE_URL=http://localhost:8050
```

Default backend URL is `http://localhost:8050` (matches backend server port).

### Authentication Flow

1. User logs in or registers
2. JWT token is received and stored in localStorage
3. Token is automatically included in API requests
4. Token is validated on app initialization
5. Protected routes check authentication status
6. Logout clears token and user data

### Usage

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use authentication state
}
```


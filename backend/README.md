# Luckyman Backend

A professional TypeScript backend for the Luckyman card game application.

## Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   └── database.ts        # TypeORM database configuration
│   ├── constants/
│   │   ├── config.ts          # Application configuration
│   │   ├── texts.ts           # Text constants
│   │   └── variables.ts       # Game variables
│   ├── controllers/
│   │   ├── AuthController.ts  # Authentication logic
│   │   ├── RoomController.ts  # Room management logic
│   │   └── UploadController.ts # File upload logic
│   ├── entities/
│   │   ├── PersonInfo.ts      # User entity
│   │   ├── RoomInfo.ts        # Room entity
│   │   ├── GameLog.ts         # Game log entity
│   │   └── RoomLogInfo.ts     # Room log entity
│   ├── routes/
│   │   ├── auth.routes.ts     # Authentication routes
│   │   ├── room.routes.ts     # Room routes
│   │   ├── upload.routes.ts   # Upload routes
│   │   └── index.ts           # Route aggregator
│   ├── services/
│   │   ├── PersonInfoService.ts    # User database operations
│   │   ├── RoomInfoService.ts      # Room database operations
│   │   ├── GameLogService.ts       # Game log operations
│   │   └── RoomLogInfoService.ts   # Room log operations
│   ├── sockets/
│   │   └── gameSocket.ts      # Socket.IO game handlers
│   ├── types/
│   │   ├── index.ts           # TypeScript type definitions
│   │   └── card.ts            # Card-related types
│   └── utils/
│       ├── generateUploadFileName.ts
│       ├── randomCardsGenerator.ts
│       ├── outputRestCards.ts
│       ├── outputSortedCardArray.ts
│       └── scoreCalculator.ts
├── public/                    # Static files
├── dist/                      # Compiled JavaScript (generated)
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## Architecture

The backend follows a clean architecture pattern:

- **Entities**: TypeORM entities representing database tables
- **Services**: Data access layer for database operations
- **Controllers**: Business logic and request/response handling
- **Routes**: Express route definitions
- **Sockets**: Socket.IO event handlers for real-time game functionality
- **Types**: TypeScript type definitions and interfaces
- **Utils**: Utility functions for game logic

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
HOST=localhost
USER=your_db_user
PASSWORD=your_db_password
DATABASE=your_database_name
BACKEND_URL=http://localhost:8050
```

3. Build the project:
```bash
npm run build
```

4. Run in development mode:
```bash
npm run dev
```

5. Run in production mode:
```bash
npm start
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with hot reload
- `npm start` - Run compiled JavaScript in production mode
- `npm run server` - Alias for `npm run dev`

## Technology Stack

- **TypeScript**: Type-safe JavaScript
- **Express**: Web framework
- **TypeORM**: Object-Relational Mapping
- **MySQL**: Database
- **Socket.IO**: Real-time communication
- **JWT**: Authentication tokens

## API Endpoints

### Authentication
- `POST /log_in` - User login
- `POST /register` - User registration
- `POST /clear_tk` - Clear user token
- `POST /validate_token` - Validate JWT token

### Rooms
- `POST /create_room` - Create a new game room
- `POST /get_rooms` - Get list of available rooms

### Upload
- `POST /upload` - Upload avatar image

## Socket Events

- `join` - Join a game room
- `disconnect` - User disconnects
- `exit` - Exit a room
- `startgame` - Start a game
- `shutcards` - Play cards
- `passcards` - Pass turn


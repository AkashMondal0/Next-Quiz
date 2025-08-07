# 🧠 Next-Quiz Battle Arena

A real-time multiplayer quiz battle application where players compete against each other in AI-generated quiz challenges. Built with Next.js, NestJS, and Socket.IO for seamless real-time gameplay.

![Quiz Battle Demo](https://via.placeholder.com/800x400/0f172a/white?text=Quiz+Battle+Arena)

## ✨ Features

### 🎮 Core Gameplay
- **Real-time Multiplayer Battles**: Compete with 2-4 players in live quiz matches
- **AI-Generated Questions**: Dynamic quiz content powered by Google Gemini AI
- **Live Scoring & Ranking**: Real-time score updates and leaderboard during matches
- **Time-based Competition**: Performance measured by both accuracy and speed
- **Custom Quiz Topics**: Create personalized quiz battles on any topic

### 🚀 Real-time Features
- **Instant Matchmaking**: Quick match system to find opponents
- **Live Updates**: Real-time score tracking and player activity
- **Battle Room System**: Pre-match lobbies with countdown timers
- **Socket.IO Integration**: Seamless WebSocket communication
- **Responsive UI**: Smooth animations with Framer Motion

### 📊 Advanced Systems
- **Redis Caching**: High-performance data storage and session management
- **JWT Authentication**: Secure user sessions and room management
- **Comprehensive Results**: Detailed match analysis with question-by-question breakdown
- **Player Statistics**: Track performance across multiple matches
- **Room Management**: Create, join, and manage private quiz rooms

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: Redux Toolkit with Redux Persist
- **Real-time**: Socket.IO Client
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios

### Backend (Server)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis (ioredis)
- **Real-time**: Socket.IO (WebSocket Gateway)
- **AI Integration**: Google Gemini API
- **Authentication**: JWT with Passport.js
- **API Documentation**: Built-in NestJS Swagger

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Redis server
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/next-quiz.git
cd next-quiz
```

2. **Install dependencies**
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Environment Setup**

**Client (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**Server (.env)**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/quiz_db
REDIS_URL=redis://localhost:6379

# AI Service
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
```

4. **Database Setup**
```bash
cd server
npm run db:generate
npm run db:migrate
```

5. **Run the application**

**Start the server** (Terminal 1)
```bash
cd server
npm run dev
```

**Start the client** (Terminal 2)  
```bash
cd client
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1

## 🎯 How to Play

### 1. **Login/Register**
- Create an account or login with existing credentials
- Your username will be displayed to other players

### 2. **Choose Match Type**
- **Quick Match**: Instantly join a random battle (2-4 players)
- **Custom Match**: Create a personalized quiz with custom topics

### 3. **Matchmaking**
- Wait for other players to join your battle
- See real-time updates as players connect
- Match starts automatically when room is full

### 4. **Battle Arena**
- Answer AI-generated multiple-choice questions
- Score points for correct answers
- Compete against time and other players
- Watch live ranking updates

### 5. **Results & Ranking**
- View detailed match results
- See final rankings based on score and time
- Review correct answers for each question
- Compare performance with other players

## 🏗️ Project Structure

```
next-quiz/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   │   ├── (index)/       # Home page
│   │   ├── quiz/          # Quiz battle pages
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   │   ├── quiz/          # Quiz-specific components
│   │   ├── room/          # Room management
│   │   └── ui/            # Reusable UI components
│   ├── lib/              # Utilities and configs
│   ├── store/            # Redux store
│   └── types/            # TypeScript definitions
│
├── server/               # NestJS backend
│   ├── src/
│   │   ├── ai/           # AI service (Gemini integration)
│   │   ├── auth/         # Authentication module
│   │   ├── event/        # WebSocket events
│   │   ├── room/         # Room management
│   │   ├── user/         # User management
│   │   └── lib/          # Shared utilities
│   ├── drizzle/          # Database schema & migrations
│   └── test/             # Test files
│
└── docs/                 # Documentation
```

## 🔧 Key Features Breakdown

### Real-time Matchmaking System
- **Queue Management**: Players are placed in matchmaking queues based on room size preferences
- **Smart Matching**: Automatic room creation when enough players are found
- **Queue Persistence**: Redis-backed queue system for reliability
- **Cancel Support**: Players can cancel matchmaking at any time

### AI-Powered Quiz Generation
- **Dynamic Content**: Questions generated based on user-specified topics
- **Difficulty Scaling**: Easy, medium, and hard difficulty levels
- **Quality Validation**: AI responses are validated and sanitized
- **Caching**: Generated quizzes are cached for performance

### Real-time Battle System
- **Live Updates**: Player answers and scores update in real-time
- **Activity Tracking**: Monitor player engagement during matches
- **Countdown Timers**: Automatic match progression and time limits
- **Score Calculation**: Points awarded for accuracy and speed

### Comprehensive Results System
- **Detailed Analytics**: Question-by-question performance breakdown
- **Ranking Algorithm**: Scoring based on correctness and completion time
- **Match History**: Persistent storage of game results
- **Performance Insights**: Individual and comparative statistics

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark mode design with gradients
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Real-time Feedback**: Instant visual feedback for user actions
- **Loading States**: Engaging loading screens and skeleton UI
- **Accessibility**: WCAG compliant with keyboard navigation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schemas for type-safe data validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Sensitive data stored securely

## 📈 Performance Optimizations

- **Redis Caching**: Fast data retrieval and session management
- **Connection Pooling**: Efficient database connection handling
- **Code Splitting**: Dynamic imports for reduced bundle size
- **Image Optimization**: Next.js built-in image optimization
- **Debounced Requests**: Reduced API calls with debouncing

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test

# Run e2e tests
npm run test:e2e
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment

**Client (Vercel/Netlify)**
```bash
cd client
npm run build
npm start
```

**Server (Railway/Heroku/DigitalOcean)**
```bash
cd server
npm run build
npm run start:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

Once the server is running, access the interactive API documentation:
- Swagger UI: http://localhost:5000/api/docs

### Key Endpoints

```
POST /auth/login                 # User authentication
POST /room/matchmaking           # Start matchmaking
GET  /room/:id                   # Get room details
POST /room/cancel-matchmaking    # Cancel matchmaking
GET  /user/profile               # Get user profile
```

### WebSocket Events

```
roomCreated        # New room created
roomActivity       # Player activity updates
roomEnded          # Match completion
matchmaking        # Matchmaking updates
```

## 🐛 Troubleshooting

### Common Issues

**Connection Issues**
- Ensure Redis server is running
- Check database connection string
- Verify API URL in client environment

**Matchmaking Problems** 
- Clear Redis cache: `redis-cli FLUSHDB`
- Restart both client and server
- Check WebSocket connection in browser dev tools

**AI Generation Failures**
- Verify Gemini API key is valid
- Check API quotas and limits
- Review server logs for detailed errors

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**AkashMondal0**
- GitHub: [@AkashMondal0](https://github.com/AkashMondal0)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [NestJS](https://nestjs.com/) for the powerful Node.js framework  
- [Socket.IO](https://socket.io/) for real-time communication
- [Google Gemini](https://ai.google.dev/) for AI-powered quiz generation
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **Components**: 25+ React components
- **API Endpoints**: 15+ REST endpoints
- **WebSocket Events**: 8+ real-time events
- **Database Tables**: 5+ entities

---

⭐ **Star this repository if you find it helpful!**

🚀 **Ready to battle? Let the quiz wars begin!** 🧠⚔️

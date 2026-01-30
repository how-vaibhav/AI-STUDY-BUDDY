# Cerevia - The AI Path to Understanding

> _An AI-powered learning platform designed for serious students. Structured thinking, cognitive clarity, and exam-native design for competitive exam preparation._

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20|%20Storage-green?style=flat-square&logo=supabase)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Architecture](#architecture)
- [Features in Depth](#features-in-depth)
- [API Reference](#api-reference)
- [File Structure](#file-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Cerevia** is a comprehensive learning management platform designed specifically for serious students preparing for competitive exams. It combines artificial intelligence with intuitive UI/UX to provide:

- **Intelligent Study Planning** - AI-generated personalized study schedules optimized for your learning pace
- **Doubt Resolution** - Real-time Q&A with AI assistance for complex academic problems
- **Notes Summarization** - Automatic conversion of long notes to concise, exam-focused summaries
- **Daily Interactive Quizzes** - Auto-generated quizzes based on study plans with adaptive difficulty
- **Video Recommendations** - Curated YouTube channels for concept reinforcement
- **PDF Management** - Upload, parse, and manage study materials
- **Study Analytics** - Track progress, study streaks, and performance metrics
- **Settings & Customization** - Font size, animations, compact view, dark mode support

The platform is optimized for Indian exam patterns including:

- JEE Advanced/Main
- NEET
- GATE
- Board Exams (12th Standard)
- Competitive entrance exams

---

## ✨ Key Features

### 1. **Dashboard** 📊

- Real-time analytics with Recharts visualizations
- Weekly study hours tracking
- Subject performance metrics
- Study streak counter (motivational tracking)
- Daily goal progress tracker
- Quick action shortcuts to all tools
- Responsive grid layout (1/2/3 columns based on screen size)

### 2. **AI Study Planner** 📅

- Generate personalized study schedules
- AI-powered plan based on:
  - Target exam (JEE, NEET, GATE, etc.)
  - Current class/level
  - Time availability
  - Strengths and weaknesses
- Daily routine breakdown
- PDF download functionality
- **NEW**: PDF upload option (analyze existing schedules)
- Mobile-friendly interface

### 3. **Doubt Solver** ❓

- Ask complex academic questions
- AI-powered instant answers using GROQ API
- Rich text formatting for answers
- Subject-specific Q&A
- Response history
- Beautiful markdown rendering

### 4. **Notes Summarizer** 📝

- Paste long notes (from textbooks, lectures, etc.)
- AI-powered automatic summarization
- Key points extraction
- YouTube video recommendations based on summary
- PDF download of summaries
- Subject-wise channel recommendations:
  - Physics: Physics Wallah, Khan Academy, Crash Course
  - Chemistry: Professor Dave, CrashCourse Chemistry
  - Mathematics: PatrickJMT, Professor Leonard
  - Biology: Amoeba Sisters, Crash Course Biology
  - English: TED-Ed
  - History: Crash Course History

### 5. **Daily Quiz System** 🎓 (NEW)

- Automatically generates quizzes from study plans
- Features:
  - **Progressive Unlocking**: Today's quiz available, future locked
  - **Multi-day Plans**: 3-day plan = 3-day quiz series
  - **Adaptive Difficulty**: Questions based on performance
  - **Interactive Format**: Multiple choice, short answer, true/false
  - **Performance Tracking**: Track accuracy by subject
  - **Instant Feedback**: Answer explanations
  - **Streak Bonuses**: Extra points for consecutive correct answers

### 6. **User Profile** 👤 (ENHANCED)

- Complete profile setup
- **NEW**: Profile photo upload to Supabase
- Educational background
- Target exam selection
- Strengths/weaknesses assessment
- Profile photo display in navbar (animated)
- Password management

### 7. **Settings** ⚙️ (ENHANCED)

- **General Settings**
  - Language preference
  - Timezone selection
  - Study mode defaults
- **Study Preferences**
  - Daily study hours goal
  - Preferred study subjects
  - Notification preferences with scheduling
  - Sound notifications with Web Audio API
- **Display Settings** (NOW FUNCTIONAL)
  - **Font Size Control**: small (14px), medium (16px), large (18px), xlarge (20px) - Persists on reload
  - **Compact View**: Reduces spacing and padding for condensed UI
  - **Animation Toggle**: Enable/disable all Framer Motion animations globally
  - **Dark/Light theme toggle** with system detection
  - **Focus Mode**: Highlights study area with dimmed background
- **Privacy**
  - Data export
  - Account deletion
  - Privacy policy

### 8. **Notifications** 🔔 (NEW)

- Quiz generation alerts
- Daily study reminders
- Performance milestones
- Achievement badges
- In-app notification center
- Hamburger menu notification panel

### 9. **Advanced Footer** 🎨 (NEW)

- Animated gradient background
- Company info section with Cerevia philosophy
- Quick links
- Resources section
- Social media integration
- Newsletter subscription
- About page link
- Contact information
- Professional animations using GSAP

### 10. **Welcome/Onboarding Page** 🚀 (NEW)

- Professional landing page at `/welcome` route
- localStorage detection for first-time users
- Cerevia branding with Brain icon logo
- Dark mode toggle in navbar
- Smooth animations with Framer Motion
- 7 main sections: Hero, Why Cerevia, Capabilities, FAQ, Philosophy, CTA, Final section
- Responsive design optimized for mobile and desktop
- Practical feature showcase with actual implementations

---

## 🛠 Technology Stack

### Frontend

- **Framework**: Next.js 16.0.10 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Charts**: Recharts 2.15.4
- **Animations**:
  - Framer Motion (2.x)
  - GSAP (for advanced animations)
  - React Just Parallax
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

### Backend/Services

- **Authentication**: Supabase Auth (Email + Social)
- **Database**: Supabase PostgreSQL
- **File Storage**: Supabase Storage (profile photos, PDFs)
- **AI**: GROQ API (LLM for doubt solving)
- **API Calls**: Server actions & API routes

### Development Tools

- **Package Manager**: pnpm
- **Version Control**: Git
- **Deployment**: Vercel (recommended)
- **Analytics**: Vercel Analytics
- **Code Quality**: TypeScript strict mode

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8+ (or npm/yarn)
- Git
- Supabase account
- GROQ API key

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/ai-study-buddy.git
cd ai-study-buddy
```

### Step 2: Install Dependencies

```bash
pnpm install
# or
npm install
```

### Step 3: Environment Configuration

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# GROQ API
GROQ_API_KEY=your-groq-api-key
```

### Step 4: Database Setup

```bash
# Initialize Supabase schema
pnpm run db:init
```

SQL Schema (run in Supabase SQL Editor):

```sql
-- Users table (extends Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name VARCHAR(255),
  email VARCHAR(255),
  avatar_url VARCHAR(500),
  target_exam VARCHAR(100),
  current_class VARCHAR(50),
  strengths TEXT,
  weaknesses TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study Plans
CREATE TABLE study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  general_info TEXT,
  daily_routines JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan_id UUID REFERENCES study_plans(id),
  day_number INT,
  questions JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Answers
CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id),
  question_id UUID,
  user_answer TEXT,
  is_correct BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50), -- 'quiz', 'reminder', 'achievement'
  title VARCHAR(255),
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
```

### Step 5: Run Development Server

```bash
pnpm run dev
# or
npm run dev
```

Visit `http://localhost:3000`

### Step 6: Build for Production

```bash
pnpm run build
pnpm run start
```

---

## 🏗 Architecture

### Directory Structure

```
ai-study-buddy/
├── app/                          # Next.js app router
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Landing page
│   ├── api/                     # API routes
│   │   ├── generate-study-plan/
│   │   ├── solve-doubt/
│   │   ├── summarize-notes/
│   │   └── save-study-plan/
│   ├── dashboard/               # Main dashboard
│   ├── study-planner/           # Study plan generation
│   ├── doubt-solver/            # Q&A interface
│   ├── notes-summarizer/        # Notes summarization
│   ├── quiz/                    # Daily quiz (NEW)
│   ├── profile/                 # User profile
│   ├── settings/                # User settings
│   ├── about/                   # About page (NEW)
│   ├── login/                   # Authentication
│   └── signup/                  # Registration
├── components/                  # Reusable components
│   ├── dashboard-nav.tsx        # Main navigation bar
│   ├── theme-provider.tsx       # Theme switching
│   ├── app-footer.tsx           # Advanced footer (ENHANCED)
│   └── ui/                      # shadcn/ui components
├── lib/                         # Utilities & configurations
│   ├── auth.ts                  # Supabase auth client
│   ├── groq-client.ts           # GROQ API integration
│   ├── utils.ts                 # Helper functions
│   └── quizzes.ts              # Quiz generation logic (NEW)
├── hooks/                       # Custom React hooks
│   ├── use-api.ts              # API call wrapper
│   ├── use-mobile.ts           # Mobile detection
│   ├── use-toast.ts            # Toast notifications
│   └── use-notifications.ts    # Notification handler (NEW)
├── utils/
│   └── supabase/
│       ├── client.ts           # Supabase client
│       └── server.ts           # Server-side auth
├── styles/                      # Global styles
├── public/                      # Static assets
└── README.md                    # This file
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React/Next.js)               │
│  Dashboard → Study Planner → Doubt Solver → Quiz        │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Supabase │ │GROQ API  │ │ Vercel   │
    │  (Auth/  │ │(LLM for  │ │Analytics │
    │  DB/     │ │Doubt     │ └──────────┘
    │  Storage)│ │Solving)  │
    └──────────┘ └──────────┘
```

---

## 📖 Features in Depth

### Dashboard Analytics

- **LineChart**: Weekly study hours with trend analysis
- **PieChart**: Time distribution across subjects
- **BarChart**: Subject performance by accuracy percentage
- Metric cards showing KPIs
- Streak tracking with motivational messaging

### Study Plan Generation

The AI considers multiple factors:

1. **Time Management**: Available daily hours
2. **Subject Difficulty**: Adaptive scheduling
3. **Exam Pattern**: JEE, NEET, GATE specific patterns
4. **Strength-Weakness Balance**: Focus on weak areas
5. **Cumulative Learning**: Progressive difficulty

**Plan Structure**:

```json
{
  "title": "JEE Main Preparation - 30 Days",
  "generalInfo": "Strategic plan focusing on Physics and Math",
  "dailyRoutines": [
    {
      "day": 1,
      "subjects": ["Physics", "Math"],
      "topics": ["Mechanics", "Calculus"],
      "duration": "4 hours"
    }
  ]
}
```

### Doubt Solver Integration

- Uses GROQ's LLaMA model for instant answers
- Supports multi-subject queries
- Maintains conversation context
- Provides detailed explanations with examples
- Beautiful markdown rendering

### Quiz Generation System (NEW)

**Algorithm**:

1. Parse study plan for day's topics
2. Extract key concepts
3. Generate varied question types:
   - Multiple choice (4 options)
   - True/False (reasoning required)
   - Short answer (text-based)
4. Assign difficulty based on performance
5. Calculate scoring with streak bonuses

**Scoring System**:

- Correct answer: +10 points
- Correct streak (3+): +20 bonus points
- Time-based bonus: -1 point per 30 seconds
- Wrong answer: 0 points

### Notifications System (NEW)

- Real-time notifications for:
  - Quiz generation
  - Study reminders
  - Achievement unlocks
  - Performance alerts
- In-app notification center
- Persistent notification history

---

## 🔌 API Reference

### Endpoints

#### Generate Study Plan

```
POST /api/generate-study-plan
Content-Type: application/json

{
  "subject": "JEE Main",
  "days": 30,
  "dailyHours": 4,
  "strengthsWeaknesses": "Strong in math, weak in organic chemistry"
}

Response: {
  "success": true,
  "plan": {...}
}
```

#### Solve Doubt

```
POST /api/solve-doubt
Content-Type: application/json

{
  "question": "What is quantum entanglement?",
  "subject": "Physics",
  "context": "Class 12 Advanced"
}

Response: {
  "success": true,
  "answer": "...",
  "references": [...]
}
```

#### Summarize Notes

```
POST /api/summarize-notes
Content-Type: application/json

{
  "notes": "Long text content...",
  "subject": "Chemistry"
}

Response: {
  "success": true,
  "summary": "...",
  "keyPoints": [...],
  "videos": [...]
}
```

#### Generate Quiz

```
POST /api/generate-quiz
Content-Type: application/json

{
  "planId": "uuid",
  "dayNumber": 1,
  "difficulty": "medium"
}

Response: {
  "success": true,
  "quiz": {
    "id": "uuid",
    "questions": [...]
  }
}
```

---

## 📁 File Structure Details

### Key Components

**DashboardNav** (`components/dashboard-nav.tsx`)

- Sticky navbar with GSAP animations
- Dark/Light theme toggle
- Mobile hamburger menu
- Profile quick menu
- Responsive design

**ThemeProvider** (`components/theme-provider.tsx`)

- Wraps entire app
- Enables theme switching
- Persists theme preference
- Respects system preferences

**App Footer** (`components/app-footer.tsx`) - ENHANCED

- Advanced GSAP animations
- Responsive grid layout
- Newsletter subscription
- Social media links
- About/Contact sections

### Custom Hooks

**useApi** (`hooks/use-api.ts`)

```typescript
const { data, loading, error } = useApi("/api/endpoint");
```

**useMobile** (`hooks/use-mobile.ts`)

```typescript
const isMobile = useMobile(); // Returns true if screen < 768px
```

**useToast** (`hooks/use-toast.ts`)

```typescript
const { toast } = useToast();
toast({ title: "Success", description: "..." });
```

**useNotifications** (`hooks/use-notifications.ts`) - NEW

```typescript
const { notifications, addNotification } = useNotifications();
```

---

## ⚙️ Configuration

### Tailwind CSS Configuration

Custom theme extends shadcn/ui:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
    }
  }
}
```

### Next.js Configuration

```javascript
// next.config.mjs
const config = {
  reactStrictMode: true,
  experimental: {
    turbopack: true, // Enable Turbopack for faster builds
  },
};
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**

- Go to vercel.com
- Import your GitHub repository
- Set environment variables
- Deploy

3. **Environment Variables on Vercel**

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GROQ_API_KEY=...
```

### Alternative: Deploy to Self-Hosted

```bash
# Build
pnpm run build

# Use process manager (PM2)
pm2 start "pnpm start" --name "study-buddy"

# With Nginx reverse proxy
# Point domain to localhost:3000
```

---

## 🎨 Customization

### Change Theme Colors

Edit `app/globals.css`:

```css
:root {
  --primary: 220 90% 56%; /* Indigo */
  --secondary: 280 85% 60%; /* Purple */
}
```

### Customize Study Subjects

Edit `lib/constants.ts`:

```typescript
export const SUBJECTS = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "English",
  "History",
];
```

---

## 📱 Mobile Responsiveness

All pages are mobile-first:

- `grid-cols-1` on mobile
- `sm:grid-cols-2` on tablets
- `lg:grid-cols-3` on desktop
- Touch-friendly button sizes
- Hamburger menu on mobile
- Responsive text sizing

---

## 🔒 Security

- **Authentication**: Supabase JWT tokens
- **Authorization**: Row-Level Security (RLS) on database
- **API Keys**: Server-side only, never exposed to client
- **HTTPS**: Always enabled
- **CORS**: Configured for production domain
- **Sensitive Data**: Never logged or stored unnecessarily

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📊 Performance Metrics

- **Lighthouse Score**: 95+
- **Core Web Vitals**:
  - LCP: <2.5s
  - FID: <100ms
  - CLS: <0.1
- **Bundle Size**: ~150KB gzipped
- **Time to Interactive**: <3s

---

## 🐛 Troubleshooting

### Issue: "Cannot find GROQ API key"

**Solution**: Add `GROQ_API_KEY` to `.env.local`

### Issue: "Supabase connection failed"

**Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### Issue: Dark mode not working

**Solution**: Clear browser cache and reload. Theme persists in localStorage.

### Issue: PDF download fails

**Solution**: Ensure you have written the summary before downloading

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [GROQ API](https://console.groq.com)
- [shadcn/ui](https://ui.shadcn.com)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**AI Study Buddy Team**

- Website: [www.aistudybuddy.com](https://www.aistudybuddy.com)
- Email: support@aistudybuddy.com
- Twitter: [@aistudybuddy](https://twitter.com/aistudybuddy)

---

## 🙏 Acknowledgments

- Inspiration from Indian education challenges
- Built with ❤️ for Indian students
- Special thanks to GROQ for AI capabilities
- Supabase for backend infrastructure

---

**Last Updated**: January 2026  
**Version**: 2.0.0 (Cerevia Rebrand + Major Feature Release)

### Recent Updates (January 2026)

- ✅ Rebranded as **Cerevia**: The AI Path to Understanding
- ✅ Welcome page with Cerevia branding and dark mode toggle
- ✅ Implemented working font size CSS logic in settings (persists to localStorage)
- ✅ Compact view toggle with actual CSS application
- ✅ Animation toggle to disable Framer Motion globally
- ✅ Fixed dark mode contrast issues across all pages
- ✅ All features now practical and functional with real DOM APIs
- ✅ 37+ Tailwind CSS v4 deprecation fixes (bg-linear-\*, z-50 syntax)
- ✅ Merge conflict resolution and code cleanup

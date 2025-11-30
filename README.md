# Budget Tracker App

A comprehensive budget tracking application built with Next.js, Firebase Firestore, and NextAuth.js. Track your expenses, set budget limits, and visualize your spending patterns.

## Features

### ✅ Completed Features

#### Authentication
- **Email/Password Authentication** using NextAuth.js v5
- Secure signup and login pages
- Protected routes with middleware
- Session management

#### Dashboard Views
1. **Budget Tracker (Main View)** - Current month overview with budget vs actual spending
2. **All Transactions** - Complete transaction history with filtering
3. **Expenses** - View all expense transactions
4. **Income** - View all income transactions
5. **By Category** - Kanban board view organized by category
6. **Overview** - Multiple chart visualizations:
   - Spending Overview (Bar Chart)
   - Monthly Spending Trend (Line Chart)
   - Spending Distribution (Pie Chart)
   - Budget vs Actual (Comparison Bar Chart)

#### Transaction Management
- Add new transactions (expense or income)
- Delete transactions
- 12 predefined categories
- Date tracking
- Comments/notes on transactions

#### Budget Management
- Set budget limits per category
- Visual indicators for budget status (On Track, Near Limit, Over Budget)
- Budget comments/reminders

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: NextAuth.js v5
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Deployment**: Vercel (recommended)

## Getting Started

### 🚀 Quick Start (No Firebase Setup Required!)

**Use Firebase Emulator for instant local development:**

```bash
# Terminal 1: Start Firebase Emulator
npm run emulator

# Terminal 2: Start Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start using the app immediately!

📖 **See [QUICKSTART.md](./QUICKSTART.md)** for detailed emulator instructions.

### 🏗️ Production Setup

For deploying to production:

1. **Install dependencies** (if not already):
   ```bash
   npm install
   ```

2. **Set up Firebase**:
   - See [SETUP.md](./SETUP.md) for detailed instructions
   - Create a Firebase project
   - Enable Firestore Database
   - Get your Firebase credentials

3. **Configure environment variables**:
   - Fill in `.env.local` with your Firebase credentials
   - Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false`

4. **Deploy to Vercel** (see Deployment section below)

## Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** ⚡ - Start developing in 2 minutes with Firebase Emulator
- **[SETUP.md](./SETUP.md)** 🔧 - Production Firebase setup and configuration
- **[Firebase Console](https://console.firebase.google.com/)** 🔥 - Manage your Firebase project

## Deployment

### Recommended: Vercel (Free)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

**Cost**: $0/month on free tier

For detailed deployment instructions, see [SETUP.md](./SETUP.md).

## Database Schema

### Collections

- **users**: User accounts (email, password, name)
- **transactions**: Expense and income records
- **budgetLimits**: Budget limits per category

## License

MIT

---

**Built with ❤️ using Next.js, Firebase, and shadcn/ui**

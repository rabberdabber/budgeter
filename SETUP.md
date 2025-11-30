# Budget Tracker Setup Guide

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "budget-tracker")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database

1. In the Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location closest to you
5. Click "Enable"

### 3. Get Firebase Web App Credentials

1. In Firebase Console, click the gear icon > "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register app with a nickname (e.g., "Budget Tracker Web")
5. Copy the configuration values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### 4. Get Firebase Admin SDK Credentials

1. In Firebase Console > Project settings > "Service accounts" tab
2. Click "Generate new private key"
3. Save the JSON file securely
4. Open the JSON file and copy these values:
   - `project_id`
   - `client_email`
   - `private_key` (including the `\n` newlines)

### 5. Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Fill in the values from steps 3 and 4:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Firebase Configuration (from step 3)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin (from step 4)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-client-email
FIREBASE_ADMIN_PRIVATE_KEY="your-private-key-with-newlines"
```

### 6. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as the value for `NEXTAUTH_SECRET` in `.env.local`.

## Running the App

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Time Setup

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. You'll be redirected to the signup page
3. Create an account with your email and password
4. You'll be automatically logged in and redirected to the dashboard

## Features

### Main Dashboard (Budget Tracker)
- View current month's expenses grouped by category
- See budget limits vs actual spending
- Visual indicators for over-budget categories
- Add transactions and set budget limits

### Navigation
- **Budget Tracker**: Main view showing current month budget overview
- **All Transactions**: Complete transaction history
- **Expenses**: View all expenses
- **Income**: View all income
- **By Category**: Kanban board view (coming soon)
- **Overview**: Charts and visualizations (coming soon)

### Categories
The app includes 12 predefined categories:
- Rent
- Food & Dining
- Shopping
- Transportation
- Utilities
- Gym/Healthcare
- Entertainment
- Subscriptions
- Laundry/Other
- Miscellaneous
- Income
- Savings

## Deployment

### Firebase Hosting (Recommended)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init hosting
```

4. Build your Next.js app:
```bash
npm run build
```

5. Deploy:
```bash
firebase deploy
```

### Vercel (Alternative)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy

**Note**: When deploying to Vercel, you still use Firebase Firestore as your database.

## Troubleshooting

### "Unauthorized" errors
- Make sure your `.env.local` file is properly configured
- Restart the development server after changing environment variables

### Firestore errors
- Check that Firestore is enabled in Firebase Console
- Verify your Firebase Admin credentials are correct
- Make sure the private key includes the newline characters (`\n`)

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder: `rm -rf .next` and rebuild

# Quick Start Guide - Firebase Emulator

Get started in **2 minutes** without any Firebase setup! 🚀

## Why Use Firebase Emulator?

✅ **No Firebase account needed** for local development
✅ **Instant setup** - no configuration required
✅ **Faster development** - no network latency
✅ **Free** - unlimited local testing
✅ **Data persistence** - your data saves between restarts
✅ **UI Dashboard** - visual interface to view data

## Installation (Already Done!)

Firebase Emulator Suite is already installed. Skip to Running!

## Running the App

### Step 1: Start Firebase Emulator (Terminal 1)

```bash
npm run emulator
```

This will start:
- 🔥 **Firestore Emulator** on `localhost:8081`
- 🔐 **Auth Emulator** on `localhost:9099`
- 📊 **Emulator UI** on `http://localhost:4000`

You'll see output like:
```
✔  All emulators ready! It is now safe to connect your app.
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators started, it is now safe to connect.        │
└─────────────────────────────────────────────────────────────┘

┌───────────┬────────────────┬─────────────────────────────────┐
│ Emulator  │ Host:Port      │ View in Emulator UI             │
├───────────┼────────────────┼─────────────────────────────────┤
│ Auth      │ localhost:9099 │ http://localhost:4000/auth      │
│ Firestore │ localhost:8081 │ http://localhost:4000/firestore │
└───────────┴────────────────┴─────────────────────────────────┘
```

### Step 2: Start Next.js Dev Server (Terminal 2)

Open a **new terminal** and run:

```bash
npm run dev
```

You'll see:
```
🔥 Connected to Firestore Emulator
🔥 Connected to Auth Emulator
```

### Step 3: Use the App

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Sign up" and create an account
3. Start adding transactions and budget limits!

### Step 4: View Your Data (Optional)

Open the Emulator UI: [http://localhost:4000](http://localhost:4000)

- View **Firestore data** in real-time
- See **authenticated users**
- Inspect collections and documents

## Features

### ✅ Data Persistence

Your emulator data is **automatically saved** when you stop the emulator (Ctrl+C):
- Users persist between restarts
- Transactions saved
- Budget limits saved

Location: `./emulator-data/`

### 🧹 Clear All Data

Want to start fresh?

```bash
npm run emulator:clear
```

This will delete all emulator data and start clean.

## Environment Variables

The `.env.local` file is already configured for emulator use:

```env
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXTAUTH_SECRET=your-dev-secret-min-32-chars-long
```

**No Firebase credentials needed!** The app uses demo values when emulator is enabled.

## Switching to Production Firebase

When ready to deploy:

1. **Set up real Firebase** (see [SETUP.md](./SETUP.md))
2. **Fill in Firebase credentials** in `.env.local`
3. **Disable emulator**:
   ```env
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
   ```
4. **Deploy to Vercel** with production credentials

## Common Commands

```bash
# Development with emulator
npm run emulator          # Start Firebase emulator
npm run dev              # Start Next.js (in another terminal)

# Clear emulator data
npm run emulator:clear   # Delete all data and restart

# Production build
npm run build           # Build for production
npm run start           # Run production build
```

## Troubleshooting

### Port Already in Use

If ports 8081, 9099, or 4000 are taken:

1. Stop the conflicting process
2. Or edit `firebase.json` to use different ports

### Emulator Not Connecting

1. Make sure `.env.local` has:
   ```env
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
   ```
2. Restart both terminals (emulator + dev server)
3. Check browser console for connection messages

### Data Not Saving

Data saves when you **stop the emulator** with Ctrl+C (not by closing terminal).

## What's Next?

You're all set! 🎉

- ✅ No Firebase setup needed
- ✅ Full local development environment
- ✅ Data persistence
- ✅ Visual dashboard

**When you're ready to deploy**, follow [SETUP.md](./SETUP.md) for production Firebase configuration.

---

**Happy coding! 🚀**

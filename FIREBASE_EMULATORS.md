# Firebase Emulators Setup Guide

This guide will help you set up and use Firebase emulators for local development of your career counselling platform.

## 🚀 Quick Start

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Start Emulators
```bash
# Start only emulators
npm run emulators:start

# Start emulators + Next.js dev server together
npm run dev:emulator
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run emulators:start` | Start Firebase emulators only |
| `npm run dev:emulator` | Start both emulators and Next.js dev server |
| `npm run emulators:export` | Export emulator data for persistence |
| `npm run emulators:import` | Start emulators with imported data |

## 🔧 Emulator Ports

| Service | Port | URL |
|---------|------|-----|
| **Auth** | 9099 | http://localhost:9099 |
| **Firestore** | 8080 | http://localhost:8080 |
| **Functions** | 5001 | http://localhost:5001 |
| **Hosting** | 5000 | http://localhost:5000 |
| **Storage** | 9199 | http://localhost:9199 |
| **Emulator UI** | 4000 | http://localhost:4000 |

## 🎯 What's Configured

### ✅ Authentication Emulator
- **Port**: 9099
- **Features**: User registration, login, logout
- **Data**: Stored locally, resets on restart

### ✅ Firestore Emulator
- **Port**: 8080
- **Collections**: 
  - `users` - User profiles
  - `english_assessments` - English level assessments
  - `career_surveys` - Career interest surveys
- **Security Rules**: Configured for user-based access

### ✅ Emulator UI
- **Port**: 4000
- **Features**: 
  - View all emulator data
  - Test security rules
  - Monitor real-time updates
  - Export/import data

## 🔐 Security Rules

The emulator uses the same security rules as production:

```javascript
// Users can only access their own data
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Users can only access their own assessments
match /english_assessments/{assessmentId} {
  allow read, write: if request.auth != null && 
    request.auth.uid == resource.data.user_id;
}
```

## 🧪 Testing Your App

### 1. Start the Development Environment
```bash
npm run dev:emulator
```

### 2. Open Your App
- **Next.js App**: http://localhost:3000
- **Emulator UI**: http://localhost:4000

### 3. Test Authentication
1. Go to http://localhost:3000
2. Click "Get Started" to create an account
3. Check the Auth emulator at http://localhost:4000/auth

### 4. Test English Assessment
1. Login to your account
2. Go to Module 1 (English Assessment)
3. Submit some text
4. Check Firestore emulator at http://localhost:4000/firestore

## 📊 Emulator UI Features

### Authentication Tab
- View all registered users
- See user details and tokens
- Test authentication flows

### Firestore Tab
- Browse all collections
- View document data
- Test queries
- Monitor real-time updates

### Functions Tab
- View function logs
- Test function triggers
- Monitor execution

## 💾 Data Persistence

### Export Data
```bash
npm run emulators:export
```
This saves emulator data to `./emulator-data/`

### Import Data
```bash
npm run emulators:import
```
This starts emulators with previously exported data

## 🔄 Development Workflow

### Daily Development
1. Start emulators: `npm run dev:emulator`
2. Develop your features
3. Test with emulator UI
4. Export data if needed: `npm run emulators:export`

### Testing Production-like Data
1. Import production data (if available)
2. Test with realistic data volumes
3. Verify security rules work correctly

## 🚨 Troubleshooting

### Emulator Won't Start
```bash
# Check if Firebase CLI is installed
firebase --version

# Login to Firebase
firebase login

# Clear emulator cache
firebase emulators:start --only auth,firestore
```

### Connection Issues
- Ensure ports 9099, 8080, 4000 are available
- Check firewall settings
- Restart emulators if needed

### Data Not Persisting
- Use `npm run emulators:export` before stopping
- Use `npm run emulators:import` when starting
- Check `./emulator-data/` directory exists

## 🎉 Benefits of Using Emulators

1. **Fast Development**: No network latency
2. **Cost-Free**: No Firebase usage charges
3. **Offline Development**: Work without internet
4. **Data Safety**: No risk of affecting production data
5. **Testing**: Easy to test edge cases and errors
6. **Security**: Test security rules locally

## 📝 Environment Variables

For emulator development, you can use these environment variables:

```env
# .env.local
NEXT_PUBLIC_USE_EMULATORS=true
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
```

## 🔗 Useful Links

- [Firebase Emulator Documentation](https://firebase.google.com/docs/emulator-suite)
- [Emulator UI Guide](https://firebase.google.com/docs/emulator-suite/install_and_configure#ui)
- [Security Rules Testing](https://firebase.google.com/docs/firestore/security/test-rules-emulator) 
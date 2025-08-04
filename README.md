# Vidvaan - Career Counselling Platform

A Next.js-based career counselling platform with Firebase authentication and PostgreSQL backend.

## Features

- 🔐 Secure Firebase Authentication
- 📝 English Level Assessment Module
- 🎯 Career Interest Survey
- 💳 Premium Module Support (Ready for Payment Integration)
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: PostgreSQL
- **Backend**: Next.js API Routes
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vidvaan-test2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=vidvaan-attempt-2
FIREBASE_CLIENT_EMAIL=your-service-account-email@vidvaan-attempt-2.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# PostgreSQL Database Configuration
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### Firebase Setup

1. Go to your Firebase Console
2. Navigate to Project Settings > Service Accounts
3. Generate a new private key
4. Download the JSON file and extract the values for your environment variables

### Database Setup

1. Create a PostgreSQL database
2. Run the following SQL to create the required table:

```sql
CREATE TABLE english_assessments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    submitted_text TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    sentence_count INTEGER NOT NULL,
    average_word_length DECIMAL(5,2) NOT NULL,
    assessed_level VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_user_id ON english_assessments(user_id);
CREATE INDEX idx_created_at ON english_assessments(created_at);
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── evaluate-english-levels/
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── module/           # Module pages
│   │   ├── 1/           # English Assessment
│   │   └── 2/           # Career Survey
│   ├── signup/          # Signup page
│   └── page.tsx         # Homepage
├── contexts/             # React contexts
│   └── AuthContext.tsx  # Authentication context
└── lib/                 # Utility libraries
    └── firebase.ts      # Firebase configuration
```

## User Journey

1. **Homepage**: Users land on a beautiful landing page with login/signup options
2. **Authentication**: New users create accounts, existing users log in
3. **Dashboard**: Authenticated users see 5 module tiles
4. **Free Modules**: Modules 1 & 2 are free and accessible
5. **Premium Modules**: Modules 3, 4, & 5 show payment required (ready for integration)
6. **Module 1**: English level assessment with text input and backend processing
7. **Module 2**: Career interest survey with multiple choice questions

## API Endpoints

### POST /api/evaluate-english-levels

Evaluates English proficiency and saves to PostgreSQL.

#### Request Processing Statuses

The API tracks request processing with the following statuses:

- **`yes`** - Request successfully processed and assessed
- **`no`** - Request received but not yet processed (default)
- **`quota_exceeded`** - Request rejected due to quota limits (handled by separate listener)
- **`failed`** - Request failed due to server error or processing issues

**Request Body:**
```json
{
  "text": "User submitted text",
  "userId": "firebase_user_id",
  "userEmail": "user@example.com",
  "requestId": "unique-request-id",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "assessmentId": 123,
  "requestId": "unique-request-id",
  "message": "Text submitted successfully. Processing will be done by background listener.",
  "timestamps": {
    "client": "2024-01-15T10:30:00.000Z",
    "server": "2024-01-15T10:30:05.000Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Missing required fields"
}
```

## Security Features

- Firebase Authentication with email/password
- JWT token verification on API routes
- Secure password handling
- Input validation and sanitization
- Protected routes with authentication checks

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your production environment:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `DB_USER`
- `DB_HOST`
- `DB_NAME`
- `DB_PASSWORD`
- `DB_PORT`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Future Enhancements

- [ ] Payment gateway integration for premium modules
- [ ] Advanced NLP for better English assessment
- [ ] User progress tracking
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Mobile app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

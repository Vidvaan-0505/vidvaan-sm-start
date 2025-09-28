# Vidvaan - English Assessment Platform

A Next.js-based English assessment platform with Firebase authentication and PostgreSQL backend.

## Features

- 🔐 Secure Firebase Authentication (Email/Password + Google Sign-in)
- 📝 English Level Assessment Module with Real-time Analysis
- 📊 Submission History with Analysis Results
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design
- 🔒 Secure API with JWT Token Verification

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Authentication**: Firebase Auth (Email/Password + Google)
- **Database**: PostgreSQL with connection pooling
- **Backend**: Next.js API Routes with TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API

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
PG_USER=your_db_user
PG_HOST=your_db_host
PG_DATABASE=your_db_name
PG_PASSWORD=your_db_password
PG_PORT=5432
PG_SSL=false

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
-- Create users table
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    account_status VARCHAR(20) DEFAULT 'active',
    quota_limit_english INTEGER DEFAULT 10,
    quota_used_english INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create requests table
CREATE TABLE requests (
    request_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    module_id VARCHAR(50) NOT NULL,
    input_data JSONB NOT NULL,
    result_table_ref VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create analysis results table
CREATE TABLE eng_write_para_results (
    request_id INTEGER PRIMARY KEY,
    word_count INTEGER NOT NULL,
    sentence_count INTEGER NOT NULL,
    average_word_length DECIMAL(5,2) NOT NULL,
    assessed_level VARCHAR(50) NOT NULL,
    grammar_score DECIMAL(3,1),
    analysis_pdf_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(request_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_created_at ON requests(created_at);
CREATE INDEX idx_eng_results_request_id ON eng_write_para_results(request_id);
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
│   │   ├── requests/      # Request management
│   │   │   ├── route.ts   # GET/POST requests
│   │   │   └── [requestId]/route.ts  # Individual request
│   │   ├── users/         # User management
│   │   └── download-pdf/  # PDF generation
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── module/           # Module pages
│   │   └── 1/           # English Assessment
│   ├── signup/          # Signup page
│   ├── layout.tsx       # Root layout
│   ├── globals.css      # Global styles
│   └── page.tsx         # Homepage
├── components/           # React components
│   └── FeaturesSection.tsx
├── contexts/             # React contexts
│   └── AuthContext.tsx  # Authentication context
├── hooks/               # Custom hooks
│   └── useIntersectionObserver.ts
├── lib/                 # Utility libraries
│   ├── firebase.ts      # Firebase configuration
│   ├── firebaseAdmin.ts # Firebase Admin SDK
│   └── db.ts           # Database connection
└── services/            # API service layer
    └── api.ts          # Centralized API calls
```

## User Journey

1. **Homepage**: Users land on a beautiful landing page with login/signup options
2. **Authentication**: New users create accounts, existing users log in (Email/Password or Google)
3. **Dashboard**: Authenticated users see the English Assessment module
4. **English Assessment**: Users submit text up to 500 words for evaluation
5. **Analysis History**: Users can view their previous submissions and analysis results
6. **Real-time Feedback**: Immediate submission confirmation and error handling

## API Endpoints

### POST /api/requests

Creates a new assessment request.

**Request Body:**
```json
{
  "module_id": "ENG_WRITE_PARA",
  "input_data": {
    "text": "User submitted text for analysis"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Request submitted successfully"
}
```

### GET /api/requests

Fetches the user's recent assessment requests.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "request_id": 123,
      "module_id": "ENG_WRITE_PARA",
      "input_data": {
        "text": "User submitted text..."
      },
      "status": "pending",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET /api/requests/[requestId]

Fetches a specific assessment request with analysis results.

**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": "123",
    "moduleId": "ENG_WRITE_PARA",
    "inputData": {
      "text": "User submitted text..."
    },
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "analysis": {
      "word_count": 45,
      "sentence_count": 3,
      "average_word_length": 4.2,
      "assessed_level": "Intermediate",
      "grammar_score": 7.5
    }
  }
}
```

### POST /api/users

Creates or updates user information.

**Response:**
```json
{
  "success": true,
  "user": {
    "user_id": "firebase_uid",
    "email": "user@example.com",
    "phone": "+1234567890",
    "account_status": "active",
    "quota_limit_english": 10,
    "quota_used_english": 0
  }
}
```

## Security Features

- Firebase Authentication with email/password and Google Sign-in
- JWT token verification on all API routes
- Secure password handling with Firebase Auth
- Input validation and sanitization
- Protected routes with authentication checks
- User ownership validation for data access
- SQL injection protection with parameterized queries

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
- `PG_USER`
- `PG_HOST`
- `PG_DATABASE`
- `PG_PASSWORD`
- `PG_PORT`
- `PG_SSL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Current Status

✅ **Production Ready** - The application is fully functional with:
- Real PostgreSQL database integration
- Complete authentication system
- Working English assessment module
- Analysis history and results viewing
- Secure API endpoints
- Responsive UI/UX

## Future Enhancements

- [ ] Advanced NLP for better English assessment analysis
- [ ] PDF report generation for analysis results
- [ ] Email notifications for completed assessments
- [ ] Admin dashboard for user management
- [ ] Rate limiting and quota management
- [ ] Mobile app development
- [ ] Additional assessment modules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

# Log-AI-Analyzer

An AI-powered log analyzer and bug tracker that sanitizes sensitive data and provides intelligent analysis using OpenAI's GPT-4.

## Features

- ✨ Upload log files (.log, .txt)
- 🔒 Automatic sanitization of sensitive data (emails, IPs, SSNs, etc.)
- 🤖 AI-powered analysis using GPT-4o-mini
- 📊 Interactive dashboard with charts and analytics
- 💾 SQLite3 database for storing analyses
- 🎨 Modern, responsive UI with React and Tailwind CSS
- 🚀 Local-first architecture - works entirely offline after setup

## Technology Stack

**Backend:**
- Node.js + Express
- SQLite3
- Multer (file uploads)
- Axios (HTTP client)
- OpenAI API

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Recharts (data visualization)
- Axios (API calls)

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file in the backend directory:
\`\`\`env
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
PORT=5000
NODE_ENV=development
\`\`\`

4. Start the backend server:
\`\`\`bash
npm start
\`\`\`

Or for development with auto-reload:
\`\`\`bash
npm run dev
\`\`\`

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The frontend will run on `http://localhost:3000` and automatically proxy API requests to the backend.

## Usage

1. Open http://localhost:3000 in your browser
2. Click on the upload area and select a `.log` or `.txt` file
3. Click "Analyze Log"
4. Wait for the AI analysis to complete (30-60 seconds)
5. View the results in the dashboard with charts and insights
6. Previous analyses are stored and accessible in the left sidebar

## Sanitization Rules

The following data is automatically redacted:

- Email addresses → `[EMAIL_REDACTED]`
- Phone numbers → `[PHONE_REDACTED]`
- IP addresses → `[IP_REDACTED]`
- UUIDs → `[UUID_REDACTED]`
- API keys → `[API_KEY_REDACTED]`
- Credit card numbers → `[CARD_REDACTED]`
- Social Security numbers → `[SSN_REDACTED]`

## AI Analysis Output

The AI returns structured JSON with:

\`\`\`json
{
  "summary": "Overview of logs",
  "root_cause": "Identified root cause",
  "error_types": ["array", "of", "error", "types"],
  "affected_modules": ["array", "of", "modules"],
  "severity": "Low | Medium | High | Critical",
  "recommendations": ["actionable", "recommendations"],
  "possible_duplicates": ["duplicate", "patterns"],
  "stack_trace": "Error stack trace"
}
\`\`\`

## Database Schema

The SQLite3 database contains a single `analyses` table:

\`\`\`sql
CREATE TABLE analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_file_name TEXT NOT NULL,
  sanitized_content TEXT NOT NULL,
  ai_analysis TEXT NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
\`\`\`

## Folder Structure

\`\`\`
log-ai-analyzer/
├── backend/
│   ├── package.json
│   ├── .env
│   ├── uploads/          (uploaded files)
│   ├── logs_analyzer.db  (SQLite database)
│   └── src/
│       ├── server.js
│       ├── routes/
│       │   └── upload.js
│       ├── utils/
│       │   └── sanitize.js
│       ├── services/
│       │   └── aiClient.js
│       └── models/
│           └── Analysis.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── components/
│       │   ├── UploadForm.jsx
│       │   └── Dashboard.jsx
│       └── styles/
│           └── index.css
└── README.md
\`\`\`

## Troubleshooting

### "OPENAI_API_KEY is not set"
- Make sure you have created a `.env` file in the backend directory
- Verify the API key is correct and has been pasted exactly as provided
- Restart the backend server after adding the .env file

### File upload fails
- Ensure the file has a `.log` or `.txt` extension
- Check that the `uploads/` folder exists in the backend directory
- Verify file size isn't too large (logs over 1MB may take longer)

### AI analysis is taking too long
- Large logs may take 30-60 seconds to analyze
- Check your internet connection and OpenAI API status
- Consider breaking large logs into smaller files

### Database errors
- The `logs_analyzer.db` file should be auto-created on first backend startup
- If errors persist, delete the database file and restart the backend
- Ensure the backend directory has write permissions

### Port already in use
- Backend default: Change PORT in `.env` to another port (e.g., 5001)
- Frontend default: Change port in `vite.config.js` to another port (e.g., 3001)

## API Endpoints

### POST /api/analyze
Upload and analyze a log file

**Request:**
- FormData with `file` field

**Response:**
\`\`\`json
{
  "success": true,
  "message": "File analyzed successfully",
  "analysisId": 1,
  "analysis": { /* AI analysis object */ }
}
\`\`\`

### GET /api/analyses
Get all analyses

**Response:**
\`\`\`json
[
  {
    "id": 1,
    "originalFileName": "app.log",
    "aiAnalysis": { /* AI analysis object */ },
    "uploadedAt": "2024-01-20T12:34:56.000Z"
  }
]
\`\`\`

### GET /api/analyses/:id
Get a specific analysis

**Response:**
\`\`\`json
{
  "id": 1,
  "originalFileName": "app.log",
  "sanitizedContent": "...",
  "aiAnalysis": { /* AI analysis object */ },
  "uploadedAt": "2024-01-20T12:34:56.000Z"
}
\`\`\`

## Example Log File

\`\`\`
[2024-01-20 10:15:23] ERROR: Database connection failed
Connection string: mongodb://user:pass@192.168.1.100:27017/mydb
Error: ECONNREFUSED
Stack trace:
  at /app/db/connection.js:42:15
  at processTicksAndRejections (internal/timers:handleRequest:3:28)
User: john.doe@example.com (ID: 550e8400-e29b-41d4-a716-446655440000)
Phone: +1-555-123-4567
Attempting retry...
\`\`\`

After sanitization and AI analysis, this would show redacted sensitive info and detailed recommendations for fixing the connection issue.

## Performance Notes

- First analysis may be slower due to OpenAI API initialization
- Logs up to 1MB analyze in ~30-60 seconds
- SQLite3 stores data locally, no network delays for retrieval
- Cached results load instantly

## Security

- All sensitive data is redacted before sending to OpenAI
- API keys stored only in local `.env` file
- No data sent to external servers except OpenAI API calls
- SQLite3 database file should not be committed to version control

## Future Enhancements

- Export analyses to PDF/CSV
- Batch file processing
- Custom sanitization rules
- Log pattern templates
- Real-time log streaming
- Database backup functionality
- Multi-file comparison

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

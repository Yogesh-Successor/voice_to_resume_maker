# Voice to ATS Resume Maker - Backend

Backend API for the Voice to ATS-optimized Resume Maker application.

## Features

- 🎤 Voice input processing with AI
- 🤖 AI integration (OpenAI GPT-4 or local Ollama)
- 📄 Resume CRUD operations
- 🎨 Multiple resume templates
- 📥 Export to PDF and Word formats
- 🗄️ MongoDB database integration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **AI**: OpenAI API or Ollama (local)
- **Export**: Puppeteer (PDF), docx (Word)

## Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key OR Ollama installed locally

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voice-resume-maker
AI_PROVIDER=ollama  # or 'openai'
OPENAI_API_KEY=your_key_here  # if using OpenAI
OLLAMA_API_URL=http://localhost:11434  # if using Ollama
```

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get resume by ID
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/transcriptions` - Add voice transcription

### AI Processing
- `POST /api/ai/process-voice` - Process voice input and extract resume data
- `POST /api/ai/enhance-resume` - Enhance existing resume with additional speech
- `GET /api/ai/test-connection` - Test AI provider connection

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates/initialize` - Create default templates

### Export
- `POST /api/export/pdf` - Export resume as PDF
- `POST /api/export/word` - Export resume as Word document

## AI Configuration

### Using Ollama (Local)

1. Install Ollama from https://ollama.ai
2. Pull the model:
```bash
ollama pull llama3.1
```
3. Set in `.env`:
```env
AI_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

### Using OpenAI

1. Get API key from https://platform.openai.com
2. Set in `.env`:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

## Project Structure

```
backend/
├── controllers/       # Request handlers
│   ├── aiController.js
│   ├── exportController.js
│   ├── resumeController.js
│   └── templateController.js
├── models/           # MongoDB schemas
│   ├── Resume.js
│   └── Template.js
├── routes/           # API routes
│   ├── aiRoutes.js
│   ├── exportRoutes.js
│   ├── resumeRoutes.js
│   └── templateRoutes.js
├── services/         # Business logic
│   ├── aiService.js
│   └── exportService.js
├── server.js         # Entry point
└── package.json
```

## Error Handling

All API responses follow this format:

Success:
```json
{
  "success": true,
  "data": {...}
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## License

MIT


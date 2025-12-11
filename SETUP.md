# Setup Guide - Voice to ATS Resume Maker

This guide will walk you through setting up the entire application from scratch.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- [ ] **MongoDB** - Choose one:
  - [ ] Local MongoDB - [Download](https://www.mongodb.com/try/download/community)
  - [ ] MongoDB Atlas (Cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
- [ ] **AI Provider** - Choose one:
  - [ ] OpenAI API Key - [Get key](https://platform.openai.com/)
  - [ ] Ollama (Local) - [Download](https://ollama.ai/)
- [ ] **Git** - [Download](https://git-scm.com/)

## Step-by-Step Installation

### 1. Clone or Download Project

```bash
# If using Git
git clone <repository-url>
cd voice-resume-maker

# Or download and extract the ZIP file
```

### 2. Install Dependencies

**Option A: Install All at Once**
```bash
npm run install-all
```

**Option B: Install Manually**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### 3. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB (varies by OS)
# Windows (if installed as service): It runs automatically
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Verify it's running
mongosh
# You should see MongoDB shell
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Whitelist your IP address in Atlas dashboard

### 4. Setup AI Provider

**Option A: OpenAI (Recommended for Best Results)**
```bash
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create new secret key
5. Copy the key (starts with 'sk-...')
```

**Option B: Ollama (Free, Runs Locally)**
```bash
# Install Ollama
# Visit https://ollama.ai/ and download for your OS

# After installation, pull the model
ollama pull llama3.1

# Start Ollama (usually starts automatically)
ollama serve

# Test it's working
ollama run llama3.1
# Type a message and you should get a response
```

### 5. Configure Backend

```bash
cd backend

# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
```

**Edit `backend/.env`:**

For **OpenAI**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/voice-resume-maker
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-key-here
CORS_ORIGIN=http://localhost:3000
```

For **Ollama**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/voice-resume-maker
AI_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
CORS_ORIGIN=http://localhost:3000
```

For **MongoDB Atlas**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voice-resume-maker?retryWrites=true&w=majority
```

### 6. Configure Frontend

```bash
cd frontend

# Copy example environment file
cp .env.example .env
```

**Edit `frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### 7. Initialize Database

```bash
# Make sure you're in the backend directory
cd backend

# Start the backend server
npm run dev
```

In a web browser, visit:
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Voice Resume Maker API is running",
  "timestamp": "..."
}
```

Initialize default templates:
```
http://localhost:5000/api/templates/initialize
```

You should see:
```json
{
  "success": true,
  "message": "Default templates created successfully",
  "count": 4
}
```

### 8. Start the Application

**Option A: Run Both Servers Together** (Recommended)
```bash
# From root directory
npm run dev
```

**Option B: Run Servers Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### 9. Verify Installation

1. **Backend Check**
   - Visit: http://localhost:5000/health
   - Should show: "OK" status

2. **Frontend Check**
   - Visit: http://localhost:3000
   - Should show: Home page with "Voice Resume Maker"

3. **AI Connection Check**
   - Visit: http://localhost:5000/api/ai/test-connection
   - Should show: Success message with AI provider info

4. **Templates Check**
   - Visit: http://localhost:5000/api/templates
   - Should show: List of 4 templates

## Testing the Application

### Test Voice Input

1. Open http://localhost:3000/voice-input
2. Click "Start Recording"
3. Speak: "My name is John Doe. I'm a software engineer with 3 years of experience at Tech Company. I know JavaScript, React, and Node.js."
4. Click "Stop Recording"
5. Click "Process with AI"
6. Wait for processing
7. You should be redirected to Resume Builder with populated data

### Test Template Selection

1. Open http://localhost:3000/templates
2. You should see 4 templates
3. Click "Use This Template" on any template
4. You should be redirected to Resume Builder

### Test Export

1. Create or open a resume
2. Click "Export" button
3. Try "Export as PDF"
4. Try "Export as Word"
5. Files should download automatically

## Troubleshooting

### MongoDB Connection Error

**Error**: "MongooseError: Connection failed"

**Solutions**:
1. Check if MongoDB is running:
   ```bash
   mongosh
   ```
2. Verify MONGODB_URI in backend/.env
3. For Atlas, check IP whitelist and credentials

### AI Service Error

**Error**: "AI processing failed"

**For OpenAI**:
1. Verify API key is correct
2. Check if you have credits in OpenAI account
3. Test with: `curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"`

**For Ollama**:
1. Check if Ollama is running:
   ```bash
   ollama list
   ```
2. Restart Ollama:
   ```bash
   ollama serve
   ```
3. Pull model again:
   ```bash
   ollama pull llama3.1
   ```

### Voice Recognition Not Working

1. Use Chrome, Edge, or Safari (Firefox not fully supported)
2. Check microphone permissions in browser
3. Try incognito/private window
4. Use text input fallback if needed

### Port Already in Use

**Error**: "Port 5000 is already in use"

**Solution**:
```bash
# Find and kill process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

### CORS Error

**Error**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**:
1. Check backend/.env has correct CORS_ORIGIN
2. Verify frontend is running on http://localhost:3000
3. Restart backend server after changing .env

### PDF Export Not Working

1. Check browser console for errors
2. Ensure resume has content
3. Try different browser
4. Check if puppeteer installed correctly:
   ```bash
   cd backend
   npm install puppeteer
   ```

## Production Deployment

### Backend Deployment (Example: Heroku)

```bash
cd backend

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set AI_PROVIDER="openai"
heroku config:set OPENAI_API_KEY="your-key"

# Deploy
git push heroku main
```

### Frontend Deployment (Example: Vercel)

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add REACT_APP_API_URL production
# Enter your backend URL: https://your-backend.herokuapp.com
```

## Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection | mongodb://localhost:27017/voice-resume-maker |
| AI_PROVIDER | AI service to use | openai or ollama |
| OPENAI_API_KEY | OpenAI API key | sk-... |
| OLLAMA_API_URL | Ollama server URL | http://localhost:11434 |
| OLLAMA_MODEL | Ollama model name | llama3.1 |
| CORS_ORIGIN | Frontend URL | http://localhost:3000 |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000 |
| REACT_APP_ENV | Environment | development |

## Next Steps

After successful setup:

1. ✅ Test all features
2. ✅ Create your first resume
3. ✅ Explore different templates
4. ✅ Try voice input with various information
5. ✅ Test PDF and Word export
6. 📖 Read the main README.md for detailed features
7. 🔧 Customize templates if needed
8. 🚀 Deploy to production

## Getting Help

If you encounter issues:

1. Check this SETUP.md guide
2. Review main README.md
3. Check backend/README.md and frontend/README.md
4. Look at browser console for frontend errors
5. Check terminal output for backend errors
6. Verify all prerequisites are installed correctly

## Success Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend app running on port 3000
- [ ] MongoDB connected successfully
- [ ] AI provider configured and working
- [ ] Templates initialized
- [ ] Voice input working (or fallback available)
- [ ] Can create and save resumes
- [ ] Can export as PDF
- [ ] Can export as Word

---

**Congratulations! 🎉 Your Voice Resume Maker is ready to use!**


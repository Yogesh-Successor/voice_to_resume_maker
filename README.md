# 🎤 Voice to ATS-Optimized Resume Maker

A full-stack application that transforms your speech into professional, ATS-optimized resumes using AI. Simply speak about your experience, and let AI create a perfect resume for you.

## 🌟 Key Features

### Core Functionality

1. **Voice Input** 📣
   - Browser-based speech recognition
   - Real-time transcription display
   - Support for multiple voice sessions
   - Fallback text input for unsupported browsers

2. **AI-Powered Resume Generation** 🤖
   - Integration with OpenAI GPT-4 or local Ollama
   - Automatic extraction of resume information
   - ATS optimization for better job application success
   - Intelligent formatting and keyword optimization

3. **Multiple Professional Templates** 🎨
   - Modern Professional
   - Classic Traditional
   - Creative Designer
   - Minimal Clean
   - Easy template switching

4. **Drag & Drop Editor** ✏️
   - Reorder resume sections
   - Edit content inline
   - Real-time preview
   - Responsive design

5. **Export Options** 📥
   - Export as PDF (high quality)
   - Export as Word document (.docx)
   - Print-optimized layout

6. **Resume Management** 💾
   - Save multiple resumes
   - View all your resumes
   - Edit anytime
   - Track creation and update history

7. **Additional Voice Input** 🔄
   - Add more information to existing resumes
   - AI merges new content intelligently
   - Maintains resume coherence

## 🏗️ Architecture

```
voice-resume-maker/
├── backend/               # Node.js + Express API
│   ├── controllers/      # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic (AI, Export)
│   └── server.js        # Entry point
├── frontend/             # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API integration
│   │   └── App.js       # Main app component
│   └── public/
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **AI Provider**: Choose one:
  - OpenAI API key, OR
  - Ollama installed locally

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd voice-resume-maker
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm start
```

4. **Initialize Database**
```bash
# Visit http://localhost:5000/health to verify backend
# Visit http://localhost:5000/api/templates/initialize to create default templates
```

### Environment Configuration

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voice-resume-maker
AI_PROVIDER=ollama  # or 'openai'
OPENAI_API_KEY=your_key_here  # if using OpenAI
OLLAMA_API_URL=http://localhost:11434  # if using Ollama
OLLAMA_MODEL=llama3.1
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## 🤖 AI Setup

### Option 1: OpenAI (Cloud)

1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Set in backend/.env:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

### Option 2: Ollama (Local)

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull the model:
```bash
ollama pull llama3.1
```
3. Set in backend/.env:
```env
AI_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

## 📖 Usage Guide

### Creating Your First Resume

1. **Start with Voice**
   - Navigate to "Voice Input"
   - Click "Start Recording"
   - Speak naturally about your experience
   - Example: "Hi, I'm John Doe, a Senior Software Engineer with 5 years of experience..."

2. **AI Processing**
   - Click "Process with AI"
   - Wait for AI to structure your information
   - Automatic redirect to Resume Builder

3. **Customize**
   - Switch between Preview and Edit modes
   - Drag sections to reorder
   - Edit any field directly
   - Change template if desired

4. **Export**
   - Click "Export" button
   - Choose PDF or Word format
   - Download your professional resume

### Adding More Information

1. Open an existing resume in Builder
2. Click "Add Voice" button
3. Speak additional information
4. AI intelligently merges new content

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **AI**: OpenAI API / Ollama
- **Export**: Puppeteer (PDF), docx (Word)
- **Security**: Helmet, CORS

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Drag & Drop**: react-dnd
- **Voice**: react-speech-recognition
- **PDF**: jsPDF + html2canvas
- **HTTP**: Axios
- **UI**: Custom components + CSS

## 📁 Project Structure

### Backend Components

```
backend/
├── controllers/
│   ├── aiController.js        # AI processing endpoints
│   ├── exportController.js    # PDF/Word export
│   ├── resumeController.js    # CRUD operations
│   └── templateController.js  # Template management
├── models/
│   ├── Resume.js             # Resume schema
│   └── Template.js           # Template schema
├── services/
│   ├── aiService.js          # AI integration logic
│   └── exportService.js      # Document generation
└── routes/                   # API route definitions
```

### Frontend Components

```
frontend/src/
├── components/
│   ├── common/               # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Header.js
│   │   ├── LoadingSpinner.js
│   │   └── Modal.js
│   ├── VoiceRecorder/        # Voice recording component
│   └── Resume/               # Resume-specific components
│       ├── DraggableSection.js
│       └── ResumePreview.js
├── pages/                    # Main application pages
│   ├── Home.js
│   ├── VoiceInput.js
│   ├── TemplateSelection.js
│   ├── ResumeBuilder.js
│   └── MyResumes.js
└── services/
    └── api.js               # API client
```

## 🧪 API Endpoints

### Resumes
- `POST /api/resumes` - Create resume
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get resume by ID
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### AI
- `POST /api/ai/process-voice` - Process voice input
- `POST /api/ai/enhance-resume` - Add information to resume
- `GET /api/ai/test-connection` - Test AI connection

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates/initialize` - Create default templates

### Export
- `POST /api/export/pdf` - Export as PDF
- `POST /api/export/word` - Export as Word

## 🎯 Design Principles

### Maintainability
- **Common Components**: Reusable UI elements
- **Service Layer**: Separated business logic
- **Clear Structure**: Organized file hierarchy
- **Consistent Naming**: Predictable conventions

### Scalability
- **Modular Architecture**: Easy to extend
- **API-First Design**: Backend-frontend separation
- **Database Schemas**: Flexible data models

### User Experience
- **Responsive Design**: Works on all devices
- **Real-time Feedback**: Loading states and notifications
- **Error Handling**: Clear error messages
- **Progressive Enhancement**: Fallbacks for features

## 🔒 Security Considerations

- Helmet.js for HTTP headers
- CORS configuration
- Input validation
- Environment variables for secrets
- No sensitive data in client

## 📱 Browser Support

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Core App | ✅ | ✅ | ✅ | ✅ |
| Voice Recognition | ✅ | ✅ | ✅ | ⚠️* |
| Drag & Drop | ✅ | ✅ | ✅ | ✅ |
| PDF Export | ✅ | ✅ | ✅ | ✅ |

*Firefox users can use text input as fallback

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```bash
# Check MongoDB is running
mongod --version
# Or use MongoDB Atlas for cloud database
```

**AI Service Error**
```bash
# For Ollama: Check if running
ollama list
ollama serve

# For OpenAI: Verify API key
curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"
```

### Frontend Issues

**Voice Recognition Not Working**
- Use Chrome, Edge, or Safari
- Check microphone permissions
- Try typing instead

**API Connection Failed**
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in .env
- Check browser console for CORS errors

## 🚧 Future Enhancements

- [ ] User authentication and accounts
- [ ] Resume versioning and history
- [ ] More template designs
- [ ] Multiple language support
- [ ] LinkedIn import
- [ ] ATS score analysis
- [ ] Collaborative editing
- [ ] Email delivery
- [ ] Resume analytics

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow existing code style
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👥 Support

For issues, questions, or suggestions:
- Check the documentation in `/backend/README.md` and `/frontend/README.md`
- Review the code comments
- Open an issue on GitHub

## 🙏 Acknowledgments

- OpenAI for GPT models
- Ollama for local AI inference
- React community for excellent libraries
- MongoDB for flexible data storage

---

**Built with ❤️ for job seekers everywhere**

Start creating your perfect resume today! 🚀


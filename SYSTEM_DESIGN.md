# System Design - Voice to ATS-Optimized Resume Maker

## Table of Contents
1. [High-Level Architecture](#high-level-architecture)
2. [System Components](#system-components)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Sequence Diagrams](#sequence-diagrams)
5. [Database Design](#database-design)
6. [API Architecture](#api-architecture)
7. [Technology Stack](#technology-stack)
8. [Scalability & Performance](#scalability--performance)

---

## 1. High-Level Architecture

### Overview
The system follows a **3-tier client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER (Frontend)                       │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   React UI   │  │ Speech API   │  │  Components  │              │
│  │   Pages &    │  │ (Browser)    │  │  (Reusable)  │              │
│  │   Routing    │  │              │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│         │                  │                  │                      │
│         └──────────────────┴──────────────────┘                      │
│                            │                                         │
│                     Axios HTTP Client                                │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                    REST API (JSON)
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                    APPLICATION TIER (Backend)                        │
│                            │                                         │
│  ┌─────────────────────────┴────────────────────────┐               │
│  │         Express.js API Server (Node.js)          │               │
│  └─────────────────────────┬────────────────────────┘               │
│                            │                                         │
│  ┌──────────────┬──────────┴──────────┬──────────────┐             │
│  │              │                      │              │             │
│  │ Controllers  │    Middleware        │   Routes     │             │
│  │ (Handlers)   │ (Auth, Validation)   │  (Routing)   │             │
│  └──────┬───────┘                      └──────────────┘             │
│         │                                                            │
│  ┌──────┴──────────────────────────────────────┐                    │
│  │           Business Logic Layer               │                    │
│  │                                              │                    │
│  │  ┌────────────┐  ┌────────────┐            │                    │
│  │  │ AI Service │  │   Export   │            │                    │
│  │  │  (OpenAI/  │  │  Service   │            │                    │
│  │  │  Ollama)   │  │ (PDF/Word) │            │                    │
│  │  └─────┬──────┘  └─────┬──────┘            │                    │
│  └────────┼───────────────┼───────────────────┘                    │
│           │               │                                         │
└───────────┼───────────────┼─────────────────────────────────────────┘
            │               │
            │               └─────► Puppeteer/docx Library
            │
    ┌───────┴────────┐
    │                │
┌───┴───┐      ┌─────┴──────┐
│OpenAI │      │  Ollama    │
│  API  │      │  (Local)   │
└───────┘      └────────────┘
            
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA TIER (Database)                          │
│                                                                       │
│                    ┌────────────────────┐                            │
│                    │   MongoDB Server   │                            │
│                    │                    │                            │
│                    │  ┌──────────────┐  │                            │
│                    │  │   Resumes    │  │                            │
│                    │  │  Collection  │  │                            │
│                    │  └──────────────┘  │                            │
│                    │                    │                            │
│                    │  ┌──────────────┐  │                            │
│                    │  │  Templates   │  │                            │
│                    │  │  Collection  │  │                            │
│                    │  └──────────────┘  │                            │
│                    └────────────────────┘                            │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Separation of Concerns**: Clear boundaries between presentation, business logic, and data layers
2. **Stateless API**: RESTful design with no server-side session management
3. **Modular Design**: Independent services (AI, Export) for easy maintenance
4. **Scalability**: Horizontal scaling possible at each tier
5. **Security**: CORS, Helmet, input validation at API layer

---

## 2. System Components

### 2.1 Frontend Components (React)

```
frontend/src/
│
├── pages/                          # Page-level components
│   ├── Home.js                     # Landing page with navigation
│   ├── VoiceInput.js              # Voice recording interface
│   ├── TemplateSelection.js       # Template gallery
│   ├── ResumeBuilder.js           # Main editor with preview
│   └── MyResumes.js               # Resume management dashboard
│
├── components/
│   ├── common/                    # Reusable UI components
│   │   ├── Button.js             # Styled button with variants
│   │   ├── Card.js               # Container component
│   │   ├── Header.js             # Navigation header
│   │   ├── Modal.js              # Popup dialog
│   │   └── LoadingSpinner.js     # Loading indicator
│   │
│   ├── VoiceRecorder/            # Voice input module
│   │   └── VoiceRecorder.js      # Speech recognition component
│   │
│   └── Resume/                   # Resume-specific components
│       ├── ResumePreview.js      # Template renderer
│       └── DraggableSection.js   # Drag-drop section
│
└── services/
    └── api.js                     # Axios API client wrapper
```

**Component Responsibilities:**

| Component | Responsibility | Key Features |
|-----------|---------------|--------------|
| **VoiceInput** | Capture user speech | Start/stop recording, transcription display |
| **ResumeBuilder** | Main editing interface | Preview/edit modes, drag-drop, template switching |
| **ResumePreview** | Render resume with template | Dynamic styling, responsive layout |
| **MyResumes** | Resume management | List, edit, delete operations |
| **API Service** | HTTP communication | Axios wrapper, error handling, base URL config |

### 2.2 Backend Components (Node.js/Express)

```
backend/
│
├── server.js                      # Application entry point
│
├── controllers/                   # Request handlers
│   ├── aiController.js           # AI processing endpoints
│   ├── resumeController.js       # Resume CRUD operations
│   ├── templateController.js     # Template management
│   └── exportController.js       # PDF/Word export
│
├── models/                       # Database schemas
│   ├── Resume.js                 # Resume data model
│   └── Template.js               # Template data model
│
├── routes/                       # API route definitions
│   ├── aiRoutes.js
│   ├── resumeRoutes.js
│   ├── templateRoutes.js
│   └── exportRoutes.js
│
└── services/                     # Business logic
    ├── aiService.js             # AI integration (OpenAI/Ollama)
    └── exportService.js         # Document generation
```

**Service Responsibilities:**

| Service | Responsibility | Technologies |
|---------|---------------|--------------|
| **AI Service** | Extract structured data from speech | OpenAI API, Ollama, Axios |
| **Export Service** | Generate PDF/Word documents | Puppeteer, docx library |
| **Resume Controller** | Handle resume CRUD | Mongoose ODM |
| **Template Controller** | Manage templates | Mongoose ODM |

---

## 3. Data Flow Diagrams

### 3.1 Voice to Resume Flow (Main Use Case)

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Speaks about experience
     ▼
┌─────────────────────┐
│  VoiceRecorder      │
│  Component          │
└─────────┬───────────┘
          │
          │ 2. Browser Speech API
          │    transcribes audio
          ▼
┌─────────────────────┐
│  Transcription      │
│  Display            │
└─────────┬───────────┘
          │
          │ 3. POST /api/ai/process-voice
          │    { speechText: "..." }
          ▼
┌─────────────────────────────────────────────┐
│         Backend API Server                  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  aiController.processVoice()         │  │
│  └──────────┬───────────────────────────┘  │
│             │                               │
│             │ 4. Call AI Service            │
│             ▼                               │
│  ┌──────────────────────────────────────┐  │
│  │  aiService.extractResumeInfo()       │  │
│  │                                      │  │
│  │  • Build structured prompt           │  │
│  │  • Choose provider (OpenAI/Ollama)   │  │
│  └──────────┬───────────────────────────┘  │
└─────────────┼───────────────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
    ▼                    ▼
┌──────────┐      ┌─────────────┐
│ OpenAI   │      │   Ollama    │
│ GPT-4    │      │  llama3.1   │
└────┬─────┘      └──────┬──────┘
     │                   │
     │ 5. Returns structured JSON
     ▼                   │
┌────────────────────────┴──────┐
│  {                            │
│    "personalInfo": {...},     │
│    "experience": [...],       │
│    "education": [...],        │
│    "skills": [...],           │
│    "projects": [...]          │
│  }                            │
└────────────┬──────────────────┘
             │
             │ 6. Send response to client
             ▼
┌─────────────────────────┐
│  ResumeBuilder Page     │
│  (Auto-populated)       │
└─────────────────────────┘
             │
             │ 7. User can edit/save
             ▼
┌─────────────────────────┐
│  POST /api/resumes      │
│  Save to MongoDB        │
└─────────────────────────┘
```

### 3.2 Resume Export Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ Click "Export as PDF" or "Export as Word"
     ▼
┌─────────────────────┐
│  ResumeBuilder      │
│  Component          │
└─────────┬───────────┘
          │
          │ POST /api/export/pdf or /api/export/word
          │ { resumeData: {...}, templateId: "modern" }
          ▼
┌───────────────────────────────────────────────┐
│         exportController                      │
│                                               │
│  1. Validate request data                     │
│  2. Call exportService                        │
└──────────────┬────────────────────────────────┘
               │
               ▼
┌───────────────────────────────────────────────┐
│         exportService                         │
│                                               │
│  ┌─────────────────┐    ┌─────────────────┐  │
│  │  generatePDF()  │    │  generateWord() │  │
│  │                 │    │                 │  │
│  │  • Create HTML  │    │  • Create docx  │  │
│  │  • Launch       │    │    document     │  │
│  │    Puppeteer    │    │  • Add sections │  │
│  │  • Render page  │    │  • Apply styles │  │
│  │  • Convert PDF  │    │  • Generate     │  │
│  └────────┬────────┘    └────────┬────────┘  │
└───────────┼──────────────────────┼────────────┘
            │                      │
            │                      │
            ▼                      ▼
┌─────────────────┐      ┌─────────────────┐
│   Puppeteer     │      │  docx Library   │
│   (Headless     │      │                 │
│   Browser)      │      │                 │
└────────┬────────┘      └────────┬────────┘
         │                        │
         │ PDF Buffer             │ Word Buffer
         ▼                        ▼
┌────────────────────────────────────────────┐
│         Response to Client                 │
│                                            │
│  • Content-Type: application/pdf           │
│  • Content-Disposition: attachment         │
│  • Binary file data                        │
└──────────────┬─────────────────────────────┘
               │
               ▼
┌─────────────────────────┐
│  Browser downloads      │
│  resume.pdf or          │
│  resume.docx            │
└─────────────────────────┘
```

### 3.3 Resume Save & Retrieve Flow

```
         SAVE FLOW                           RETRIEVE FLOW
         
┌──────────────┐                      ┌──────────────┐
│ ResumeBuilder│                      │  MyResumes   │
└──────┬───────┘                      └──────┬───────┘
       │                                     │
       │ POST /api/resumes                   │ GET /api/resumes
       │ {                                   │
       │   personalInfo: {...},              │
       │   experience: [...],                ▼
       │   skills: [...],            ┌────────────────┐
       │   templateId: "modern"      │resumeController│
       │ }                           │  .getAllResumes│
       ▼                             └───────┬────────┘
┌────────────────┐                           │
│resumeController│                           │
│  .createResume │                           ▼
└───────┬────────┘                  ┌──────────────────┐
        │                           │  Resume.find()   │
        │ Validate data             │                  │
        ▼                           │  Returns array   │
┌────────────────┐                  │  of resumes      │
│ new Resume()   │                  └────────┬─────────┘
│                │                           │
│ Save to DB     │                           │ JSON array
└───────┬────────┘                           │
        │                                    ▼
        │ MongoDB save                ┌──────────────┐
        ▼                             │   Response   │
┌────────────────┐                    │   [          │
│   MongoDB      │                    │     {        │
│   Resumes      │◄───Query───────────│  resume1 },  │
│   Collection   │                    │     {        │
└────────┬───────┘                    │  resume2 }   │
         │                            │   ]          │
         │ Return saved doc           └──────────────┘
         ▼                                    │
┌────────────────┐                           │
│   Response     │                           ▼
│   {            │                    ┌──────────────┐
│  _id: "...",   │                    │  MyResumes   │
│  ...data       │                    │  Component   │
│   }            │                    │  displays    │
└────────┬───────┘                    │  cards       │
         │                            └──────────────┘
         ▼
  ┌──────────────┐
  │ Redirect to  │
  │ MyResumes    │
  └──────────────┘
```

---

## 4. Sequence Diagrams

### 4.1 Complete Voice-to-Resume Sequence

```
User    VoiceInput   Browser      Backend     AI Service   MongoDB
│           │        SpeechAPI      API                       DB
│           │           │           │            │            │
│──speak───>│           │           │            │            │
│           │──start───>│           │            │            │
│           │<─audio────│           │            │            │
│           │           │           │            │            │
│           │─────transcribe────────>│            │            │
│           │<────text──│           │            │            │
│           │           │           │            │            │
│─click "Process"──>    │           │            │            │
│           │           │           │            │            │
│           │───POST /api/ai/process-voice──────>│            │
│           │           │           │            │            │
│           │           │           │──extract───>│            │
│           │           │           │  Resume    │            │
│           │           │           │  Info()    │            │
│           │           │           │            │            │
│           │           │           │            │─API call───>
│           │           │           │            │  (OpenAI/  │
│           │           │           │            │   Ollama)  │
│           │           │           │            │<─JSON─────
│           │           │           │            │  response  │
│           │           │           │            │            │
│           │           │           │<─structured│            │
│           │           │           │    data────│            │
│           │           │           │            │            │
│           │<────JSON resume data──│            │            │
│           │           │           │            │            │
│─navigate─>│           │           │            │            │
│    to     │           │           │            │            │
│  Builder  │           │           │            │            │
│           │           │           │            │            │
│───────────────────────────────────────────────────────────>│
│         ResumeBuilder loads with populated data             │
│<────────────────────────────────────────────────────────────│
│           │           │           │            │            │
│──edit data│           │           │            │            │
│           │           │           │            │            │
│───click "Save"────────────POST /api/resumes───>│            │
│           │           │           │            │            │
│           │           │           │────save────────────────>│
│           │           │           │            │            │
│           │           │           │<───doc saved────────────│
│           │           │           │            │            │
│           │<──────success─────────│            │            │
│           │           │           │            │            │
│<─Success notification │           │            │            │
```

### 4.2 Template Switching Sequence

```
User    ResumeBuilder   Backend API    MongoDB
│            │              │             │
│──select────>│              │             │
│  new       │              │             │
│  template  │              │             │
│            │              │             │
│            │──GET /api/templates/:id───>│
│            │              │             │
│            │              │───query────>│
│            │              │             │
│            │              │<─template───│
│            │              │    data     │
│            │              │             │
│            │<─template────│             │
│            │   JSON       │             │
│            │              │             │
│            │──apply───────┘             │
│            │  styles                    │
│            │  & layout                  │
│            │              │             │
│<─updated───│              │             │
│  preview   │              │             │
│            │              │             │
│──click─────>│              │             │
│  "Save"    │              │             │
│            │              │             │
│            │─PUT /api/resumes/:id──────>│
│            │  { templateId: "new" }     │
│            │              │             │
│            │              │───update───>│
│            │              │             │
│            │              │<─success────│
│            │              │             │
│            │<─updated─────│             │
│            │  resume      │             │
│<─confirmation              │             │
```

---

## 5. Database Design

### 5.1 MongoDB Collections

#### Resume Collection Schema

```javascript
{
  _id: ObjectId("..."),                    // Auto-generated
  
  personalInfo: {
    name: String,                          // Required
    email: String,                         // Required, validated
    phone: String,
    location: String,
    linkedIn: String,
    github: String,
    website: String,
    summary: String                        // ATS-optimized summary
  },
  
  experience: [
    {
      _id: ObjectId("..."),                // Sub-document ID
      company: String,
      role: String,
      duration: String,                    // e.g., "Jan 2020 - Present"
      description: String,                 // Bullet points with \n
      order: Number                        // For drag-drop ordering
    }
  ],
  
  education: [
    {
      _id: ObjectId("..."),
      institution: String,
      degree: String,
      year: String,
      order: Number
    }
  ],
  
  skills: [
    {
      _id: ObjectId("..."),
      category: String,                    // e.g., "Programming Languages"
      skills: [String],                    // Array of skill names
      order: Number
    }
  ],
  
  projects: [
    {
      _id: ObjectId("..."),
      name: String,
      description: String,
      technologies: [String],
      order: Number
    }
  ],
  
  certifications: [
    {
      _id: ObjectId("..."),
      name: String,
      issuer: String,
      year: String,
      order: Number
    }
  ],
  
  achievements: [
    {
      _id: ObjectId("..."),
      description: String,
      order: Number
    }
  ],
  
  templateId: String,                      // Reference to template
  
  layout: {                                // Custom layout overrides
    sectionOrder: [String],                // e.g., ["experience", "education"]
    customStyles: Object
  },
  
  transcriptions: [                        // Voice input history
    {
      text: String,
      timestamp: Date
    }
  ],
  
  createdAt: Date,                         // Auto-set
  updatedAt: Date                          // Auto-updated on save
}
```

#### Template Collection Schema

```javascript
{
  _id: ObjectId("..."),
  
  id: String,                              // Unique identifier (e.g., "modern")
  name: String,                            // Display name
  description: String,                     // Template description
  
  category: String,                        // Enum: modern, classic, creative, minimal
  
  layout: {
    headerLayout: String,                  // "centered", "left", "split"
    columns: Number,                       // 1 or 2
    sectionSpacing: Number,
    margins: {
      top: Number,
      right: Number,
      bottom: Number,
      left: Number
    }
  },
  
  styles: {
    fonts: {
      primary: String,                     // Font family for headers
      secondary: String,                   // Font family for body
      sizes: {
        h1: Number,
        h2: Number,
        body: Number
      }
    },
    colors: {
      primary: String,                     // Hex color
      secondary: String,
      text: String,
      background: String
    },
    spacing: {
      lineHeight: Number,
      paragraphSpacing: Number
    }
  },
  
  thumbnail: String,                       // URL or base64 preview image
  
  isActive: Boolean,                       // Whether template is available
  
  createdAt: Date
}
```

### 5.2 Database Relationships

```
┌─────────────────┐
│     Resume      │
│                 │
│  templateId ────┼──────┐
│  (String)       │      │  Reference (Soft)
└─────────────────┘      │
                         │
                         ▼
                 ┌─────────────────┐
                 │    Template     │
                 │                 │
                 │  id: "modern"   │
                 │  name: "Modern" │
                 │  styles: {...}  │
                 └─────────────────┘

Note: No foreign key constraints (MongoDB NoSQL)
Templates are referenced by string ID
```

### 5.3 Indexing Strategy

```javascript
// Resume Collection Indexes
db.resumes.createIndex({ "personalInfo.email": 1 });
db.resumes.createIndex({ createdAt: -1 });              // For sorting
db.resumes.createIndex({ updatedAt: -1 });
db.resumes.createIndex({ templateId: 1 });

// Template Collection Indexes
db.templates.createIndex({ id: 1 }, { unique: true });
db.templates.createIndex({ category: 1 });
db.templates.createIndex({ isActive: 1 });
```

---

## 6. API Architecture

### 6.1 REST API Design

**Base URL:** `http://localhost:5000/api`

#### API Endpoints Structure

```
/api
│
├── /health                              # Health check
│   └── GET                              # Server status
│
├── /resumes                            # Resume resources
│   ├── GET                             # List all resumes
│   ├── POST                            # Create new resume
│   ├── /:id
│   │   ├── GET                        # Get resume by ID
│   │   ├── PUT                        # Update resume
│   │   └── DELETE                     # Delete resume
│   └── /:id/transcriptions
│       └── POST                       # Add voice transcription
│
├── /ai                                # AI processing
│   ├── POST /process-voice           # Extract resume from speech
│   ├── POST /enhance-resume          # Add info to existing resume
│   └── GET  /test-connection         # Test AI provider
│
├── /templates                         # Template resources
│   ├── GET                           # List all templates
│   ├── GET /:id                      # Get template by ID
│   └── POST /initialize              # Create default templates
│
└── /export                           # Export functionality
    ├── POST /pdf                     # Generate PDF
    └── POST /word                    # Generate Word document
```

### 6.2 Request/Response Examples

#### POST /api/ai/process-voice

**Request:**
```json
{
  "speechText": "My name is John Doe, email john@example.com. I'm a Senior Software Engineer with 5 years of experience at Tech Corp. I know JavaScript, React, Node.js, and Python."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "",
      "location": "",
      "summary": "Experienced Senior Software Engineer with 5 years in the industry"
    },
    "experience": [
      {
        "company": "Tech Corp",
        "role": "Senior Software Engineer",
        "duration": "5 years",
        "description": "• Led development of web applications\n• Implemented scalable solutions",
        "order": 0
      }
    ],
    "skills": [
      {
        "category": "Programming Languages",
        "skills": ["JavaScript", "Python"],
        "order": 0
      },
      {
        "category": "Frameworks",
        "skills": ["React", "Node.js"],
        "order": 1
      }
    ],
    "education": [],
    "projects": [],
    "certifications": [],
    "achievements": []
  }
}
```

#### POST /api/resumes

**Request:**
```json
{
  "personalInfo": { ... },
  "experience": [ ... ],
  "skills": [ ... ],
  "templateId": "modern"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "personalInfo": { ... },
    "experience": [ ... ],
    "skills": [ ... ],
    "templateId": "modern",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 6.3 Error Handling

All errors follow consistent format:

```json
{
  "success": false,
  "error": "Detailed error message",
  "code": "ERROR_CODE",           // Optional
  "details": { ... }               // Optional, for validation errors
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable (AI provider down)

---

## 7. Technology Stack

### 7.1 Frontend Stack

```
┌─────────────────────────────────────────┐
│           React 18.2.0                  │  Core UI Library
├─────────────────────────────────────────┤
│        React Router v6.20.1             │  Client-side Routing
├─────────────────────────────────────────┤
│          Axios 1.6.2                    │  HTTP Client
├─────────────────────────────────────────┤
│      react-dnd 16.0.1                   │  Drag & Drop
├─────────────────────────────────────────┤
│  react-speech-recognition 3.10.0        │  Voice Input
├─────────────────────────────────────────┤
│  jsPDF 2.5.1 + html2canvas 1.4.1       │  PDF Generation
├─────────────────────────────────────────┤
│     styled-components 6.1.8             │  CSS-in-JS
├─────────────────────────────────────────┤
│      react-toastify 9.1.3               │  Notifications
└─────────────────────────────────────────┘
```

### 7.2 Backend Stack

```
┌─────────────────────────────────────────┐
│          Node.js v16+                   │  Runtime
├─────────────────────────────────────────┤
│        Express.js 4.18.2                │  Web Framework
├─────────────────────────────────────────┤
│        Mongoose 8.0.3                   │  MongoDB ODM
├─────────────────────────────────────────┤
│         OpenAI 4.20.1                   │  AI Integration
├─────────────────────────────────────────┤
│        Puppeteer 21.6.1                 │  PDF Rendering
├─────────────────────────────────────────┤
│           docx 8.5.0                    │  Word Generation
├─────────────────────────────────────────┤
│          Helmet 7.1.0                   │  Security Headers
├─────────────────────────────────────────┤
│          CORS 2.8.5                     │  Cross-Origin
└─────────────────────────────────────────┘
```

### 7.3 Database & AI

```
┌─────────────────────────────────────────┐
│           MongoDB                       │  NoSQL Database
├─────────────────────────────────────────┤
│      OpenAI GPT-4 Turbo                │  Cloud AI
├─────────────────────────────────────────┤
│      Ollama (llama3.1)                 │  Local AI
└─────────────────────────────────────────┘
```

---

## 8. Scalability & Performance

### 8.1 Current Architecture Limitations

```
Single Server Deployment:

┌──────────────┐
│   Frontend   │  (Port 3000)
│   (React)    │
└──────────────┘
       │
       │ HTTP
       ▼
┌──────────────┐
│   Backend    │  (Port 5000)
│   (Express)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   MongoDB    │  (Port 27017)
└──────────────┘

Bottlenecks:
• Single Express server instance
• AI API calls are synchronous
• No caching layer
• No load balancing
```

### 8.2 Scalability Improvements (Future)

```
Scaled Architecture:

                    ┌──────────────┐
                    │ Load Balancer│
                    │   (Nginx)    │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │ Backend │       │ Backend │       │ Backend │
   │Instance1│       │Instance2│       │Instance3│
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼───────┐
                    │    Redis     │  Cache Layer
                    │   (Session)  │
                    └──────────────┘
                           │
                    ┌──────▼───────┐
                    │   MongoDB    │
                    │   Cluster    │
                    └──────────────┘
```

### 8.3 Performance Optimizations

**Frontend:**
- Code splitting with React.lazy()
- Memoization with React.memo()
- Debounced input handlers
- Lazy loading of templates
- Image optimization

**Backend:**
- Response caching (Redis)
- Database query optimization
- Connection pooling
- Async/await for I/O operations
- Rate limiting for AI API calls

**Database:**
- Proper indexing on frequently queried fields
- Pagination for large result sets
- Projection to return only needed fields

---

## 9. Security Considerations

### 9.1 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND SECURITY                     │
│  • HTTPS Only (in production)                           │
│  • XSS Protection (React escaping)                      │
│  • Content Security Policy                              │
│  • No sensitive data in localStorage                    │
└─────────────────────────────────────────────────────────┘
                           │
                    HTTPS (TLS 1.3)
                           │
┌─────────────────────────────────────────────────────────┐
│                    API LAYER SECURITY                    │
│  • Helmet.js (Security Headers)                         │
│  • CORS (Restricted Origins)                            │
│  • Rate Limiting                                        │
│  • Input Validation (express-validator)                │
│  • SQL Injection Prevention (Mongoose)                  │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                  DATABASE SECURITY                       │
│  • MongoDB Authentication                               │
│  • Network Restrictions                                 │
│  • Encrypted Connections                                │
│  • Regular Backups                                      │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Authentication Flow (Future Implementation)

```
User Login Flow:

1. User submits credentials
   ├─► Email validation
   └─► Password validation (min 8 chars, complexity)

2. Backend verifies
   ├─► Hash comparison (bcrypt)
   └─► User lookup in DB

3. Generate JWT Token
   ├─► Payload: { userId, email, role }
   ├─► Secret Key from env
   └─► Expiry: 7 days

4. Return Token
   └─► Store in httpOnly cookie (secure)

5. Protected Routes
   ├─► Extract token from cookie
   ├─► Verify signature
   ├─► Check expiry
   └─► Attach user to request
```

---

## 10. Deployment Architecture

### 10.1 Development Environment

```
Developer Machine:

┌────────────────────────────────────────┐
│  Frontend: localhost:3000              │
│  Backend:  localhost:5000              │
│  MongoDB:  localhost:27017             │
│  Ollama:   localhost:11434 (optional)  │
└────────────────────────────────────────┘
```

### 10.2 Production Environment (Recommended)

```
                     ┌──────────────┐
                     │  CloudFlare  │  CDN & DDoS Protection
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Vercel    │  Frontend Hosting
                     │   (React)    │  - Auto SSL
                     └──────┬───────┘  - CDN
                            │          - Auto scaling
                            │
                    API Calls (HTTPS)
                            │
                            ▼
                     ┌──────────────┐
                     │   Heroku /   │  Backend Hosting
                     │  AWS EC2 /   │  - Load balanced
                     │  DigitalOcean│  - Auto restart
                     └──────┬───────┘  - PM2 process mgr
                            │
                            ▼
                     ┌──────────────┐
                     │  MongoDB     │  Database Hosting
                     │   Atlas      │  - Replica sets
                     │  (Cloud)     │  - Auto backups
                     └──────────────┘  - Global clusters

                     ┌──────────────┐
                     │   OpenAI     │  AI Service
                     │     API      │  - Rate limited
                     └──────────────┘  - API key secured
```

---

## Summary

This system design follows **modern best practices** with:

✅ **Clear separation of concerns** (Frontend, Backend, Database)
✅ **RESTful API design** with standard HTTP methods
✅ **Modular architecture** for easy maintenance
✅ **Scalable components** that can be distributed
✅ **Security-first** approach with multiple layers
✅ **NoSQL flexibility** for resume data structures
✅ **AI integration** with provider abstraction
✅ **Export functionality** with multiple formats

The architecture is **production-ready** while remaining **simple enough** for a single developer to maintain and extend.


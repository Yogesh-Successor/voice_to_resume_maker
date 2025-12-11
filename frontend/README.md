# Voice to ATS Resume Maker - Frontend

Modern React frontend for creating professional, ATS-optimized resumes using voice input and AI.

## Features

- 🎤 **Voice Recording** - Browser-based speech recognition
- 🤖 **AI Integration** - Automatic resume generation from speech
- 🎨 **Multiple Templates** - Professional, Modern, Creative, and Minimal designs
- ✏️ **Drag & Drop Editing** - Reorder resume sections easily
- 📥 **Export Options** - Download as PDF or Word document
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 💾 **Auto-save** - Never lose your progress

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router DOM v6
- **Drag & Drop**: react-dnd
- **Voice Recognition**: react-speech-recognition
- **PDF Generation**: jsPDF + html2canvas
- **HTTP Client**: Axios
- **UI Components**: Custom components with styled-components
- **Notifications**: react-toastify
- **Icons**: react-icons

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser (Chrome, Edge, or Safari for best speech recognition)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## Running the App

Development mode:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Production build:
```bash
npm run build
```

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Header.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── Modal.js
│   │   ├── VoiceRecorder/       # Voice input component
│   │   │   ├── VoiceRecorder.js
│   │   │   └── VoiceRecorder.css
│   │   └── Resume/              # Resume components
│   │       ├── DraggableSection.js
│   │       ├── ResumePreview.js
│   │       └── styles...
│   ├── pages/                   # Page components
│   │   ├── Home.js
│   │   ├── VoiceInput.js
│   │   ├── TemplateSelection.js
│   │   ├── ResumeBuilder.js
│   │   └── MyResumes.js
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Features Guide

### 1. Voice Input

- Navigate to "Voice Input" page
- Click "Start Recording" button
- Speak naturally about your experience
- Click "Stop Recording" when done
- Review transcript and click "Process with AI"

**Supported Browsers:**
- Chrome (Recommended)
- Edge
- Safari

### 2. Template Selection

- Choose from 4 professional templates:
  - **Modern**: Clean and contemporary
  - **Classic**: Traditional and professional
  - **Creative**: Eye-catching for creative roles
  - **Minimal**: Simple and content-focused

### 3. Resume Builder

- **Preview Mode**: See how your resume looks
- **Edit Mode**: Modify content directly
- **Add Voice**: Add more information via speech
- **Export**: Download as PDF or Word
- **Print**: Print directly from browser

### 4. My Resumes

- View all created resumes
- Edit existing resumes
- Delete unwanted resumes
- Track creation and update dates

## Component Documentation

### Common Components

#### Button
```jsx
<Button 
  variant="primary|secondary|success|danger|outline"
  size="small|medium|large"
  icon={<Icon />}
  onClick={handleClick}
  disabled={false}
>
  Click Me
</Button>
```

#### Card
```jsx
<Card 
  title="Card Title"
  subtitle="Card Subtitle"
  className="custom-class"
>
  Card Content
</Card>
```

#### Modal
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="small|medium|large"
>
  Modal Content
</Modal>
```

### VoiceRecorder

```jsx
<VoiceRecorder 
  onTranscriptComplete={(transcript) => console.log(transcript)}
  initialTranscript=""
/>
```

### ResumePreview

```jsx
<ResumePreview 
  resumeData={resumeData}
  templateId="modern"
/>
```

## Styling

The app uses CSS custom properties (variables) for theming:

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
  --success-color: #27ae60;
  --danger-color: #e74c3c;
  --light-gray: #ecf0f1;
  --dark-gray: #7f8c8d;
}
```

## Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Voice Recognition | ✅ | ✅ | ✅ | ❌* |
| Drag & Drop | ✅ | ✅ | ✅ | ✅ |
| PDF Export | ✅ | ✅ | ✅ | ✅ |

*Firefox users can manually type their information

## Troubleshooting

### Voice Recognition Not Working

1. Ensure you're using Chrome, Edge, or Safari
2. Check microphone permissions in browser settings
3. Verify microphone is working in system settings
4. Try refreshing the page

### PDF Export Issues

1. Ensure all content is loaded before exporting
2. Check browser console for errors
3. Try a different browser
4. Disable browser extensions temporarily

### API Connection Errors

1. Verify backend server is running
2. Check REACT_APP_API_URL in .env file
3. Ensure CORS is properly configured on backend
4. Check browser console for detailed errors

## Performance Optimization

- Code splitting with React.lazy (can be added)
- Image optimization
- Memoization of expensive components
- Debouncing of input handlers
- Efficient re-renders with React.memo

## Contributing

When adding new features:

1. Follow the existing component structure
2. Use common components when possible
3. Add PropTypes for type checking
4. Include responsive styles
5. Test across different browsers

## License

MIT

## Support

For issues and questions, please check:
- Backend README for API-related issues
- Browser console for client-side errors
- Network tab for API communication issues


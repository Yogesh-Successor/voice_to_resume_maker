import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VoiceRecorder from '../components/VoiceRecorder/VoiceRecorder';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { aiAPI, resumeAPI } from '../services/api';
import './VoiceInput.css';

const VoiceInput = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleTranscriptComplete = async (transcript) => {
    setIsProcessing(true);
    
    try {
      // Step 1: Process voice input with AI
      toast.info('Processing your speech with AI...');
      const aiResponse = await aiAPI.processVoice(transcript);
      const resumeData = aiResponse.data.data;

      // Step 2: Save the resume
      toast.info('Creating your resume...');
      const saveResponse = await resumeAPI.create({
        ...resumeData,
        transcriptions: [{ text: transcript }]
      });

      const resumeId = saveResponse.data.data._id;

      // Step 3: Navigate to resume builder
      toast.success('Resume created successfully!');
      setTimeout(() => {
        navigate(`/builder/${resumeId}`);
      }, 1000);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      
      if (error.response?.status === 500) {
        toast.error('AI service is unavailable. Please ensure the backend is running and AI provider is configured.');
      } else {
        toast.error(error.response?.data?.error || 'Failed to process voice input. Please try again.');
      }
      
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="voice-input-page">
        <div className="container">
          <LoadingSpinner message="Creating your AI-optimized resume..." />
          <p className="text-center mt-3" style={{ color: 'var(--dark-gray)' }}>
            This may take a few moments. Please don't close this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-input-page">
      <div className="container">
        <div className="page-header">
          <h1>Voice Input</h1>
          <p>Speak naturally about your professional experience and let AI create your resume</p>
        </div>

        <div className="voice-input-content">
          <VoiceRecorder onTranscriptComplete={handleTranscriptComplete} />
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>📝 What to Include</h3>
            <ul>
              <li>Your full name and contact information</li>
              <li>Professional summary or objective</li>
              <li>Work experience with roles, companies, and achievements</li>
              <li>Educational background</li>
              <li>Technical skills and tools you've used</li>
              <li>Notable projects and their impact</li>
              <li>Certifications and achievements</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>💡 Example Speech</h3>
            <p className="example-text">
              "Hi, my name is John Doe. I'm a Senior Software Engineer with 5 years of experience. 
              I've worked at Tech Corp as a Full Stack Developer for 3 years, where I built scalable 
              web applications using React, Node.js, and MongoDB. Before that, I was at Startup Inc 
              as a Junior Developer. I have a Bachelor's degree in Computer Science from State University. 
              My skills include JavaScript, Python, React, Node.js, AWS, and Docker. I've led several 
              projects including an e-commerce platform that increased sales by 40%."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;


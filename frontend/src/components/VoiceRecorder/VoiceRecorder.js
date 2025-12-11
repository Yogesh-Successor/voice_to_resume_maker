import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaStop, FaTrash } from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Button from '../common/Button';
import Card from '../common/Card';
import './VoiceRecorder.css';

const VoiceRecorder = ({ onTranscriptComplete, initialTranscript = '' }) => {
  const [fullTranscript, setFullTranscript] = useState(initialTranscript);
  const [isRecording, setIsRecording] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening && transcript && isRecording) {
      // Add the new transcript to the full transcript
      setFullTranscript(prev => {
        const newTranscript = prev 
          ? `${prev} ${transcript}` 
          : transcript;
        return newTranscript;
      });
      resetTranscript();
    }
  }, [listening, transcript, isRecording, resetTranscript]);

  const startRecording = () => {
    setIsRecording(true);
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  const stopRecording = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    
    // Add any remaining transcript
    if (transcript) {
      setFullTranscript(prev => {
        const newTranscript = prev 
          ? `${prev} ${transcript}` 
          : transcript;
        return newTranscript;
      });
      resetTranscript();
    }
  };

  const clearTranscript = () => {
    setFullTranscript('');
    resetTranscript();
  };

  const handleComplete = () => {
    if (fullTranscript.trim()) {
      onTranscriptComplete(fullTranscript);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Card title="Voice Recorder">
        <div className="alert alert-warning">
          <p>Your browser doesn't support speech recognition.</p>
          <p>Please use Chrome, Edge, or Safari for the best experience.</p>
          <p>Alternatively, you can type your resume information below:</p>
          <textarea
            className="input-field textarea-field"
            value={fullTranscript}
            onChange={(e) => setFullTranscript(e.target.value)}
            placeholder="Type your resume information here..."
            rows={10}
          />
          <div className="voice-actions mt-3">
            <Button 
              variant="primary" 
              onClick={handleComplete}
              disabled={!fullTranscript.trim()}
            >
              Continue
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Voice Recorder" subtitle="Speak about your professional experience">
      <div className="voice-recorder">
        <div className="recording-status">
          {isRecording && (
            <div className="recording-indicator">
              <div className="pulse-dot"></div>
              <span>Recording... Speak now</span>
            </div>
          )}
          {!isRecording && fullTranscript && (
            <div className="recording-indicator ready">
              <span>Ready to continue or process</span>
            </div>
          )}
        </div>

        <div className="voice-controls">
          {!isRecording ? (
            <Button
              variant="primary"
              size="large"
              onClick={startRecording}
              icon={<FaMicrophone />}
            >
              Start Recording
            </Button>
          ) : (
            <Button
              variant="danger"
              size="large"
              onClick={stopRecording}
              icon={<FaStop />}
            >
              Stop Recording
            </Button>
          )}
        </div>

        {fullTranscript && (
          <div className="transcript-display">
            <div className="transcript-header">
              <h4>Your Transcript:</h4>
              <Button
                variant="outline"
                size="small"
                onClick={clearTranscript}
                icon={<FaTrash />}
              >
                Clear
              </Button>
            </div>
            <div className="transcript-content">
              {fullTranscript}
              {listening && transcript && (
                <span className="current-speech"> {transcript}</span>
              )}
            </div>
          </div>
        )}

        <div className="voice-tips">
          <h4>💡 Tips for best results:</h4>
          <ul>
            <li>Speak clearly and at a moderate pace</li>
            <li>Mention your name, role, and years of experience</li>
            <li>Describe your key skills and technologies</li>
            <li>Talk about your work experience and achievements</li>
            <li>Include education and certifications</li>
          </ul>
        </div>

        {fullTranscript && (
          <div className="voice-actions">
            <Button
              variant="success"
              size="large"
              onClick={handleComplete}
            >
              Process with AI
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VoiceRecorder;


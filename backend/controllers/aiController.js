const aiService = require('../services/aiService');
const Resume = require('../models/Resume');

// Process speech text and extract resume information
exports.processVoiceInput = async (req, res) => {
  try {
    const { speechText } = req.body;

    if (!speechText) {
      return res.status(400).json({
        success: false,
        error: 'Speech text is required'
      });
    }

    // Extract resume information using AI
    const resumeData = await aiService.extractResumeInfo(speechText);

    res.status(200).json({
      success: true,
      data: resumeData
    });
  } catch (error) {
    console.error('Voice processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process voice input'
    });
  }
};

// Enhance existing resume with additional speech input
exports.enhanceResume = async (req, res) => {
  try {
    const { resumeId, additionalSpeech } = req.body;

    if (!resumeId || !additionalSpeech) {
      return res.status(400).json({
        success: false,
        error: 'Resume ID and additional speech are required'
      });
    }

    // Fetch existing resume
    const resume = await Resume.findById(resumeId);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // Prepare existing data
    const existingData = {
      personalInfo: resume.personalInfo,
      experience: resume.experience,
      education: resume.education,
      skills: resume.skills,
      projects: resume.projects,
      certifications: resume.certifications,
      achievements: resume.achievements
    };

    // Enhance with AI
    const enhancedData = await aiService.enhanceResumeData(existingData, additionalSpeech);

    // Update resume
    Object.assign(resume, enhancedData);
    resume.transcriptions.push({ text: additionalSpeech });
    await resume.save();

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Resume enhancement error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to enhance resume'
    });
  }
};

// Test AI connection
exports.testAIConnection = async (req, res) => {
  try {
    const testPrompt = 'Hello, please respond with: {"status": "connected"}';
    
    let result;
    if (aiService.provider === 'openai') {
      result = await aiService.processWithOpenAI(testPrompt);
    } else {
      result = await aiService.processWithOllama(testPrompt);
    }

    res.status(200).json({
      success: true,
      provider: aiService.provider,
      message: 'AI connection successful',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      provider: aiService.provider
    });
  }
};


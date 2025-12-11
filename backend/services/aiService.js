const axios = require('axios');
const OpenAI = require('openai');

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'ollama';
    
    if (this.provider === 'openai') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      this.ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
      this.ollamaModel = process.env.OLLAMA_MODEL || 'llama3.1';
    }
  }

  /**
   * Extract resume information from speech text using AI
   * @param {string} speechText - Transcribed speech text
   * @returns {Promise<Object>} - Structured resume data
   */
  async extractResumeInfo(speechText) {
    const prompt = this.buildPrompt(speechText);
    
    try {
      if (this.provider === 'openai') {
        return await this.processWithOpenAI(prompt);
      } else {
        return await this.processWithOllama(prompt);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }

  buildPrompt(speechText) {
    return `You are an expert ATS (Applicant Tracking System) resume optimizer. 
Extract and structure the following information from the speech text into a professional resume format.

Speech Text:
${speechText}

Return ONLY a valid JSON object with this exact structure (no additional text):
{
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedIn": "string",
    "github": "string",
    "website": "string",
    "summary": "string (professional summary optimized for ATS)"
  },
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "description": "string (with bullet points using \\n• format)",
      "order": 0
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string",
      "order": 0
    }
  ],
  "skills": [
    {
      "category": "string (e.g., Programming Languages, Frameworks, Tools)",
      "skills": ["string"],
      "order": 0
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "order": 0
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": "string",
      "order": 0
    }
  ],
  "achievements": [
    {
      "description": "string",
      "order": 0
    }
  ]
}

Guidelines:
- Use action verbs and quantifiable achievements
- Optimize keywords for ATS systems
- Keep descriptions professional and concise
- If information is not provided, use empty strings or empty arrays
- Ensure all fields are present in the response`;
  }

  async processWithOpenAI(prompt) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an ATS resume optimization expert. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  }

  async processWithOllama(prompt) {
    const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
      model: this.ollamaModel,
      prompt: prompt,
      stream: false,
      format: 'json',
      options: {
        temperature: 0.7,
        top_p: 0.9
      }
    });

    const content = response.data.response;
    return JSON.parse(content);
  }

  /**
   * Enhance existing resume data with additional speech input
   * @param {Object} existingData - Current resume data
   * @param {string} additionalSpeech - New speech text
   * @returns {Promise<Object>} - Updated resume data
   */
  async enhanceResumeData(existingData, additionalSpeech) {
    const prompt = `You are an ATS resume optimizer. Update the following resume with new information from additional speech input.

Current Resume Data:
${JSON.stringify(existingData, null, 2)}

Additional Speech Input:
${additionalSpeech}

Return the UPDATED resume as a valid JSON object with the same structure. Merge new information intelligently:
- Add new experiences, skills, projects, etc.
- Update existing information if the new input provides more detail
- Maintain ATS optimization
- Keep all existing data unless explicitly contradicted

Return ONLY the JSON object.`;

    try {
      if (this.provider === 'openai') {
        return await this.processWithOpenAI(prompt);
      } else {
        return await this.processWithOllama(prompt);
      }
    } catch (error) {
      console.error('AI Enhancement Error:', error);
      throw new Error(`AI enhancement failed: ${error.message}`);
    }
  }
}

module.exports = new AIService();


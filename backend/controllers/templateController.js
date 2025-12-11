const Template = require('../models/Template');

// Get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isActive: true });
    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findOne({ id: req.params.id });
    
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create default templates (for initialization)
exports.createDefaultTemplates = async (req, res) => {
  try {
    const defaultTemplates = [
      {
        id: 'modern',
        name: 'Modern Professional',
        description: 'Clean and modern design with a professional look',
        category: 'modern',
        thumbnail: '/templates/modern-thumbnail.png',
        layout: {
          columns: 1,
          spacing: 'comfortable',
          sections: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects']
        },
        styles: {
          primaryColor: '#3498db',
          fontFamily: 'Arial, sans-serif',
          headerSize: '32px'
        }
      },
      {
        id: 'classic',
        name: 'Classic Traditional',
        description: 'Traditional resume format suitable for conservative industries',
        category: 'classic',
        thumbnail: '/templates/classic-thumbnail.png',
        layout: {
          columns: 1,
          spacing: 'compact',
          sections: ['personalInfo', 'experience', 'education', 'skills']
        },
        styles: {
          primaryColor: '#2c3e50',
          fontFamily: 'Times New Roman, serif',
          headerSize: '28px'
        }
      },
      {
        id: 'creative',
        name: 'Creative Designer',
        description: 'Eye-catching design for creative professionals',
        category: 'creative',
        thumbnail: '/templates/creative-thumbnail.png',
        layout: {
          columns: 2,
          spacing: 'comfortable',
          sections: ['personalInfo', 'summary', 'skills', 'experience', 'projects', 'education']
        },
        styles: {
          primaryColor: '#e74c3c',
          fontFamily: 'Helvetica, sans-serif',
          headerSize: '36px'
        }
      },
      {
        id: 'minimal',
        name: 'Minimal Clean',
        description: 'Minimalist design focusing on content',
        category: 'minimal',
        thumbnail: '/templates/minimal-thumbnail.png',
        layout: {
          columns: 1,
          spacing: 'comfortable',
          sections: ['personalInfo', 'experience', 'skills', 'education']
        },
        styles: {
          primaryColor: '#34495e',
          fontFamily: 'Arial, sans-serif',
          headerSize: '30px'
        }
      }
    ];

    // Delete existing templates
    await Template.deleteMany({});

    // Insert default templates
    const templates = await Template.insertMany(defaultTemplates);

    res.status(201).json({
      success: true,
      message: 'Default templates created successfully',
      count: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


const exportService = require('../services/exportService');
const Resume = require('../models/Resume');

// Export resume as PDF
exports.exportPDF = async (req, res) => {
  try {
    const { resumeId, htmlContent } = req.body;

    let html;
    
    if (htmlContent) {
      // Use provided HTML content
      html = htmlContent;
    } else if (resumeId) {
      // Fetch resume and build HTML
      const resume = await Resume.findById(resumeId);
      
      if (!resume) {
        return res.status(404).json({
          success: false,
          error: 'Resume not found'
        });
      }

      html = exportService.buildHTMLContent(resume, resume.templateId);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Either resumeId or htmlContent is required'
      });
    }

    const pdfBuffer = await exportService.generatePDF(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate PDF'
    });
  }
};

// Export resume as Word document
exports.exportWord = async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        error: 'Resume ID is required'
      });
    }

    const resume = await Resume.findById(resumeId);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    const docxBuffer = await exportService.generateWord(resume);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.docx');
    res.send(docxBuffer);
  } catch (error) {
    console.error('Word export error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate Word document'
    });
  }
};


const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const puppeteer = require('puppeteer');
const path = require('path');

class ExportService {
  /**
   * Generate PDF from HTML content
   * @param {string} htmlContent - HTML content of resume
   * @returns {Promise<Buffer>} - PDF buffer
   */
  async generatePDF(htmlContent) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate Word document from resume data
   * @param {Object} resumeData - Resume data object
   * @returns {Promise<Buffer>} - DOCX buffer
   */
  async generateWord(resumeData) {
    const sections = [];

    // Personal Info Section
    const personalInfo = resumeData.personalInfo || {};
    sections.push(
      new Paragraph({
        text: personalInfo.name || '',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );

    // Contact Info
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location
    ].filter(Boolean).join(' | ');

    if (contactInfo) {
      sections.push(
        new Paragraph({
          text: contactInfo,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        })
      );
    }

    // Links
    const links = [
      personalInfo.linkedIn,
      personalInfo.github,
      personalInfo.website
    ].filter(Boolean).join(' | ');

    if (links) {
      sections.push(
        new Paragraph({
          text: links,
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        })
      );
    }

    // Summary
    if (personalInfo.summary) {
      sections.push(
        new Paragraph({
          text: 'PROFESSIONAL SUMMARY',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: personalInfo.summary,
          spacing: { after: 300 }
        })
      );
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      sections.push(
        new Paragraph({
          text: 'EXPERIENCE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      resumeData.experience.forEach(exp => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.role || '', bold: true }),
              new TextRun({ text: ` - ${exp.company || ''}` })
            ],
            spacing: { after: 50 }
          }),
          new Paragraph({
            text: exp.duration || '',
            italics: true,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: exp.description || '',
            spacing: { after: 200 }
          })
        );
      });
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      sections.push(
        new Paragraph({
          text: 'EDUCATION',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      resumeData.education.forEach(edu => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.degree || '', bold: true }),
              new TextRun({ text: ` - ${edu.institution || ''}` })
            ],
            spacing: { after: 50 }
          }),
          new Paragraph({
            text: edu.year || '',
            spacing: { after: 200 }
          })
        );
      });
    }

    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      sections.push(
        new Paragraph({
          text: 'SKILLS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      resumeData.skills.forEach(skillGroup => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${skillGroup.category}: `, bold: true }),
              new TextRun({ text: skillGroup.skills.join(', ') })
            ],
            spacing: { after: 100 }
          })
        );
      });
    }

    // Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      sections.push(
        new Paragraph({
          text: 'PROJECTS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );

      resumeData.projects.forEach(project => {
        sections.push(
          new Paragraph({
            text: project.name || '',
            bold: true,
            spacing: { after: 50 }
          }),
          new Paragraph({
            text: project.description || '',
            spacing: { after: 50 }
          }),
          new Paragraph({
            text: `Technologies: ${project.technologies.join(', ')}`,
            italics: true,
            spacing: { after: 200 }
          })
        );
      });
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });

    return await Packer.toBuffer(doc);
  }

  /**
   * Build HTML content from resume data and template
   * @param {Object} resumeData - Resume data
   * @param {string} templateId - Template identifier
   * @returns {string} - HTML content
   */
  buildHTMLContent(resumeData, templateId = 'modern') {
    // Basic HTML template - can be expanded with actual templates
    const personalInfo = resumeData.personalInfo || {};
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { font-size: 32px; margin-bottom: 10px; color: #2c3e50; }
    .header .contact { font-size: 14px; color: #7f8c8d; }
    .section { margin-bottom: 25px; }
    .section h2 { font-size: 20px; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-bottom: 15px; }
    .experience-item, .education-item, .project-item { margin-bottom: 15px; }
    .experience-item h3, .education-item h3, .project-item h3 { font-size: 16px; color: #2c3e50; }
    .experience-item .duration, .education-item .year { font-style: italic; color: #7f8c8d; font-size: 14px; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 10px; }
    .skill-category { margin-bottom: 10px; }
    .skill-category strong { color: #2c3e50; }
    ul { margin-left: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${personalInfo.name || 'Resume'}</h1>
    <div class="contact">
      ${[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}
    </div>
    <div class="contact">
      ${[personalInfo.linkedIn, personalInfo.github, personalInfo.website].filter(Boolean).join(' | ')}
    </div>
  </div>

  ${personalInfo.summary ? `
  <div class="section">
    <h2>Professional Summary</h2>
    <p>${personalInfo.summary}</p>
  </div>
  ` : ''}

  ${resumeData.experience && resumeData.experience.length > 0 ? `
  <div class="section">
    <h2>Experience</h2>
    ${resumeData.experience.map(exp => `
      <div class="experience-item">
        <h3>${exp.role} - ${exp.company}</h3>
        <div class="duration">${exp.duration}</div>
        <p>${exp.description}</p>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${resumeData.education && resumeData.education.length > 0 ? `
  <div class="section">
    <h2>Education</h2>
    ${resumeData.education.map(edu => `
      <div class="education-item">
        <h3>${edu.degree} - ${edu.institution}</h3>
        <div class="year">${edu.year}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${resumeData.skills && resumeData.skills.length > 0 ? `
  <div class="section">
    <h2>Skills</h2>
    <div class="skills-grid">
      ${resumeData.skills.map(skillGroup => `
        <div class="skill-category">
          <strong>${skillGroup.category}:</strong> ${skillGroup.skills.join(', ')}
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  ${resumeData.projects && resumeData.projects.length > 0 ? `
  <div class="section">
    <h2>Projects</h2>
    ${resumeData.projects.map(project => `
      <div class="project-item">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <p><em>Technologies: ${project.technologies.join(', ')}</em></p>
      </div>
    `).join('')}
  </div>
  ` : ''}
</body>
</html>
    `;
  }
}

module.exports = new ExportService();


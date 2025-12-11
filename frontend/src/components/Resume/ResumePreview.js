import React from 'react';
import './ResumePreview.css';

const ResumePreview = ({ resumeData, templateId = 'modern' }) => {
  const { personalInfo, experience, education, skills, projects, certifications, achievements } = resumeData;

  return (
    <div className={`resume-preview template-${templateId}`} id="resume-preview">
      {/* Personal Info */}
      {personalInfo && (
        <div className="resume-section personal-info">
          <h1 className="resume-name">{personalInfo.name || 'Your Name'}</h1>
          <div className="contact-info">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="contact-links">
            {personalInfo.linkedIn && <a href={personalInfo.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {personalInfo.github && <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
            {personalInfo.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">Website</a>}
          </div>
          {personalInfo.summary && (
            <div className="summary">
              <p>{personalInfo.summary}</p>
            </div>
          )}
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="resume-section">
          <h2 className="section-heading">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="item-header">
                <h3 className="item-title">{exp.role}</h3>
                <span className="item-subtitle">{exp.company}</span>
              </div>
              <div className="item-duration">{exp.duration}</div>
              <div className="item-description">
                {exp.description && exp.description.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="resume-section">
          <h2 className="section-heading">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="item-header">
                <h3 className="item-title">{edu.degree}</h3>
                <span className="item-subtitle">{edu.institution}</span>
              </div>
              <div className="item-duration">{edu.year}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="resume-section">
          <h2 className="section-heading">Skills</h2>
          <div className="skills-container">
            {skills.map((skillGroup, index) => (
              <div key={index} className="skill-group">
                <strong>{skillGroup.category}:</strong>{' '}
                {skillGroup.skills.join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="resume-section">
          <h2 className="section-heading">Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <h3 className="item-title">{project.name}</h3>
              <p className="item-description">{project.description}</p>
              <p className="technologies">
                <em>Technologies: {project.technologies.join(', ')}</em>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="resume-section">
          <h2 className="section-heading">Certifications</h2>
          {certifications.map((cert, index) => (
            <div key={index} className="certification-item">
              <h3 className="item-title">{cert.name}</h3>
              <span className="item-subtitle">{cert.issuer}</span>
              <span className="item-duration"> - {cert.year}</span>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="resume-section">
          <h2 className="section-heading">Achievements</h2>
          <ul className="achievements-list">
            {achievements.map((achievement, index) => (
              <li key={index}>{achievement.description}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { templateAPI, resumeAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import './TemplateSelection.css';

const TemplateSelection = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await templateAPI.getAll();
      setTemplates(response.data.data);
      
      // If no templates exist, initialize default ones
      if (response.data.data.length === 0) {
        await templateAPI.initialize();
        const newResponse = await templateAPI.getAll();
        setTemplates(newResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template.id);
    
    try {
      // Create a new blank resume with this template
      const response = await resumeAPI.create({
        templateId: template.id,
        personalInfo: {},
        experience: [],
        education: [],
        skills: [],
        projects: []
      });

      const resumeId = response.data.data._id;
      toast.success(`${template.name} template selected!`);
      
      setTimeout(() => {
        navigate(`/builder/${resumeId}`);
      }, 500);
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume');
      setSelectedTemplate(null);
    }
  };

  if (loading) {
    return (
      <div className="template-selection-page">
        <div className="container">
          <LoadingSpinner message="Loading templates..." />
        </div>
      </div>
    );
  }

  return (
    <div className="template-selection-page">
      <div className="container">
        <div className="page-header">
          <h1>Choose Your Template</h1>
          <p>Select a professional template to start building your resume</p>
        </div>

        <div className="templates-grid">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            >
              <div className="template-preview">
                <div className={`template-thumbnail template-${template.id}`}>
                  <div className="thumbnail-content">
                    <div className="thumbnail-header"></div>
                    <div className="thumbnail-line"></div>
                    <div className="thumbnail-line short"></div>
                    <div className="thumbnail-section">
                      <div className="thumbnail-line"></div>
                      <div className="thumbnail-line"></div>
                    </div>
                    <div className="thumbnail-section">
                      <div className="thumbnail-line"></div>
                      <div className="thumbnail-line short"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="template-info">
                <h3 className="template-name">{template.name}</h3>
                <p className="template-description">{template.description}</p>
                <span className={`template-category ${template.category}`}>
                  {template.category}
                </span>
              </div>
              <div className="template-actions">
                <Button
                  variant="primary"
                  onClick={() => handleTemplateSelect(template)}
                  disabled={selectedTemplate === template.id}
                >
                  {selectedTemplate === template.id ? 'Selected' : 'Use This Template'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="template-note">
          <p>💡 You can change the template anytime while editing your resume</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;


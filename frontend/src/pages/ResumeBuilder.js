import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaDownload, FaMicrophone, FaPrint } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { resumeAPI, aiAPI, exportAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import VoiceRecorder from '../components/VoiceRecorder/VoiceRecorder';
import ResumePreview from '../components/Resume/ResumePreview';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [editMode, setEditMode] = useState('preview'); // 'preview' or 'edit'

  useEffect(() => {
    if (id) {
      fetchResume();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await resumeAPI.getById(id);
      setResumeData(response.data.data);
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to load resume');
      navigate('/my-resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !resumeData) return;

    setSaving(true);
    try {
      await resumeAPI.update(id, resumeData);
      toast.success('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleAddVoice = async (transcript) => {
    setShowVoiceModal(false);
    setLoading(true);

    try {
      toast.info('Processing additional speech...');
      const response = await aiAPI.enhanceResume(id, transcript);
      setResumeData(response.data.data);
      toast.success('Resume updated with new information!');
    } catch (error) {
      console.error('Error enhancing resume:', error);
      toast.error('Failed to process voice input');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      toast.info('Generating PDF...');
      
      const element = document.getElementById('resume-preview');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`resume-${Date.now()}.pdf`);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleExportWord = async () => {
    try {
      toast.info('Generating Word document...');
      
      const response = await exportAPI.exportWord(id);
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-${Date.now()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Word document downloaded successfully!');
    } catch (error) {
      console.error('Error exporting Word:', error);
      toast.error('Failed to generate Word document');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFieldChange = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayFieldChange = (section, index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddArrayItem = (section, newItem) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }));
  };

  const handleDeleteArrayItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="resume-builder-page">
        <div className="container">
          <LoadingSpinner message="Loading resume..." />
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="resume-builder-page">
        <div className="container">
          <p>Resume not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-builder-page">
      <div className="builder-toolbar">
        <div className="toolbar-left">
          <h2>Resume Builder</h2>
        </div>
        <div className="toolbar-actions">
          <Button
            variant="outline"
            size="small"
            icon={<FaMicrophone />}
            onClick={() => setShowVoiceModal(true)}
          >
            Add Voice
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={<FaPrint />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="primary"
            size="small"
            icon={<FaSave />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <div className="export-dropdown">
            <Button
              variant="success"
              size="small"
              icon={<FaDownload />}
            >
              Export
            </Button>
            <div className="export-menu">
              <button onClick={handleExportPDF}>Export as PDF</button>
              <button onClick={handleExportWord}>Export as Word</button>
            </div>
          </div>
        </div>
      </div>

      <div className="builder-content">
        <div className="builder-main">
          <div className="mode-toggle">
            <button
              className={editMode === 'preview' ? 'active' : ''}
              onClick={() => setEditMode('preview')}
            >
              Preview
            </button>
            <button
              className={editMode === 'edit' ? 'active' : ''}
              onClick={() => setEditMode('edit')}
            >
              Edit Fields
            </button>
          </div>

          {editMode === 'preview' ? (
            <div className="preview-container">
              <ResumePreview 
                resumeData={resumeData} 
                templateId={resumeData.templateId}
              />
            </div>
          ) : (
            <div className="edit-container">
              <EditForm
                resumeData={resumeData}
                onFieldChange={handleFieldChange}
                onArrayFieldChange={handleArrayFieldChange}
                onAddArrayItem={handleAddArrayItem}
                onDeleteArrayItem={handleDeleteArrayItem}
              />
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        title="Add Additional Information"
        size="large"
      >
        <VoiceRecorder 
          onTranscriptComplete={handleAddVoice}
          initialTranscript=""
        />
      </Modal>
    </div>
  );
};

// Edit Form Component
const EditForm = ({ 
  resumeData, 
  onFieldChange, 
  onArrayFieldChange, 
  onAddArrayItem, 
  onDeleteArrayItem 
}) => {
  return (
    <div className="edit-form">
      {/* Personal Info */}
      <div className="form-section">
        <h3>Personal Information</h3>
        <div className="form-grid">
          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              type="text"
              className="input-field"
              value={resumeData.personalInfo?.name || ''}
              onChange={(e) => onFieldChange('personalInfo', 'name', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              value={resumeData.personalInfo?.email || ''}
              onChange={(e) => onFieldChange('personalInfo', 'email', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Phone</label>
            <input
              type="tel"
              className="input-field"
              value={resumeData.personalInfo?.phone || ''}
              onChange={(e) => onFieldChange('personalInfo', 'phone', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Location</label>
            <input
              type="text"
              className="input-field"
              value={resumeData.personalInfo?.location || ''}
              onChange={(e) => onFieldChange('personalInfo', 'location', e.target.value)}
            />
          </div>
          <div className="input-group full-width">
            <label className="input-label">Professional Summary</label>
            <textarea
              className="input-field textarea-field"
              value={resumeData.personalInfo?.summary || ''}
              onChange={(e) => onFieldChange('personalInfo', 'summary', e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="form-section">
        <h3>Experience</h3>
        {resumeData.experience?.map((exp, index) => (
          <div key={index} className="array-item">
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Role</label>
                <input
                  type="text"
                  className="input-field"
                  value={exp.role || ''}
                  onChange={(e) => onArrayFieldChange('experience', index, 'role', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Company</label>
                <input
                  type="text"
                  className="input-field"
                  value={exp.company || ''}
                  onChange={(e) => onArrayFieldChange('experience', index, 'company', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Duration</label>
                <input
                  type="text"
                  className="input-field"
                  value={exp.duration || ''}
                  onChange={(e) => onArrayFieldChange('experience', index, 'duration', e.target.value)}
                />
              </div>
              <div className="input-group full-width">
                <label className="input-label">Description</label>
                <textarea
                  className="input-field textarea-field"
                  value={exp.description || ''}
                  onChange={(e) => onArrayFieldChange('experience', index, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <Button
              variant="danger"
              size="small"
              onClick={() => onDeleteArrayItem('experience', index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="small"
          onClick={() => onAddArrayItem('experience', { role: '', company: '', duration: '', description: '' })}
        >
          Add Experience
        </Button>
      </div>
    </div>
  );
};

export default ResumeBuilder;


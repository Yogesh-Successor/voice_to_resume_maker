import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { resumeAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './MyResumes.css';

const MyResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.getAll();
      setResumes(response.data.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the resume "${name || 'Untitled'}"?`)) {
      try {
        await resumeAPI.delete(id);
        setResumes(resumes.filter(resume => resume._id !== id));
        toast.success('Resume deleted successfully');
      } catch (error) {
        console.error('Error deleting resume:', error);
        toast.error('Failed to delete resume');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="my-resumes-page">
        <div className="container">
          <LoadingSpinner message="Loading your resumes..." />
        </div>
      </div>
    );
  }

  return (
    <div className="my-resumes-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>My Resumes</h1>
            <p>Manage and edit your resumes</p>
          </div>
          <div className="header-actions">
            <Link to="/voice-input">
              <Button variant="primary" icon={<FaPlus />}>
                Create New Resume
              </Button>
            </Link>
          </div>
        </div>

        {resumes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h2>No Resumes Yet</h2>
            <p>Create your first resume using voice input or templates</p>
            <div className="empty-actions">
              <Link to="/voice-input">
                <Button variant="primary" size="large">
                  Start with Voice
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="outline" size="large">
                  Choose Template
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="resumes-grid">
            {resumes.map((resume) => (
              <Card key={resume._id} className="resume-card">
                <div className="resume-card-header">
                  <h3 className="resume-name">
                    {resume.personalInfo?.name || 'Untitled Resume'}
                  </h3>
                  <span className={`template-badge template-${resume.templateId}`}>
                    {resume.templateId}
                  </span>
                </div>

                <div className="resume-info">
                  {resume.personalInfo?.email && (
                    <p className="resume-detail">
                      <strong>Email:</strong> {resume.personalInfo.email}
                    </p>
                  )}
                  {resume.experience?.length > 0 && (
                    <p className="resume-detail">
                      <strong>Experience:</strong> {resume.experience.length} position(s)
                    </p>
                  )}
                  {resume.skills?.length > 0 && (
                    <p className="resume-detail">
                      <strong>Skills:</strong> {resume.skills.length} category(ies)
                    </p>
                  )}
                </div>

                <div className="resume-meta">
                  <span className="meta-item">
                    Created: {formatDate(resume.createdAt)}
                  </span>
                  <span className="meta-item">
                    Updated: {formatDate(resume.updatedAt)}
                  </span>
                </div>

                {resume.transcriptions?.length > 0 && (
                  <div className="transcription-count">
                    <span>🎤 {resume.transcriptions.length} voice input(s)</span>
                  </div>
                )}

                <div className="resume-actions">
                  <Button
                    variant="primary"
                    size="small"
                    icon={<FaEdit />}
                    onClick={() => navigate(`/builder/${resume._id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    icon={<FaEye />}
                    onClick={() => navigate(`/builder/${resume._id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    icon={<FaTrash />}
                    onClick={() => handleDelete(resume._id, resume.personalInfo?.name)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResumes;


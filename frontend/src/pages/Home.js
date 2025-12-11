import React from 'react';
import { Link } from 'react-router-dom';
import { FaMicrophone, FaRocket, FaDownload, FaPalette } from 'react-icons/fa';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <FaMicrophone />,
      title: 'Voice Input',
      description: 'Simply speak about your experience and let AI do the work'
    },
    {
      icon: <FaRocket />,
      title: 'ATS Optimized',
      description: 'AI ensures your resume passes Applicant Tracking Systems'
    },
    {
      icon: <FaPalette />,
      title: 'Multiple Templates',
      description: 'Choose from professional, modern, and creative templates'
    },
    {
      icon: <FaDownload />,
      title: 'Export Options',
      description: 'Download your resume as PDF or Word document'
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Create Your Perfect Resume with Voice</h1>
          <p className="hero-subtitle">
            Transform your speech into a professional, ATS-optimized resume in minutes
          </p>
          <div className="hero-actions">
            <Link to="/voice-input">
              <Button variant="primary" size="large" icon={<FaMicrophone />}>
                Start with Voice
              </Button>
            </Link>
            <Link to="/templates">
              <Button variant="outline" size="large">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Voice Resume Maker?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Speak About Yourself</h3>
              <p>Tell us about your experience, skills, and achievements</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Processes</h3>
              <p>Our AI optimizes your content for ATS systems</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Choose Template</h3>
              <p>Select from professional templates and customize</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Download</h3>
              <p>Export your resume as PDF or Word document</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <h2>Ready to Create Your Resume?</h2>
          <p>Start speaking and let AI create your perfect resume</p>
          <Link to="/voice-input">
            <Button variant="success" size="large" icon={<FaMicrophone />}>
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;


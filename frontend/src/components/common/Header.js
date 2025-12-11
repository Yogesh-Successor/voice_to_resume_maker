import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMicrophone, FaFileAlt, FaHome, FaList } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <FaMicrophone className="logo-icon" />
          <span>Voice Resume Maker</span>
        </Link>
        
        <nav className="nav-menu">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <FaHome />
            <span>Home</span>
          </Link>
          <Link to="/voice-input" className={`nav-link ${isActive('/voice-input')}`}>
            <FaMicrophone />
            <span>Voice Input</span>
          </Link>
          <Link to="/templates" className={`nav-link ${isActive('/templates')}`}>
            <FaFileAlt />
            <span>Templates</span>
          </Link>
          <Link to="/my-resumes" className={`nav-link ${isActive('/my-resumes')}`}>
            <FaList />
            <span>My Resumes</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;


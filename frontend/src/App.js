import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/common/Header';
import Home from './pages/Home';
import VoiceInput from './pages/VoiceInput';
import TemplateSelection from './pages/TemplateSelection';
import ResumeBuilder from './pages/ResumeBuilder';
import MyResumes from './pages/MyResumes';

import './App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/voice-input" element={<VoiceInput />} />
              <Route path="/templates" element={<TemplateSelection />} />
              <Route path="/builder/:id?" element={<ResumeBuilder />} />
              <Route path="/my-resumes" element={<MyResumes />} />
            </Routes>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;


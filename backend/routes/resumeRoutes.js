const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

// Resume CRUD routes
router.post('/', resumeController.createResume);
router.get('/', resumeController.getAllResumes);
router.get('/:id', resumeController.getResumeById);
router.put('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);

// Add transcription to resume
router.post('/:id/transcriptions', resumeController.addTranscription);

module.exports = router;


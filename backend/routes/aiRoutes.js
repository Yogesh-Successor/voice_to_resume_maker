const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI processing routes
router.post('/process-voice', aiController.processVoiceInput);
router.post('/enhance-resume', aiController.enhanceResume);
router.get('/test-connection', aiController.testAIConnection);

module.exports = router;


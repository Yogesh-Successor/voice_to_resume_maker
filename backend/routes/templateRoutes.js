const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Template routes
router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);
router.post('/initialize', templateController.createDefaultTemplates);

module.exports = router;


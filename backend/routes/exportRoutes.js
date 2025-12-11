const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

// Export routes
router.post('/pdf', exportController.exportPDF);
router.post('/word', exportController.exportWord);

module.exports = router;


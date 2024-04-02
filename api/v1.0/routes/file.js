/** @format */

const express = require('express');
const router = express.Router();
const FileController = require('../controllers/FileController');
const multer = require('multer');

router.post('/upload', multer({ storage: multer.memoryStorage() }).single('file'), FileController.uploadFile);

module.exports = router;

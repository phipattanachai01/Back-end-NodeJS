const express = require('express');
const router = express.Router();
const proflieController = require('../controllers/ProflieController');

const functionAuth = require('../middleware/functionAuth');
router.get('/Profileuser', functionAuth.verityMidToken, proflieController.ProflieUser);
router.post('/UpdateProfile', proflieController.UpdateProfileUser);

module.exports = router;

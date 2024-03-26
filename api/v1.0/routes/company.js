const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/CompanyController');

router.post('/create',CompanyController.createByCompany);
router.post('/edit/:companyId', CompanyController.editByCompany);
router.post('/view', CompanyController.datalist);
router.post('/delete/:companyId', CompanyController.deleteByCompany);
router.post('/main', CompanyController.mainByCompany);
router.post('/status', CompanyController.StatusCompany);
module.exports = router;
const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/CompanyController');

router.post('/create',CompanyController.createByCompany);
router.post('/edit', CompanyController.editByCompany);
router.post('/view', CompanyController.datalist);
router.post('/delete', CompanyController.deleteByCompany);
router.post('/main', CompanyController.mainByCompany);
router.post('/status', CompanyController.StatusCompany);
// router.post('/viewbyticket', CompanyController.ViewByTicket);
router.post('/count', CompanyController.countContact);
router.post('/listname', CompanyController.listName);
module.exports = router;
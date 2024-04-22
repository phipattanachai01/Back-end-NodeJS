const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/CompanyController');
const functionAuth = require('../middleware/functionAuth');

router.post('/create',functionAuth.verityMidToken ,CompanyController.createByCompany);
router.post('/edit',functionAuth.verityMidToken , CompanyController.editByCompany);
router.post('/view',functionAuth.verityMidToken , CompanyController.datalist);
router.post('/delete',functionAuth.verityMidToken , CompanyController.deleteByCompany);
router.post('/main', functionAuth.verityMidToken , CompanyController.mainByCompany);
router.post('/status',functionAuth.verityMidToken , CompanyController.StatusCompany);
// router.post('/viewbyticket', CompanyController.ViewByTicket);
router.post('/count',functionAuth.verityMidToken , CompanyController.countContact);
router.post('/listname',functionAuth.verityMidToken , CompanyController.listName);
router.post('/dataedit',functionAuth.verityMidToken , CompanyController.dataEditCompany);
module.exports = router;
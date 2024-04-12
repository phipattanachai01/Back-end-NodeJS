const express = require('express');
const router = express.Router();
const IssueController = require('../controllers/IssueController');

router.post('/main', IssueController.MainIssue);
router.post('/add',IssueController.AddIssue);
router.post('/update',IssueController.UpdateIssue);
router.post('/delete',IssueController.DeleteIssue);
router.post('/priority',IssueController.ListPriority);
router.post('/types-date',IssueController.ListTypesDate);
router.post('/check-issuename',IssueController.CheckIssueName);


module.exports = router;
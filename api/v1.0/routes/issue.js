const express = require('express');
const router = express.Router();
const IssueController = require('../controllers/IssueController');
const functionAuth = require('../middleware/functionAuth');

router.post('/main', functionAuth.verityMidToken, IssueController.MainIssue);
router.post('/add', functionAuth.verityMidToken,IssueController.AddIssue);
router.post('/update', functionAuth.verityMidToken,IssueController.UpdateIssue);
router.post('/delete', functionAuth.verityMidToken,IssueController.DeleteIssue);
router.post('/priority', functionAuth.verityMidToken,IssueController.ListPriority);
router.post('/types-date', functionAuth.verityMidToken,IssueController.ListTypesDate);
router.post('/check-issuename', functionAuth.verityMidToken,IssueController.CheckIssueName);
router.post('/data-edit', functionAuth.verityMidToken,IssueController.dataEdit);

module.exports = router;
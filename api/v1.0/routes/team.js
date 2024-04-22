const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/TeamController');

router.post('/main', TeamController.MainTeamUser);
router.post('/addteam',TeamController.AddTeamUser);
router.post('/editteam', TeamController.EditTeamUser);
router.post('/delete', TeamController.DeleteTeamUser);
router.post('/check-team', TeamController.checkTeam);
router.post('/data-edit', TeamController.dataEdit);

module.exports = router;

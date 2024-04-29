const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/TeamController');
const functionAuth = require('../middleware/functionAuth');

router.post('/main',functionAuth.verityMidToken, TeamController.MainTeamUser);
router.post('/addteam',functionAuth.verityMidToken,TeamController.AddTeamUser);
router.post('/edit',functionAuth.verityMidToken, TeamController.EditTeamUser);
router.post('/delete',functionAuth.verityMidToken, TeamController.DeleteTeamUser);
router.post('/check-team',functionAuth.verityMidToken, TeamController.checkTeam);
router.post('/data-edit',functionAuth.verityMidToken, TeamController.dataEdit);

module.exports = router;

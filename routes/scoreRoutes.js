const express = require('express');
const scoreController = require('./../controllers/scoreController');

const router = express.Router();

router
  .route('/:id')
  .get(scoreController.getScoresForUser)

router
  .route('/')
  .get(scoreController.getLeaderboard)
  .post(scoreController.createNewPlayer);


router.route('/updateUser').post(scoreController.updateUser);
//   .delete(userController.deleteUser);

module.exports = router;

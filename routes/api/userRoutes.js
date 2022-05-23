const router = require('express').Router();
const {
    getUsers, getSingleUser,
} = require('../../controllers/userController');

// /api/users/
router.route('/').get(getUsers);

router.route('/:id').get(getSingleUser);

module.exports = router;
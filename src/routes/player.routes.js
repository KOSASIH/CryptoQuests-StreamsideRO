const express = require('express')
const playerController = require('../controllers/player.controller')

const router = express.Router()

router.post('/', playerController.createPlayerController)
router.post('/verify', playerController.verifyPlayerController)

module.exports = router

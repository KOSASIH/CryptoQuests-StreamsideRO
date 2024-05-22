const Player = require('../models/player')
const { generateHash } = require('../utils/crypto')
const {
  createPlayer,
  verifyPlayer
} = require('../integration/streamside-integration')

const createPlayerController = async (req, res) => {
  const { username, password } = req.body

  // Verify that the username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    })
  }

  // Verify that the username is unique
  const existingPlayer = await Player.findOne({ where: { username } })
  if (existingPlayer) {
    return res.status(400).json({
      message: 'Username is already taken'
    })
  }

  // Create a new player in Streamside Ragnarok Online
  const streamsidePlayer = await createPlayer(username, password)

  // Hash the password
  const hashedPassword = generateHash(password)

  // Create a new player in the local database
  const newPlayer = await Player.create({
    username,
    password: hashedPassword
  })

  // Return the new player
  res.status(201).json(newPlayer)
}

const verifyPlayerController = async (req, res) => {
  const { username, password } = req.body

  // Verify that the username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    })
  }

  // Verify that the player exists in Streamside Ragnarok Online
  const streamsidePlayer = await verifyPlayer(username, password)

  // Verify that the player exists in the local database
  const localPlayer = await Player.findOne({ where: { username } })
  if (!localPlayer) {
    return res.status(404).json({
      message: 'Player not found'
    })
  }

  // Return the local player
  res.json(localPlayer)
}

module.exports = {
  createPlayerController,
  verifyPlayerController
}

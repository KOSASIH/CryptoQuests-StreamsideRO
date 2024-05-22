const express = require('express');
const Quest = require('../models/quest');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const quests = await Quest.find({});
    res.json(quests);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, rewards } = req.body;
    const newQuest = new Quest({ title, description, rewards });
    await newQuest.save();
    res.status(201).json({ message: 'Quest created successfully', quest: newQuest });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    if (!quest) return res.status(404).json({ error: 'Quest not found' });
    res.json(quest);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedQuest = await Quest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedQuest) return res.status(404).json({ error: 'Quest not found' });
    res.json({ message: 'Quest updated successfully', quest: updatedQuest });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedQuest = await Quest.findByIdAndDelete(req.params.id);
    if (!deletedQuest) return res.status(404).json({ error: 'Quest not found' });
    res.json({ message: 'Quest deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;

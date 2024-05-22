const Quest = require('../models/quest');

exports.createQuest = async (req, res) => {
  try {
    const { title, description, rewards } = req.body;
    const quest = new Quest({ title, description, rewards });
    await quest.save();
    res.status(201).json({ message: 'Quest created successfully', quest });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.getQuests = async (req, res) => {
  try {
    const quests = await Quest.find({});
    res.json({ quests });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.getQuest = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }
    res.json({ quest });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.updateQuest = async (req, res) => {
  try {
    const quest = await Quest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }
    res.json({ message: 'Quest updated successfully', quest });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.deleteQuest = async (req, res) => {
  try {
    const quest = await Quest.findByIdAndDelete(req.params.id);
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }
    res.json({ message: 'Quest deleted successfully' });} catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

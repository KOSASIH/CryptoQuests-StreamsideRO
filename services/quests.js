const Quest = require('../models/quest');

const getAllQuests = async () => {
  const quests = await Quest.find({});
  return quests;
};

const createQuest = async (title, description, rewards) => {
  const newQuest = new Quest({ title, description, rewards });
  await newQuest.save();
  return { message: 'Quest created successfully', quest: newQuest };
};

const getQuestById = async (id) => {
  const quest = await Quest.findById(id);
  if (!quest) throw new Error('Quest not found');
  return quest;
};

const updateQuest = async (id, updates) => {
  const updatedQuest = await Quest.findByIdAndUpdate(id, updates, { new: true });
  if (!updatedQuest) throw new Error('Quest not found');
  return { message: 'Quest updated successfully', quest: updatedQuest };
};

const deleteQuest = async (id) => {
  const deletedQuest = await Quest.findByIdAndDelete(id);
  if (!deletedQuest) throw new Error('Quest not found');
  return { message: 'Quest deleted successfully' };
};

module.exports = { getAllQuests, createQuest, getQuestById, updateQuest, deleteQuest };

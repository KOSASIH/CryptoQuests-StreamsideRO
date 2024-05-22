const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { handleError, handleValidationError, handleCastError } = require('./utils/errors');
const { signToken, verifyToken } = require('./utils/jwt');
const auth = require('./services/auth');
const quests = require('./services/quests');
const { validate } = require('./validation');
const { cache, cacheMiddleware } = require('./cache');
const { realtime } = require('./realtime');
const { machineLearning } = require('./machineLearning');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/register', async (req, res, next) => {
  try {
    const { error } = validate(req.body, auth.registerSchema);
    if (error) return next(new HttpError(400, error.message));
    const { email, password } = req.body;
    const result = await auth.register(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const { error } = validate(req.body, auth.loginSchema);
    if (error) return next(new HttpError(400, error.message));
    const { email, password } = req.body;
    const result = await auth.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.get('/quests', cacheMiddleware, async (req, res, next) => {
  try {
    const result = await quests.getAllQuests();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.post('/quests', async (req, res, next) => {
  try {
    const { error } = validate(req.body, quests.createSchema);
    if (error) return next(new HttpError(400, error.message));
    const { title, description, rewards } = req.body;
    const result = await quests.createQuest(title, description, rewards);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.get('/quests/:id', cacheMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await quests.getQuestById(id);
    res.json(result);
  } catch (err) {
    if (err.name === 'CastError') return next(handleCastError());
    next(err);
  }
});

app.put('/quests/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { error } = validate(updates, quests.updateSchema);
    if (error) return next(new HttpError(400, error.message));
    const result = await quests.updateQuest(id, updates);
    res.json(result);
  } catch (err) {
    if (err.name === 'CastError') return next(handleCastError());
    next(err);
  }
});

app.delete('/quests/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await quests.deleteQuest(id);
    res.json(result);
  } catch (err) {
    if (err.name === 'CastError') return next(handleCastError());
    next(err);
  }
});

app.use(realtime);
app.use(machineLearning);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

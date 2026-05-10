const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const { taskValidation } = require('../middleware/validators');

const router = express.Router();

// Get all tasks for logged in user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { status, sort = '-createdAt', limit = 100, page = 1 } = req.query;
    
    const query = { userId: req.user.userId };
    if (status && ['pending', 'completed'].includes(status)) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const tasks = await Task.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create task
router.post('/', authMiddleware, taskValidation, async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const task = new Task({
      userId: req.user.userId,
      title,
      description: description || '',
      status: 'pending'
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// Update task
router.put('/:id', authMiddleware, taskValidation, async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;

    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Toggle task status
router.patch('/:id/toggle', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();
    
    res.json(task);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// Made with Bob

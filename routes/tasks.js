const express = require("express");
const router = express.Router();
const taskService = require("../services/taskService");
const { validateBody } = require("../middleware/validate");
const validateId = require("../middleware/validateId");
const logger = require("../logger");
const Joi = require("joi");

// Priorità possibili
const priorities = ["bassa", "media", "alta"];

// Schemi Joi
const createSchema = Joi.object({
  title: Joi.string().min(3).required(),
  completed: Joi.boolean().optional(),
  priority: Joi.string()
    .valid(...priorities)
    .optional(),
});

const updateSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  completed: Joi.boolean().optional(),
  priority: Joi.string()
    .valid(...priorities)
    .optional(),
}).min(1);

// POST /api/tasks
router.post("/", validateBody(createSchema), async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body);
    logger.info("Task creato", { id: task._id, title: task.title });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks
router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.completed !== undefined)
      filter.completed = req.query.completed === "true";
    const tasks = await taskService.getAllTasks(filter);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/completed
router.get("/completed", async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks({ completed: true });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tasks/:id
router.patch(
  "/:id",
  validateId,
  validateBody(updateSchema),
  async (req, res, next) => {
    try {
      const updated = await taskService.updateTask(req.params.id, req.body);
      if (!updated)
        return res.status(404).json({ message: "Task non trovato" });
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/tasks/:id
router.delete("/:id", validateId, async (req, res, next) => {
  try {
    const deleted = await taskService.deleteTask(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task non trovato" });

    logger.warn("Task eliminato", { id: deleted._id, title: deleted.title });
    res.status(200).json({ message: "Task eliminato", id: deleted._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const Task = require("../models/task");

async function createTask(data) {
  const task = new Task(data);
  return await task.save();
}

async function getAllTasks(filter = {}) {
  return await Task.find(filter).sort({ createdAt: -1 }).exec();
}

async function getTaskById(id) {
  return await Task.findById(id).exec();
}

async function updateTask(id, update) {
  return await Task.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).exec();
}

async function deleteTask(id) {
  return await Task.findByIdAndDelete(id).exec();
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};

//Contiene la logica applicativa
//Tutte le operazioni DB rimanendo asincrone e centralizzate

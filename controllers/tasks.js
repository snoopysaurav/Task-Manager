import { taskModel } from "../models/task.js";
import { asyncWrapper } from "../middleware/async.js";
import { createCustomError } from "../errors/custom.error.js";

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await taskModel.find({});
  res.status(200).json({ tasks });
});

const createTask = asyncWrapper(async (req, res) => {
  const task = await taskModel.create(req.body);
  res.status(201).json({ task });
});

const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await taskModel.findOne({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No Task with id: ${taskID}`, 404));
  }
  res.status(200).json({ task });
});

const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await taskModel.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return next(createCustomError(`No Task with id: ${taskID}`, 404));
  }
  res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await taskModel.findOneAndDelete({ _id: taskID });
  if (!task) {
    return next(createCustomError(`No Task with id: ${taskID}`, 404));
  }
  res.status(200).json({ task });
});

export { getAllTasks, getTask, createTask, updateTask, deleteTask };

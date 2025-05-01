const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const query = { user: req.user._id };
  if (req.query.completed) query.completed = req.query.completed === "true";
  if (req.query.search) query.title = new RegExp(req.query.search, "i");

  const tasks = await Task.find(query).sort({ dueDate: 1 });
  res.json(tasks);
};

exports.getTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, user: req.user._id });
  res.status(204).end();
};

exports.getAnalytics = async (req, res) => {
  const userId = req.user._id;

  const priorityDistribution = await Task.aggregate([
    { $match: { user: userId } },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  const completionOverTime = await Task.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
        completed: { $sum: { $cond: ["$completed", 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const upcomingTasks = await Task.find({
    user: userId,
    dueDate: { $gte: new Date() },
    completed: false,
  }).sort({ dueDate: 1 });

  res.json({ priorityDistribution, completionOverTime, upcomingTasks });
};

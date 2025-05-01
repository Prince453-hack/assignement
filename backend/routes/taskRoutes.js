const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getAnalytics,
} = require("../controllers/taskController");

router.use(protect);

router.route("/").post(createTask).get(getTasks);

router.route("/analytics").get(getAnalytics);

router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;

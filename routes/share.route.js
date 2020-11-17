const boardModel = require("../models/board.model");
const taskModel = require("../models/task.model");
const router = require("express").Router();
const helpers = require("../helpers/helpers");
const jwt = require("jsonwebtoken");

//get task list from board
router.get("/:shareToken", async (req, res) => {
  const dat = jwt.verify(req.params.shareToken, "secret");
  if (dat) {
    const list = await taskModel.loadAllByBoard(dat.boardId);
    res.json({
      code: 0,
      data: {
        list,
      },
    });
  } else {
    res.json({
      code: 1,
      message: "Fail!",
    });
  }
});

//add task
router.post("/add/:shareToken", async (req, res) => {
  const dat = jwt.verify(req.params.shareToken, "secret");
  if (dat) {
    taskModel
      .add(dat.boardId, req.body.name, req.body.column_name)
      .then((response) => {
        res.json({
          code: 0,
          data: {
            id: response.insertId,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          code: 1,
          data: {
            message: "Fail to add task!",
          },
        });
      });
  }
});

//update task
router.post("/patch/:shareToken", async (req, res) => {
  const entity = {
    id: req.body.id,
    name: req.body.name,
    column_name: req.body.column_name,
  };
  console.log(entity);
  taskModel
    .update(entity)
    .then((response) => {
      console.log(response);
      res.json({
        code: 0,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        code: 1,
        data: {
          message: "Fail to update task!",
        },
      });
    });
});

//delete task
router.delete("/task/:shareToken", async (req, res) => {
  console.log(req.body);
  await taskModel
    .delete(req.body.id)
    .then((response) => {
      console.log(response);
      res.json({
        code: 0,
        data: {},
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        code: 1,
        data: {
          message: "Fail to delete task!",
        },
      });
    });
});

module.exports = router;

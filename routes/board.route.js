const boardModel = require("../models/board.model");
const taskModel = require("../models/task.model");
const router = require("express").Router();
const helpers = require('../helpers/helpers');
const jwt = require('jsonwebtoken');

//get board
router.get("/", async (req, res) => {
  const userId = helpers.getIdFromToken(req.session.token);
  const list = await boardModel.loadAllByUser(userId);
  res.json({
    code: 0,
    data: {
      boards: list,
    },
  });
});

//get share board token
router.get("/share/:id", async (req, res) => {
  const boardId = req.params.id;
  const userId = helpers.getIdFromToken(req.session.token);
  const shareToken = jwt.sign({userId, boardId}, 'secret');
  res.json({
    code: 0,
    data: {
      shareToken
    }
  })
});

//get task list from board
router.get("/:id", async (req, res) => {
  const list = await taskModel.loadAllByBoard(req.params.id);
  res.json({
    code: 0,
    data: {
      list,
    },
  });
});

//add task
router.post("/add/:id", async (req, res) => {
  taskModel
    .add(req.params.id, req.body.name, req.body.column_name)
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
});

//update task
router.post("/patch/:id", async (req, res) => {
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
router.post("/delete", async (req, res) => {
  console.log(req.body);
  taskModel
    .delete(req.body.id)
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
          message: "Fail to delete task!",
        },
      });
    });
});

//add new board
router.post("/", async (req, res) => {
  const userId = helpers.getIdFromToken(req.session.token);
  boardModel
    .addByUser(userId, req.body.name)
    .then((response) => {
      console.log(response);
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
          message: "Fail to add board!",
        },
      });
    });
});

//update board
router.put("/", async (req, res) => {
  const { id, name } = req.body;
  const userId = helpers.getIdFromToken(req.session.token);
  console.log(req.body);
  await boardModel
    .edit(userId, id, name)
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
          message: "Fail to edit board!",
        },
      });
    });
});

//delete board
router.delete("/", async (req, res) => {
  console.log(req.body);
  await boardModel
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
          message: "Fail to delete board!",
        },
      });
    });
});

//delete task
router.delete("/task", async (req, res) => {
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

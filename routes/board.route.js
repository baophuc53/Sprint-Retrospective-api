const boardModel = require("../models/board.model");
const taskModel = require("../models/task.model");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const userId = req.session.userId;
  console.log(userId);
  const list = await boardModel.loadAllByUser(userId);
  res.json({
    code: 0,
    data: {
      boards: list,
    },
  });
});

router.get("/:id", async (req, res) => {
  const list = await taskModel.loadAllByBoard(req.params.id);
  res.json({
    code: 0,
    data: {
      list,
    },
  });
});

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

router.post("/", async (req, res) => {
  const userId = req.session.userId;
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

router.put("/", async (req, res) => {
  const { id, name } = req.body;
  console.log(req.body);
  await boardModel
    .edit(req.session.userId, id, name)
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

module.exports = router;

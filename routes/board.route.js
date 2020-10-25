const boardModel = require("../models/board.model");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const userId = req.session.userId;
  const list = await boardModel.loadAllByUser(userId);
  res.json({
    code: 0,
    data: {
      boards: list,
    },
  });
});

router.post("/", async (req, res) => {
    
    const userId = req.session.userId;
    boardModel.addByUser(userId, req.body.name).then(response => {
        console.log(response);
        res.json({
            code: 0,
            data: {
                id: response.insertId
            }
        })
    }).catch(err => {
        console.log(err);
        res.json({
          code: 1,
          data: {
              message: "ok"
          }
      })
    });
  })

module.exports = router;
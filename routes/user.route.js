const userModel = require("../models/user.model");
const router = require("express").Router();
const md5 = require("md5");

router.post("/", async (req, res) => {
  const {username, password} = req.body;
  const dat = await userModel.load(username);
  if (dat&&md5(password) === dat.password) {
    req.session.userId = dat.id;
    console.log(req.session);
    res.json({
      code: 0,
      data: {
        userId: dat.id
      },
    });
  } else {
    res.json({
      code: 1,
      data: {}
    })
  }
});

router.post("/add", async (req, res) => {
  const entity = req.body;
  console.log(entity);
  entity.password = md5(entity.password);
  await userModel.add(entity).then((response) =>{
    res.json({
      code: 0,
      data: {
        id: response.insertId
      }
    })
  }).catch((err) =>{
    console.log(err);
      res.json({
        code: 1,
        data: {
          message: "Fail to add task!",
        },
      });
  })
})


router.get("/", async (req, res) => {
    await userModel.update({
      id: 8,
      password: md5('aaaa')
    }).then((response) => {
      console.log(response);
      res.json({
        code: 0
      })
    })
})

module.exports = router;

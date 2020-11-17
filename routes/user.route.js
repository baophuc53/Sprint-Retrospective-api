const userModel = require("../models/user.model");
const router = require("express").Router();
const md5 = require("md5");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const helpers = require("../helpers/helpers");

const restrict = (req, res, next) => {
  const token = req.session.token;
  if (
    req.headers.authorization &&
    req.headers.authorization.replace("Bearer ", "") === token
  ) {
    console.log("ok fine");
    next();
  } else {
    res.json({
      code: 1,
      message: "Authorize fail!",
    });
  }
};

//login
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const dat = await userModel.load(username);
  if (dat && md5(password) === dat.password) {
    const token = jwt.sign({ id: dat.id, username }, "secret");
    req.session.token = token;
    console.log(req.session);
    res.json({
      code: 0,
      data: {
        userName: dat.name,
        token,
      },
    });
  } else {
    res.json({
      code: 1,
      data: {},
    });
  }
});

//login google/fb
router.post("/other", async (req, res) => {
  console.log(req.body);
  const { id, username, name, token } = req.body;
  const user = await userModel.load(username);
  let jwtToken = "";
  if (user) {
    console.log("co luu roi");
    jwtToken = jwt.sign(
      { id: user.id, username: user.username },
      "secret"
    );
    req.session.token = jwtToken;
    console.log(req.session);
  } else {
    await userModel
      .add({
        name,
        username,
        password: token,
      })
      .then((response) => {
        jwtToken = jwt.sign(
          { id: response.insertId, username },
          "secret"
        );
        req.session.token = jwtToken;
      });
  }
  res.json({
    code: 0,
    data: {
      token: jwtToken,
    },
  });
});

//register
router.post("/add", async (req, res) => {
  const entity = req.body;
  console.log(entity);
  entity.password = md5(entity.password);
  await userModel
    .add(entity)
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
          message: "Fail to add user!",
        },
      });
    });
});

//change name
router.post("/patch", restrict, async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const userId = helpers.getIdFromToken(req.session.token);
  const entity = {
    id: userId,
    name,
  };
  await userModel
    .update(entity)
    .then((response) => {
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
          message: "Fail to update user!",
        },
      });
    });
});

//change pass
router.post("/change-pass", restrict, async (req, res) => {
  console.log(req.body);
  const { password, newPassword } = req.body;
  const userId = helpers.getIdFromToken(req.session.token);
  const user = await userModel.loadById(userId);
  if (md5(password) !== user.password)
    return res.json({
      code: 1,
      message: "Wrong old password!",
    });
  user.password = md5(newPassword);
  await userModel
    .update(user)
    .then((response) => {
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
          message: "Fail to update user!",
        },
      });
    });
});

//get user name
router.get("/", restrict, async (req, res) => {
  const id = helpers.getIdFromToken(req.session.token);
  const user = await userModel.loadById(id).catch((err) => {
    console.log(err);
    res.json({
      code: 1,
      data: {
        message: "Fail to get user!",
      },
    });
  });
  console.log(user);
  res.json({
    code: 0,
    data: {
      id: user.id,
      name: user.name,
      username: user.username,
    },
  });
});

module.exports = router;

const boardRoute = require("../routes/board.route");
const userRoute = require("../routes/user.route");
const shareRoute = require("../routes/share.route");

const restrict = (req, res, next) => {
  console.log(req.session);
  const token = req.session.token;
  if (
    req.headers.authorization &&
    req.headers.authorization.replace("Bearer ", "") === token
  ) {
    next();
  } else {
    res.json({
      code: 1,
      message: "Authorize fail!",
    });
  }
};
module.exports = (app) => {
  app.use("/user", userRoute);
  app.use("/board", restrict, boardRoute);
  app.use("/share-board", restrict, shareRoute);
};

const boardRoute = require("../routes/board.route");
const userRoute = require("../routes/user.route");

module.exports = (app) => {
  app.use("/user", userRoute);
  app.use(
    "/board",
    (req, res, next) => {
        console.log(req.session);
      if (typeof req.session.userId === "undefined" || req.session.userId===null) {
        return res.json({
          code: 1,
          message: "Need login",
        });
      }
      next();
    },
    boardRoute
  );
};

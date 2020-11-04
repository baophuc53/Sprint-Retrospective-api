const boardRoute = require("../routes/board.route");
const userRoute = require("../routes/user.route");

module.exports = (app) => {
  // app.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Credentials", true);
  //   res.header("Access-Control-Allow-Origin", req.headers.origin);
  //   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  //   );
  //   next();
  // });
  app.use("/user", userRoute);
  app.use(
    "/board",
    (req, res, next) => {
      console.log(req.session);
      if (
        typeof req.session.userId === "undefined" ||
        req.session.userId === null
      ) {
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

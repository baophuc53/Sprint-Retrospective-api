const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
const mdw = require("./middlewares/route.mdw");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(session({secret: "0"}));
mdw(app);

app.listen(process.env.PORT || 8000, () => {
    console.log('Web server running at http://localhost:8000');
})

module.exports = app;

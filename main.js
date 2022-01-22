const express = require("express");
const usersRouter = require("./routers/usersRouter");
const tradeCenterRouter = require("./routers/tradeCenterRouter");

const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./configs/database");

app.use("/api/users", usersRouter);
app.use("/api/tradeCenter", tradeCenterRouter);

app.listen(8000);

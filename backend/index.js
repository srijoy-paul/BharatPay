const express = require("express");
const rootRouter = require("./routes/index")


const app = express();

require("./db");

app.use("/api/v1", rootRouter)




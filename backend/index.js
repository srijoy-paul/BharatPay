const express = require("express");
const cors = require("cors");

const rootRouter = require("./routes/index")



const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB and initialize schemas and models
require("./db");

// Version 1 Routes goes here
app.use("/api/v1", rootRouter)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("server is running on port 3000")
})




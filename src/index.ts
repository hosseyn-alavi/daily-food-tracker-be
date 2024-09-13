import express from "express";
import bodyParser from "body-parser";
const path = require("node:path");
import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import {sequelize} from "./database";
import usersRouter from "./routes/user";
import foodsRouter from "./routes/food";
import recordsRouter from "./routes/record";

const app = express();
const port = process.env.PORT ?? 3010;

sequelize
    .sync()
    .then(() => {
        console.log("Database sync successful.");
    })
    .catch((error) => {
        console.error("Error syncing database:", error);
    });

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../front-end/build")));

app.use("/api", usersRouter);
app.use("/api/foods", foodsRouter);
app.use("/api/records", recordsRouter);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

interface User {
    id: number;
    username: string;
    password: string;
    dailyGoal?: number
}

interface Record {
    foodId: number;
    amount: number;
}

interface Food {
    id: number;
    name: string;
    caloriesPer100g: number;
}

interface TokenValues {
    user:{
        username: string
    userId: number
    dailyGoal?: number
    }
}

const app = express();
const port = process.env.PORT || 3010;
const secretKey = process.env.SECRET_KEY || "";

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "fe-build")));

// Login endpoint
app.post(
    "/api/login",
    (req: Request<undefined, undefined, User>, res: Response) => {
        const filePath = path.join(__dirname, "data", `users.json`);

        fs.readFile(filePath, "utf8", (err, data) => {
            const users: User[] = JSON.parse(data);

            const user = users.find(
                (u) =>
                    u.username === req.body.username &&
                    u.password === req.body.password
            );
            if (user) {
                // Generate JWT token
                const token = jwt.sign(
                    {username: req.body.username, userId: user.id, dailyGoal: user.dailyGoal ?? 0},
                    secretKey,
                    {
                        expiresIn: "7d",
                    }
                );

                res.json({token});
            } else {
                res.status(401).json({error: "Invalid credentials"});
            }
        });
    }
);

// Middleware to authenticate JWT token
function authenticateToken(
    req: Request & {user},
    res: Response,
    next: () => void
) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
}

// Get daily record with date and food name (id) and amount
app.get("/api/records/:date", authenticateToken, (req:Request & TokenValues, res) => {
    const {date} = req.params;
    const filePath = path.join(__dirname, "data", "records", `${req.user.userId}`, `${date}.json`);

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(404).json({error: "Record not found"});
        }

        const records = JSON.parse(data);
        res.json({records, dailyGoal:req.user.dailyGoal});
    });
});

// Get food name and calorie per 100gr
app.get("/api/foods/:id", authenticateToken, (req, res) => {
    const {id} = req.params;
    const filePath = path.join(__dirname, "data", "foods.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({error: "Internal server error"});
        }

        const foods = JSON.parse(data);
        const food = foods.find((f: Food) => f.id === Number(id));

        if (food) {
            res.json(food);
        } else {
            res.status(404).json({error: "Food not found"});
        }
    });
});

// Get food name and calorie per 100gr
app.get("/api/foods", authenticateToken, (req, res) => {
    const {id} = req.params;
    const filePath = path.join(__dirname, "data", "foods.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({error: "Internal server error"});
        }

        const foods = JSON.parse(data);
        //  const food = foods.find((f) => f.id === id);

        if (foods) {
            res.json(foods);
        } else {
            res.status(404).json({error: "Food not found"});
        }
    });
});

// Get the list of daily records populated with foods JSON file
app.get("/api/records", authenticateToken, (req, res) => {
    const recordsDir = path.join(__dirname, "data", "records");
    const foodsFilePath = path.join(__dirname, "data", "foods.json");

    fs.readdir(recordsDir, (err, files) => {
        if (err) {
            return res.status(500).json({error: "Internal server error"});
        }

        const records: {}[] = [];

        files.forEach((file) => {
            const filePath = path.join(recordsDir, file);
            const recordData = fs.readFileSync(filePath, "utf8");
            const record = JSON.parse(recordData);

            const foodsData = fs.readFileSync(foodsFilePath, "utf8");
            const foods = JSON.parse(foodsData);

            const populatedRecord = {
                date: record.date,
                items: record.items.map((item: Record) => {
                    const food = foods.find((f: Food) => f.id === item.foodId);
                    return {...item, name: food ? food.name : ""};
                }),
            };

            records.push(populatedRecord);
        });

        res.json(records);
    });
});

// Add a new record
app.post(
    "/api/records/:date",
    authenticateToken,
    (req: Request & TokenValues, res) => {
        const {date} = req.params;
        const filePath = path.join(
            __dirname,
            "data",
            "records",
            `${req.user.userId}`,
            `${date}.json`
        );

        fs.readFile(filePath, "utf8", (err, data) => {
            const records: any[] = [];
            if (data) {
                records.push(...JSON.parse(data));
            }
            const newRecord = {...req.body};
            records.push(newRecord);
            fs.writeFile(filePath, JSON.stringify(records), "utf8", (err) => {
                if (err) {
                    return res
                        .status(500)
                        .json({error: "Failed to add record"});
                }

                res.json({message: "Record added successfully"});
            });
        });
    }
);

// Add a new food
app.post("/api/foods", authenticateToken, (req, res) => {
    const {id, name, caloriesPer100g} = req.body;
    const filePath = path.join(__dirname, "data", "foods.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({error: "Internal server error"});
        }

        const foods = JSON.parse(data);
        const newFood = {id, name, caloriesPer100g};
        foods.push(newFood);

        fs.writeFile(filePath, JSON.stringify(foods), "utf8", (err) => {
            if (err) {
                return res.status(500).json({error: "Failed to add food"});
            }

            res.json({message: "Food added successfully"});
        });
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "fe-build", "index.html"));
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

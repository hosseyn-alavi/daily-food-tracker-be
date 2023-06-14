import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import path from "path";
import * as dotenv from "dotenv";
import cors from "cors";

import {UserInstance, User} from "./models/User";
import {sequelize} from "./database";
import {FoodInstance, Food} from "./models/Food";
import {DailyRecord, DailyRecordInstance} from "./models/DailyRecord";

dotenv.config();

interface TokenValues {
    user: {
        username: string;
        userId: number;
        dailyGoal?: number;
    };
}

const app = express();
const port = process.env.PORT || 3010;
const secretKey = process.env.SECRET_KEY || "";

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

app.use(express.static(path.join(__dirname, "build")));

app.post(
    "/api/signup",
    async (
        req: Request<
            undefined,
            undefined,
            UserInstance & {securityToken: string}
        >,
        res: Response
    ) => {
        if (req.body.securityToken === process.env.SECURITY_SIGN_UP_TOKEN) {
            try {
                const user = await User.create(req.body);

                res.json({message: "user created successfully", user});
            } catch {
                res.status(500).json({error: "Something went wrong"});
            }
        } else {
            res.status(401).json({error: "Invalid token"});
        }
    }
);

// Login endpoint
app.post(
    "/api/login",
    async (req: Request<undefined, undefined, UserInstance>, res: Response) => {
        const user = await User.findOne({
            where: {
                username: req.body.username,
                password: req.body.password,
            },
        });

        if (user) {
            // Generate JWT token
            const token = jwt.sign(
                {
                    username: req.body.username,
                    userId: user.id,
                    dailyGoal: user.dailyGoal ?? 0,
                },
                secretKey,
                {
                    expiresIn: "7d",
                }
            );

            res.json({token});
        } else {
            res.status(401).json({error: "Invalid credentials"});
        }
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
app.get(
    "/api/records/:date",
    authenticateToken,
    async (req: Request & TokenValues, res) => {
        const {date} = req.params;
        try {
            const records = await DailyRecord.findAll({where: {date, userId:req.user.userId}});
            if (records) {
                res.json({records, dailyGoal: req.user.dailyGoal});
            }
        } catch {
            return res.status(500).json({error: "Internal server error"});
        }
    }
);

// // Get food name and calorie per 100gr
// app.get("/api/foods/:id", authenticateToken, (req, res) => {
//     const {id} = req.params;
//     const filePath = path.join(__dirname, "data", "foods.json");

//     fs.readFile(filePath, "utf8", (err, data) => {
//         if (err) {
//             return res.status(500).json({error: "Internal server error"});
//         }

//         const foods = JSON.parse(data);
//         const food = foods.find((f: FoodInstance) => f.id === Number(id));

//         if (food) {
//             res.json(food);
//         } else {
//             res.status(404).json({error: "Food not found"});
//         }
//     });
// });

// Get food name and calorie per 100gr
app.get("/api/foods", authenticateToken, async (req, res) => {
    try {
        const foods = await Food.findAll();
        if (foods) {
            res.json(foods);
        } else {
            res.status(404).json({error: "Food not found"});
        }
    } catch {
        res.status(500).json({error: "Internal server error"});
    }
});

// Add food
app.post(
    "/api/foods",
    authenticateToken,
    async (req: Request<undefined, undefined, FoodInstance>, res) => {
        try {
            const food = await Food.create(req.body);
            if (food) {
                res.json(food);
            }
        } catch {
            res.status(500).json({error: "Internal server error"});
        }
    }
);



// Add a new record
app.post(
    "/api/records/:date",
    authenticateToken,
    async (
        req: Request<{date: string}, undefined, DailyRecordInstance> &
            TokenValues,
        res
    ) => {
        try {
            const {date} = req.params;
            const record = await DailyRecord.create({
                ...req.body,
                userId: req.user.userId,
                date,
            });
            if (record) {
                res.json({message: "Record added successfully", record});
            }
        } catch {
            res.status(500).json({error: "Failed to add record"});
        }
    }
);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

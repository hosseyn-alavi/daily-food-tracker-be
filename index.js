"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var body_parser_1 = __importDefault(require("body-parser"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var dotenv = __importStar(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
dotenv.config();
var app = (0, express_1.default)();
var port = process.env.PORT || 3010;
var secretKey = process.env.SECRET_KEY || "";
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "build")));
// Login endpoint
app.post("/api/login", function (req, res) {
    var filePath = path_1.default.join(__dirname, "data", "users.json");
    fs_1.default.readFile(filePath, "utf8", function (err, data) {
        var _a;
        var users = JSON.parse(data);
        var user = users.find(function (u) {
            return u.username === req.body.username &&
                u.password === req.body.password;
        });
        if (user) {
            // Generate JWT token
            var token = jsonwebtoken_1.default.sign({ username: req.body.username, userId: user.id, dailyGoal: (_a = user.dailyGoal) !== null && _a !== void 0 ? _a : 0 }, secretKey, {
                expiresIn: "7d",
            });
            res.json({ token: token });
        }
        else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});
// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    var authHeader = req.headers["authorization"];
    var token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, secretKey, function (err, user) {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}
// Get daily record with date and food name (id) and amount
app.get("/api/records/:date", authenticateToken, function (req, res) {
    var date = req.params.date;
    var filePath = path_1.default.join(__dirname, "data", "records", "".concat(req.user.userId), "".concat(date, ".json"));
    fs_1.default.readFile(filePath, "utf8", function (err, data) {
        if (err) {
            return res.status(404).json({ error: "Record not found" });
        }
        var records = JSON.parse(data);
        res.json({ records: records, dailyGoal: req.user.dailyGoal });
    });
});
// Get food name and calorie per 100gr
app.get("/api/foods/:id", authenticateToken, function (req, res) {
    var id = req.params.id;
    var filePath = path_1.default.join(__dirname, "data", "foods.json");
    fs_1.default.readFile(filePath, "utf8", function (err, data) {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        var foods = JSON.parse(data);
        var food = foods.find(function (f) { return f.id === Number(id); });
        if (food) {
            res.json(food);
        }
        else {
            res.status(404).json({ error: "Food not found" });
        }
    });
});
// Get food name and calorie per 100gr
app.get("/api/foods", authenticateToken, function (req, res) {
    var id = req.params.id;
    var filePath = path_1.default.join(__dirname, "data", "foods.json");
    fs_1.default.readFile(filePath, "utf8", function (err, data) {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        var foods = JSON.parse(data);
        //  const food = foods.find((f) => f.id === id);
        if (foods) {
            res.json(foods);
        }
        else {
            res.status(404).json({ error: "Food not found" });
        }
    });
});
// Get the list of daily records populated with foods JSON file
app.get("/api/records", authenticateToken, function (req, res) {
    var recordsDir = path_1.default.join(__dirname, "data", "records");
    var foodsFilePath = path_1.default.join(__dirname, "data", "foods.json");
    fs_1.default.readdir(recordsDir, function (err, files) {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        var records = [];
        files.forEach(function (file) {
            var filePath = path_1.default.join(recordsDir, file);
            var recordData = fs_1.default.readFileSync(filePath, "utf8");
            var record = JSON.parse(recordData);
            var foodsData = fs_1.default.readFileSync(foodsFilePath, "utf8");
            var foods = JSON.parse(foodsData);
            var populatedRecord = {
                date: record.date,
                items: record.items.map(function (item) {
                    var food = foods.find(function (f) { return f.id === item.foodId; });
                    return __assign(__assign({}, item), { name: food ? food.name : "" });
                }),
            };
            records.push(populatedRecord);
        });
        res.json(records);
    });
});
// Add a new record
app.post("/api/records/:date", authenticateToken, function (req, res) {
    var date = req.params.date;
    var filePath = path_1.default.join(__dirname, "data", "records", "".concat(req.user.userId), "".concat(date, ".json"));
    fs_1.default.readFile(filePath, "utf8", function (err, data) {
        var records = [];
        if (data) {
            records.push.apply(records, JSON.parse(data));
        }
        var newRecord = __assign({}, req.body);
        records.push(newRecord);
        fs_1.default.writeFile(filePath, JSON.stringify(records), "utf8", function (err) {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "Failed to add record" });
            }
            res.json({ message: "Record added successfully" });
        });
    });
});
// Add a new food
app.post("/api/foods", authenticateToken, function (req, res) {
    var _a = req.body, id = _a.id, name = _a.name, caloriesPer100g = _a.caloriesPer100g;
    var filePath = path_1.default.join(__dirname, "data", "foods.json");
    fs_1.default.readFile(filePath, "utf8", function (err, data) {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        var foods = JSON.parse(data);
        var newFood = { id: id, name: name, caloriesPer100g: caloriesPer100g };
        foods.push(newFood);
        fs_1.default.writeFile(filePath, JSON.stringify(foods), "utf8", function (err) {
            if (err) {
                return res.status(500).json({ error: "Failed to add food" });
            }
            res.json({ message: "Food added successfully" });
        });
    });
});
app.get("*", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
});
// Start the server
app.listen(port, function () {
    console.log("Server running on http://localhost:".concat(port));
});

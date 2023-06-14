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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var body_parser_1 = __importDefault(require("body-parser"));
var path_1 = __importDefault(require("path"));
var dotenv = __importStar(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var User_1 = require("./models/User");
var database_1 = require("./database");
var Food_1 = require("./models/Food");
var DailyRecord_1 = require("./models/DailyRecord");
dotenv.config();
var app = (0, express_1.default)();
var port = process.env.PORT || 3010;
var secretKey = process.env.SECRET_KEY || "";
database_1.sequelize
    .sync()
    .then(function () {
    console.log("Database sync successful.");
})
    .catch(function (error) {
    console.error("Error syncing database:", error);
});
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "build")));
app.post("/api/signup", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(req.body.securityToken === process.env.SECURITY_SIGN_UP_TOKEN)) return [3 /*break*/, 5];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User_1.User.create(req.body)];
            case 2:
                user = _b.sent();
                res.json({ message: "user created successfully", user: user });
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                res.status(500).json({ error: "Something went wrong" });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(401).json({ error: "Invalid token" });
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
// Login endpoint
app.post("/api/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, User_1.User.findOne({
                    where: {
                        username: req.body.username,
                        password: req.body.password,
                    },
                })];
            case 1:
                user = _b.sent();
                if (user) {
                    token = jsonwebtoken_1.default.sign({
                        username: req.body.username,
                        userId: user.id,
                        dailyGoal: (_a = user.dailyGoal) !== null && _a !== void 0 ? _a : 0,
                    }, secretKey, {
                        expiresIn: "7d",
                    });
                    res.json({ token: token });
                }
                else {
                    res.status(401).json({ error: "Invalid credentials" });
                }
                return [2 /*return*/];
        }
    });
}); });
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
app.get("/api/records/:date", authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date, records, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                date = req.params.date;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, DailyRecord_1.DailyRecord.findAll({ where: { date: date, userId: req.user.userId } })];
            case 2:
                records = _b.sent();
                if (records) {
                    res.json({ records: records, dailyGoal: req.user.dailyGoal });
                }
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                return [2 /*return*/, res.status(500).json({ error: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
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
app.get("/api/foods", authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var foods, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Food_1.Food.findAll()];
            case 1:
                foods = _b.sent();
                if (foods) {
                    res.json(foods);
                }
                else {
                    res.status(404).json({ error: "Food not found" });
                }
                return [3 /*break*/, 3];
            case 2:
                _a = _b.sent();
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Add food
app.post("/api/foods", authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var food, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Food_1.Food.create(req.body)];
            case 1:
                food = _b.sent();
                if (food) {
                    res.json(food);
                }
                return [3 /*break*/, 3];
            case 2:
                _a = _b.sent();
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Add a new record
app.post("/api/records/:date", authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date, record, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                date = req.params.date;
                return [4 /*yield*/, DailyRecord_1.DailyRecord.create(__assign(__assign({}, req.body), { userId: req.user.userId, date: date }))];
            case 1:
                record = _b.sent();
                if (record) {
                    res.json({ message: "Record added successfully", record: record });
                }
                return [3 /*break*/, 3];
            case 2:
                _a = _b.sent();
                res.status(500).json({ error: "Failed to add record" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("*", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
});
// Start the server
app.listen(port, function () {
    console.log("Server running on http://localhost:".concat(port));
});

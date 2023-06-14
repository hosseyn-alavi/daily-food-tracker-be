"use strict";
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
var body_parser_1 = __importDefault(require("body-parser"));
var path_1 = __importDefault(require("path"));
var dotenv = __importStar(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var database_1 = require("./database");
var user_1 = __importDefault(require("./routes/user"));
var food_1 = __importDefault(require("./routes/food"));
var record_1 = __importDefault(require("./routes/record"));
dotenv.config();
var app = (0, express_1.default)();
var port = process.env.PORT || 3010;
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
app.use('/api', user_1.default);
app.use('/api/foods', food_1.default);
app.use('/api/records', record_1.default);
app.get("*", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
});
// Start the server
app.listen(port, function () {
    console.log("Server running on http://localhost:".concat(port));
});

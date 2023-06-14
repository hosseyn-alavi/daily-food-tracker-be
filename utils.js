"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    var authHeader = req.headers["authorization"];
    var token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, function (err, user) {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}
exports.authenticateToken = authenticateToken;

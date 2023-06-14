"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyRecord = void 0;
var sequelize_1 = require("sequelize");
var database_1 = require("../database");
var User_1 = require("./User");
exports.DailyRecord = database_1.sequelize.define("DailyRecord", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    caloriesPer100g: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    total: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
});
exports.DailyRecord.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });

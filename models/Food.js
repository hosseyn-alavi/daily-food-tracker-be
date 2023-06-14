"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Food = void 0;
var sequelize_1 = require("sequelize");
var database_1 = require("../database");
exports.Food = database_1.sequelize.define("Food", {
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
        allowNull: false,
    },
    defaultWeight: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
});

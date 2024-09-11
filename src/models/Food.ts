import {DataTypes, type Model, type Optional} from "sequelize";
import {sequelize} from "../database";

interface FoodAttributes {
    id: number;
    name: string;
    caloriesPer100g: number;
    defaultWeight?: number;
}

interface FoodCreationAttributes extends Optional<FoodAttributes, "id"> {}
export interface FoodInstance
    extends Model<FoodAttributes, FoodCreationAttributes>,
        FoodAttributes {}

export const Food = sequelize.define<FoodInstance>("Food", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    caloriesPer100g: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    defaultWeight: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

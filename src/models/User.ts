import {DataTypes, type Model, type Optional} from "sequelize";
import {sequelize} from "../database";

interface UserAttributes {
    id: number;
    username: string;
    password: string;
    email?: string;
    dailyGoal?: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export interface UserInstance
    extends Model<UserAttributes, UserCreationAttributes>,
        UserAttributes {}

export const User = sequelize.define<UserInstance>("User", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dailyGoal: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

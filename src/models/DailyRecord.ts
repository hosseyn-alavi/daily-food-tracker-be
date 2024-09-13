import {DataTypes, type Model, type Optional} from "sequelize";
import {sequelize} from "../database";
import {User} from "./User";

interface DailyRecordAttributes {
    id: number;
    name: string;
    caloriesPer100g: number;
    amount: number;
    total: number;
    userId: number;
    date: string;
}

interface DailyRecordCreationAttributes
    extends Optional<DailyRecordAttributes, "id"> {}
export interface DailyRecordInstance
    extends Model<DailyRecordAttributes, DailyRecordCreationAttributes>,
        DailyRecordAttributes {}

export const DailyRecord = sequelize.define<DailyRecordInstance>(
    "DailyRecord",
    {
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
            allowNull: true,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
);

DailyRecord.belongsTo(User, {foreignKey: "userId", as: "user"});

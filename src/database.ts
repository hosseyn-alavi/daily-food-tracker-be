import {Sequelize} from "sequelize";

export const sequelize = new Sequelize(process.env.DB_URI ?? "", {
    dialect: "postgres",
    logging: false, // Disable logging if you want
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // This option may be necessary for some SSL configurations
        },
    },
});

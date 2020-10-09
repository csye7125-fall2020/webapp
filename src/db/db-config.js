const Sequelize = require('sequelize');
const params = require("./db-params");

const sequelize = new Sequelize(params.DB, params.USER, params.PASSWORD, {
    host: params.HOST,
    dialect: params.DIALECT,
    operatorsAliases: false,
    pool: {
        max: params.POOL.max,
        min: params.POOL.min,
        acquire: params.POOL.acquire,
        idle: params.POOL.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../model/User")(sequelize, Sequelize);

module.exports = db;

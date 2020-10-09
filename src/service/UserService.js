"use strict";
const bcrypt = require("bcrypt");
const db = require("../db/db-config");
const constants = require("../constants");
const User = db.user;
const Op = db.Sequelize.Op;
const uuid = require('uuid');

exports.isUserExist = function (email) {
    return User.findAll({
        where: {
            email: email
        }
    });
}

exports.createUser = function (newUser) {
    newUser.id = uuid.v4();
    newUser.password = bcrypt.hashSync(newUser.password, constants.SALT_ROUNDS);
    const user = new User(newUser);
    return user.save();
}

exports.updateUser = function (user) {
    const hashPwd = bcrypt.hashSync(
        user.password,
        constants.SALT_ROUNDS
    );
    let updatedUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashPwd
    }
    return User.update(updatedUser, {
        where: {
            email: user.email
        }
    });
}

exports.getUserInfoById = function (id) {
    return User.findOne({
        where: {
            id: {
                [Op.eq]: id
            }
        }
    });
}

exports.getUserInfo = function (email, password) {

}

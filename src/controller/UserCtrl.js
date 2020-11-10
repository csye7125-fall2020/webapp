const constants = require("../constants");
const userService = require("../service/UserService");
const passwordValidator = require('password-validator');
const {validationResult} = require("express-validator/check");
const bcrypt = require("bcrypt");
const client = require('prom-client');

const createUserCounter = new client.Counter({
    name: 'count_create_user',
    help: 'The total number of create user api requests'
});

const getUserCounter = new client.Counter({
    name: 'count_get_user',
    help: 'The total number of get user api requests'
});

const updateUserCounter = new client.Counter({
    name: 'count_update_user',
    help: 'The total number of update user api requests'
});


const getEmail = function (auth) {
    const tmp = auth.split(' ');
    return new Buffer.from(tmp[1], 'base64').toString().split(':')[0];
}

const getPassword = function (auth) {
    const tmp = auth.split(' ');
    return new Buffer.from(tmp[1], 'base64').toString().split(':')[1];
}

function validatePassword(password) {
    const schema = new passwordValidator();
    schema
        .is().min(8)
        .is().max(20)
        .has().uppercase()
        .has().lowercase();

    return schema.validate(password);
}

exports.createUser = (req, res) => {
    createUserCounter.inc();
    try {
        const errors = validationResult(req);
        if (!req.body || req.body === "")
            return res.status(400).json({response: constants.BAD_REQUEST});
        if (validateRequestBody(req.body))
            return res.status(400).json({response: constants.BAD_REQUEST});
        if (!errors.isEmpty() || !validatePassword(req.body.password))
            return res.status(400).json({response: constants.BAD_REQUEST})

        userService
            .isUserExist(req.body.username)
            .then(data => {
                if (data.length)
                    return res.status(422).json({response: constants.USER_ALREADY_EXIST});
                const user = Object.assign({}, req.body);
                const resolve = (data) => {
                    res.status(201).json({
                        message: constants.USER_CREATION_SUCCESS,
                        user: {
                            id: data.id,
                            username: data.username,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            createdAt: data.createdAt,
                            updatedAt: data.updatedAt
                        }
                    });
                }
                userService
                    .createUser(user)
                    .then(resolve)
                    .catch(error => {
                        res.status(400).json({response: error.message});
                    });
            }).catch(error => res.status(400).json({response: error.message}));
    } catch (error) {
        res.status(400).json({response: error.message});
    }
}

function validateRequestBody(requestBody) {
    return requestBody.hasOwnProperty('id') || requestBody.hasOwnProperty('createdAt') || requestBody.hasOwnProperty('updatedAt');
}

exports.updateUser = (req, res) => {
    updateUserCounter.inc();
    try {
        const auth = req.headers['authorization'];
        if (!auth || getEmail(auth) === "" || getPassword(auth) === "")
            return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

        if (!req.body || Object.keys(req.body).length === 0)
            return res.status(400).json({response: constants.BAD_REQUEST});

        if (validateRequestBody(req.body)
            || req.body.hasOwnProperty('username')
            || (req.body.password && !validatePassword(req.body.password)))
            return res.status(400).json({response: constants.BAD_REQUEST});

        const resolve_update = (updated_record) => {
            return res.status(200).json({
                message: constants.UPDATE_SUCCESS,
                affected_record: updated_record[0]
            });
        }

        const resolve = (user) => {
            if (!user) return res.status(401).json({response: constants.ACCESS_FORBIDDEN});
            bcrypt.compare(getPassword(auth), user[0].password, (err, resp) => {
                if (err)
                    return res.status(401).json({response: constants.ACCESS_FORBIDDEN});
                if (!resp)
                    return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

                req.body.username = getEmail(auth);
                userService
                    .updateUser(req.body, user[0])
                    .then(resolve_update)
                    .catch(error => res.status(400).json({response: error.message}));
            });
        }

        userService.isUserExist(getEmail(auth))
            .then(resolve)
            .catch(error => res.status(400).json({response: error.message}));

    } catch (error) {
        return res.status(400).json({response: error.message});
    }
}

exports.getUserInfoById = (req, res) => {
    getUserCounter.inc();
    try {
        const resolve_getId = (user) => {
            if(user) {
               return res.status(200).json({
                    id: user.id,
                   username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                });
            }
            return res.status(400).json({response: constants.BAD_REQUEST});
        }

        userService
        .getUserInfoById(req.params.id)
        .then(resolve_getId)
        .catch(error => res.status(400).json({response: error.message}));

    } catch (error) {
        return res.status(400).json({response: error.message});
    }
}

exports.getUserInfo = (req, res) => {
    getUserCounter.inc();
    try {
        const auth = req.headers['authorization'];
        if (!auth || getEmail(auth) === "" || getPassword(auth) === "")
            return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

        const resolve = (user) => {
            if (!user)
                return res.status(401).json({response: constants.ACCESS_FORBIDDEN});
            bcrypt.compare(getPassword(auth), user[0].password, (err, resp) => {
                if (err)
                    return res.status(401).json({response: constants.ACCESS_FORBIDDEN});
                if (!resp)
                    return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

                return res.status(200).json({
                    id: user[0].id,
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    username: user[0].username,
                    createdAt: user[0].createdAt,
                    updatedAt: user[0].updatedAt
                });
            });
        }
        userService.isUserExist(getEmail(auth))
            .then(resolve)
            .catch(error => {
                res.status(400).json({response: error.message});
            });
    } catch (error) {
        res.status(400).json({response: error.message});
    }
}

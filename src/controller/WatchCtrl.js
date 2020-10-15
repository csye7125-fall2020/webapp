const {validationResult} = require("express-validator/check");
const watchService = require("../service/WatchService");
const userService = require("../service/UserService");
const constants = require("../constants");
const bcrypt = require("bcrypt");

const getEmail = function (auth) {
    const tmp = auth.split(' ');
    return new Buffer.from(tmp[1], 'base64').toString().split(':')[0];
}

const getPassword = function (auth) {
    const tmp = auth.split(' ');
    return new Buffer.from(tmp[1], 'base64').toString().split(':')[1];
}

exports.addWatch = (req, res) => {
    const auth = req.headers['authorization'];
    const errors = validationResult(req);

    if (!auth || getEmail(auth) === "" || getPassword(auth) === "")
        return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

    if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({response: constants.BAD_REQUEST});

    if (!errors.isEmpty())
        return res.status(400).json({response: constants.BAD_REQUEST});

    const resolve = (user) => {
        if (!user) return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

        bcrypt.compare(getPassword(auth), user[0].password, (err, resp) => {
            if (err)
                return res.status(401).json({response: constants.ACCESS_FORBIDDEN});
            if (!resp)
                return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

            req.body.userId = user[0].id;

            watchService.addWatch(req.body)
                .then(watch_data => {
                    watchService.addAlert(req.body.alerts, watch_data.watchId)
                        .then(alert_data => {
                            res.status(200).json({
                                message: constants.WATCH_ADD_SUCCESS,
                                watch: watch_data,
                                alerts: alert_data
                            });
                        }).catch(e => res.status(400).json({response: e.message}));
                }).catch(e => res.status(400).json({response: e.message}));
        });
    }
    userService.isUserExist(getEmail(auth))
        .then(resolve)
        .catch(error => res.status(400).json({response: error.message}));
}

exports.getWatch = (req, res) => {
    const auth = req.headers['authorization'];

    if (!auth || getEmail(auth) === "" || getPassword(auth) === "")
        return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

    const resolve = (user) => {
        if (!user) return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

        bcrypt.compare(getPassword(auth), user[0].password, (err, resp) => {
            if (err)
                return res.status(401).json({response: constants.ACCESS_FORBIDDEN});
            if (!resp)
                return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

            watchService.getWatch(req.params.id)
                .then(watch_data => {
                    if(!watch_data)
                        return res.status(404).json({response: constants.WATCH_NOT_FOUND});
                    res.status(200).json({response: watch_data});
                }).catch(e => res.status(400).json({response: e.message}));
        });
    }

    userService.isUserExist(getEmail(auth))
        .then(resolve)
        .catch(error => res.status(400).json({response: error.message}));
}

exports.deleteWatch = (req, res) => {
    const auth = req.headers['authorization'];

    if (!auth || getEmail(auth) === "" || getPassword(auth) === "")
        return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

    const resolve = (user) => {
        if (!user) return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

        bcrypt.compare(getPassword(auth), user[0].password, (err, resp) => {
            if (err)
                return res.status(401).json({response: constants.ACCESS_FORBIDDEN});
            if (!resp)
                return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

            watchService.deleteWatch(req.params.id)
                .then(watch_data => {
                    if(!watch_data)
                        return res.status(404).json({response: constants.WATCH_NOT_FOUND});
                    res.status(201).json({response: constants.WATCH_DELETE_SUCCESS});
                }).catch(e => res.status(400).json({response: e.message}));
        });
    }

    userService.isUserExist(getEmail(auth))
        .then(resolve)
        .catch(error => res.status(400).json({response: error.message}));
}

exports.updateWatch = (req, res) => {
    const auth = req.headers['authorization'];

    if (!auth || getEmail(auth) === "" || getPassword(auth) === "")
        return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

    if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({response: constants.UPDATE_BODY_EMPTY});


    const resolve = (user) => {
        if (!user) return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

        bcrypt.compare(getPassword(auth), user[0].password, (err, resp) => {
            if (err)
                return res.status(401).json({response: constants.ACCESS_FORBIDDEN});
            if (!resp)
                return res.status(401).json({response: constants.ACCESS_FORBIDDEN});

            const resolve_updateWatch = (updated_watch) => {
                res.status(201).json({response: constants.WATCH_UPDATE_SUCCESS});
            }

            const resolve_getWatch = (watch_data) => {
                if(!watch_data)
                    return res.status(404).json({response: constants.WATCH_NOT_FOUND});

                watchService.updateWatch(req.params.id, watch_data, req.body)
                    .then(resolve_updateWatch).catch(e => res.status(400).json({response: e.message}));
            }

            watchService.getWatch(req.params.id)
                .then(resolve_getWatch).catch(e => res.status(400).json({response: e.message}));
        });
    }

    userService.isUserExist(getEmail(auth))
        .then(resolve)
        .catch(error => res.status(400).json({response: error.message}));
}

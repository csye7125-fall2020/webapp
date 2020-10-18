const {validationResult} = require("express-validator/check");
const watchService = require("../service/WatchService");
const userService = require("../service/UserService");
const producerService = require("../service/ProducerService");
const config = require("../kafka/kafka-config");
const constants = require("../constants");
const bcrypt = require("bcrypt");
const _ = require("lodash");
let producePayload = [];

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
                            watch_data.setDataValue("alerts", alert_data);

                            producePayload = [];
                            producePayload.push({topic: config.kafka_topic, messages: JSON.stringify(watch_data.dataValues)});
                            producerService.publish(producePayload);

                            res.status(200).json({
                                message: constants.WATCH_ADD_SUCCESS,
                                watch: watch_data
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

                    publishToKafka(req.params.id);

                    res.status(201).json({response: constants.WATCH_DELETE_SUCCESS});
                }).catch(e => res.status(400).json({response: e.message}));
        });
    }

    userService.isUserExist(getEmail(auth))
        .then(resolve)
        .catch(error => res.status(400).json({response: error.message}));
}

function publishToKafka(id) {
    watchService.getWatch(id)
        .then( res => {
            producePayload = [];
            producePayload.push({topic: config.kafka_topic, messages: JSON.stringify(res.dataValues)});
            producerService.publish(producePayload);
        }).catch();
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

            const resolve_getAlert = (existing_alert) => {
                if(!existing_alert)
                    return res.status(404).json({response: constants.ALERT_NOT_FOUND});

                watchService.updateAlert(existing_alert, req.body.alerts)
                    .then(resp => {
                        publishToKafka(req.params.id);
                        res.status(201).json({response: constants.WATCH_UPDATE_SUCCESS});
                    }).catch(e => res.status(400).json({response: e.message}));
            }

            const resolve_getWatch = (watch_data) => {
                if(!watch_data)
                    return res.status(404).json({response: constants.WATCH_NOT_FOUND});

                watchService.updateWatch(req.params.id, watch_data, req.body)
                    .then(update_success => {
                        const alerts = req.body.alerts;
                        if(alerts && alerts.length > 0){
                                const mergedAlerts = mergeAllAlerts(watch_data.alerts, alerts);
                                const rejAlerts = rejectedAlerts(watch_data.alerts, mergedAlerts);
                                if(rejAlerts.length === 0) {
                                    console.log("No rejected alerts");
                                    watchService.addAlert(mergedAlerts, watch_data.watchId)
                                        .then(succ => {
                                            console.log("all new alerts inserted successfully");
                                            publishToKafka(req.params.id);
                                            res.status(201).json({response: constants.WATCH_UPDATE_SUCCESS});
                                        }).catch(e => e => res.status(400).json({response: e.message}));
                                }
                                else{
                                    console.log("deleting some of the alerts");
                                    watchService.deleteAlert(rejAlerts)
                                        .then( succ =>  {
                                            console.log("some deleted successfully");
                                            watchService.addAlert(mergedAlerts, watch_data.watchId)
                                                .then(succ => {
                                                    console.log("some new alerts inserted successfully");
                                                    publishToKafka(req.params.id);
                                                    res.status(201).json({response: constants.WATCH_UPDATE_SUCCESS});
                                                }).catch(e => e => res.status(400).json({response: e.message}));
                                        })
                                        .catch(e => res.status(400).json({response: e.message}));
                                 }
                        } else {
                            publishToKafka(req.params.id);
                            return res.status(201).json({response: constants.WATCH_UPDATE_SUCCESS});
                        }
                    })
                    .catch(e => res.status(400).json({response: e.message}));
            }

            watchService.getWatch(req.params.id)
                .then(resolve_getWatch).catch(e => res.status(400).json({response: e.message}));
        });
    }

    userService.isUserExist(getEmail(auth))
        .then(resolve)
        .catch(error => res.status(400).json({response: error.message}));
}

const mergeAllAlerts = (existing_alerts, new_alerts) => {
    const alerts = [];

    for(let i = 0; i< new_alerts.length; i++){
        const isFound = _.find(existing_alerts, new_alerts[i]);
        console.log("isFound: ", isFound);
        if(!isFound)
            alerts.push(new_alerts[i]);
        else
            alerts.push(isFound);
    }

    console.log("updated alert: "+ alerts);
    return alerts;
}

const rejectedAlerts = (existing_alerts, merged_alerts) => {
    let rejected = [];
    let fromDb = false;
    _.forEach(merged_alerts, alert => {
        if(alert.alertId){
            if(rejected.length === 0)
                rejected = _.reject(existing_alerts, {alertId: alert.alertId});
            else
                rejected = _.reject(rejected, {alertId: alert.alertId});
            fromDb = true;
        } else{
            if(rejected.length === 0)
                rejected = _.reject(existing_alerts, alert);
            else
                rejected = _.reject(rejected, alert);
        }
    });
    if(rejected.length === 0 && fromDb)
        console.log("All repeated alerts from DB " + rejected);

    return rejected;
}

"use strict";
const db = require("../db/db-config");
const Watch = db.watch;
const Alert = db.alert;
const uuid = require('uuid');

exports.addWatch = (watch) => {
    return Watch.create({
        watchId: uuid.v4(),
        userId: watch.userId,
        zipCode: watch.zipCode
    });
}

exports.addAlert = (alerts, watchId) => {
    for (let i in alerts) {
        alerts[i]["watchId"] = watchId;
    }
    return Alert.bulkCreate(alerts);
}

exports.updateWatch = (watchId, oldWatch, newWatch) => {
    const updatedWatch = {
        zipCode: newWatch.zipCode ? newWatch.zipCode : oldWatch.zipCode
    }
    return Watch.update(updatedWatch, {
        where: {
            watchId: watchId
        }
    });
}

exports.updateAlert = (alert) => {
    return Alert.update(alert, {
        where: {
            alertId: alert.alertId
        }
    });
}

exports.getWatch = (watchId) => {
    return Watch.findOne({
        where: {
            watchId: watchId
        },
        include: ["alerts"]
    })
}

exports.deleteWatch = (watchId) => {
    return Watch.destroy({
        where: {
            watchId: watchId
        }
    });
}

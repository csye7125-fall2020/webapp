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

exports.updateAlert = (oldAlert, newAlert) => {
    const updatedAlert = {
        fieldType: newAlert[0].fieldType ? newAlert[0].fieldType : oldAlert.fieldType,
        operator: newAlert[0].fieldType ? newAlert[0].operator : oldAlert.operator,
        value: newAlert[0].value ? newAlert[0].value : oldAlert.value
    }
    return Alert.update(updatedAlert, {
        where: {
            alertId: oldAlert.alertId
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

exports.getAlert = (alertId) => {
    return Alert.findOne({
        where: {
            alertId: alertId
        }
    })
}

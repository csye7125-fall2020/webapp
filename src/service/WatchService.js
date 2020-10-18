"use strict";
const db = require("../db/db-config");
const Watch = db.watch;
const Alert = db.alert;
const uuid = require('uuid');
const _ = require('lodash');

exports.addWatch = (watch) => {
    return Watch.create({
        watchId: uuid.v4(),
        userId: watch.userId,
        zipcode: watch.zipcode
    });
}

exports.addAlert = (alerts, watchId) => {
    const postbody = [];

    for (let i in alerts) {
        if(alerts[i].alertId)
            continue;
        let obj = {};
        obj["alertId"] = uuid.v4();
        obj["watchId"] = watchId;
        obj["fieldType"] = alerts[i].fieldType;
        obj["operator"] = alerts[i].operator;
        obj["value"] = alerts[i].value;
        postbody.push(obj);
    }

    return Alert.bulkCreate(postbody);
}

exports.updateWatch = (watchId, oldWatch, newWatch) => {
    const updatedWatch = {
        zipcode: newWatch.zipcode ? newWatch.zipcode : oldWatch.zipcode
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
    return Watch.update({isDeleted: true},{
        where: {
            watchId: watchId
        }
    });
}

exports.deleteAlert = (rejectedAlerts, mergedAlerts) => {
    return Alert.destroy({
        where: {
            alertId: rejectedAlerts.map((al) => {
                return al.alertId;
            })
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

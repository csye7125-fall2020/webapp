module.exports = (sequelize, Sequelize) => {
    const alert = sequelize.define("alert", {
        alertId: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        fieldType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        operator: {
            type: Sequelize.STRING,
            allowNull: false
        },
        value: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return alert;
}

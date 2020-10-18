module.exports = (sequelize, Sequelize) => {
    const watch = sequelize.define("watch", {
        watchId: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        zipcode: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    return watch;
}

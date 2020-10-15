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
        zipCode: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return watch;
}

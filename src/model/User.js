module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("user", {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return user;
}

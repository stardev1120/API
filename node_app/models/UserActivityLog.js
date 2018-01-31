'use strict';

module.exports = function(sequelize, DataTypes) {
    const UserActivityLog = sequelize.define('UserActivityLog', {
        user_email: DataTypes.STRING(30),
        action: DataTypes.STRING(1000),
        payload: DataTypes.STRING(1000)
    },{
        underscored: true
    });

    return UserActivityLog;
};

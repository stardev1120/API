'use strict';

module.exports = function(sequelize, DataTypes) {
    const UserActivityLog = sequelize.define('UserActivityLog', {
        admin_user_id: DataTypes.INTEGER(11),
        action: DataTypes.STRING(1000),
        payload: DataTypes.STRING(1000)
    },{
        underscored: true
    });

    return UserActivityLog;
};

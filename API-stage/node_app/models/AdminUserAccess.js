'use strict';

module.exports = function(sequelize, DataTypes) {
    const AdminUserAccess = sequelize.define('AdminUserAccess', {
        otp: DataTypes.STRING,
        date: DataTypes.DATE,
        using_period: DataTypes.INTEGER,
        status: DataTypes.STRING
    },{
        underscored: true
    });
    return AdminUserAccess;
};

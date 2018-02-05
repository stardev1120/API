'use strict';

module.exports = function(sequelize, DataTypes) {
    const UserActivityLog = sequelize.define('UserActivityLog', {
        user_email: DataTypes.STRING(30),
        action: {
            type: DataTypes.TEXT,
            get: function () {
                return this.getDataValue('action') ? JSON.parse(this.getDataValue('action')) : null;
            },
            set: function (value) {
                this.setDataValue('action', JSON.stringify(value))
            }
        },
        payload: {
            type: DataTypes.TEXT,
            get: function () {
                return this.getDataValue('payload') ? JSON.parse(this.getDataValue('payload')) : null;
            },
            set: function (value) {
                this.setDataValue('payload', JSON.stringify(value))
            }
        }
    },{
        underscored: true
    });

    return UserActivityLog;
};

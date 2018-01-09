'use strict';

module.exports = function(sequelize, DataTypes) {
    const ViewProfileOTP = sequelize.define('ViewProfileOTP', {
        token: DataTypes.STRING,
        availability: DataTypes.DATE,
        using_period: DataTypes.INTEGER,
        status: DataTypes.STRING
    },{
        underscored: true
    });
    return ViewProfileOTP;
};

'use strict';

module.exports = function (sequelize, DataTypes) {
    const AdminUser = sequelize.define('AdminUser', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        company_id: DataTypes.INTEGER(11),
        role_id: DataTypes.INTEGER(11),
        phone_number: DataTypes.STRING,
        number_password_attempt: {
            type: DataTypes.INTEGER(1),
            defaultValue: 0
        },
        max_session_time: DataTypes.STRING,
        two_factor_temp_secret: DataTypes.STRING,
        otpauth_url: DataTypes.STRING,
        last_login: DataTypes.DATE,
        is2FAVerified:{
            type:DataTypes.BOOLEAN,
            defaultValue: 0
        },
    }, {
        underscored: true
    });
    return AdminUser;
};

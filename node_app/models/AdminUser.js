'use strict';

module.exports = function(sequelize, DataTypes) {
    const AdminUser = sequelize.define('AdminUser', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        company_id: DataTypes.INTEGER(11),
        role_id: DataTypes.INTEGER(11),
        phone_number: DataTypes.STRING,
        number_password_attempt:{
            type: DataTypes.INTEGER(1),
            defaultValue: 0
        },
        max_session_time: DataTypes.STRING,
        FAfield: DataTypes.STRING,// todo ask customer about 2 fa fieldو
        last_login: DataTypes.DATE
    },{
        underscored: true
    });
    return AdminUser;
};

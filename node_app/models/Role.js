'use strict';

module.exports = function(sequelize, DataTypes) {
    const Role = sequelize.define('Role', {
        role_id: DataTypes.INTEGER(11),
        role_name: DataTypes.STRING,
        max_session_time: DataTypes.STRING
    },{
        underscored: true
    });

    return Role;
};

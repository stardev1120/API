'use strict';

module.exports = function(sequelize, DataTypes) {
    const AdminCollectDistribute = sequelize.define('AdminCollectDistribute', {
        adminuser_id: DataTypes.INTEGER(11),
        transactionType: DataTypes.STRING,
        amount: DataTypes.INTEGER
    },{
        underscored: true
    });
    return AdminCollectDistribute;
};

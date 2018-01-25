'use strict';

module.exports = function(sequelize, DataTypes) {
    const AdminCollectDistribute = sequelize.define('AdminCollectDistribute', {
        transactionType: DataTypes.STRING,
        amount: DataTypes.INTEGER
    },{
        underscored: true
    });
    return AdminCollectDistribute;
};

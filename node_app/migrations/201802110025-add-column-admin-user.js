'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE AdminUsers " +
            "ADD COLUMN is2FAVerified bit," +
            "ADD COLUMN photo varchar(255); ").then().catch(()=>{});
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE AdminUsers " +
            "drop COLUMN is2FAVerified," +
            "drop COLUMN photo;").then().catch(()=>{});
}
}

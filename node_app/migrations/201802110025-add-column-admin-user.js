'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE AdminUsers " +
            "ADD COLUMN is2FAVerified bit; ").then().catch(()=>{});
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE AdminUsers " +
            "drop COLUMN is2FAVerified;").then().catch(()=>{});
}
}

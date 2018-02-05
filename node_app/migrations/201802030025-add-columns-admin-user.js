'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE AdminUsers " +
            "drop COLUMN FAfield, "+
            "ADD COLUMN two_factor_temp_secret VARCHAR(255), " +
            "ADD COLUMN otpauth_url VARCHAR(255);").then().catch(()=>{});
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE AdminUsers " +
            "ADD COLUMN FAfield VARCHAR(255), "+
            "drop COLUMN two_factor_temp_secret, " +
            "drop COLUMN otpauth_url;").then().catch(()=>{});
}
}

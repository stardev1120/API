'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE AdminUsers ADD last_login datetime;").then();
    },

    down: function (queryInterface, Sequelize) {
    }
};
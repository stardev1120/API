'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query("INSERT INTO Roles (id, role_id, role_name) VALUES(1, 'super admin', 'supper_admin') ON DUPLICATE KEY UPDATE role_name='supper admin', role_id='supper_admin'").then();
    },

    down: function (queryInterface, Sequelize) {
    }
};
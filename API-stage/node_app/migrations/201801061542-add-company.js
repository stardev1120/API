'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query("INSERT INTO Companies (id, company_name, name, company_address, contact_number, country_id) " +
            "VALUES(1, 'test', 'test', 'test', '1111111111', 1) " +
            "ON DUPLICATE KEY UPDATE company_name='test', name='test', company_address='test', contact_number='11111111', country_id=1").then();
    },

    down: function (queryInterface, Sequelize) {
    }
};

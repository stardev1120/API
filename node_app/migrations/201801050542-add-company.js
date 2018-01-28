'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query("INSERT INTO Companies (id, company_name, name, company_address, contact_number, country_id, created_at, updated_at) VALUES\n" +
            "(1, 'company2', 'company 2', 'test11', '1111111111', 1, '2018-01-24 16:07:06', '2018-01-26 21:38:03')" +
            "ON DUPLICATE KEY UPDATE company_name='supper admin', name= 'test11', company_address= 'address_1', contact_number= '1111111111', country_id= '1'").then();
    },

    down: function (queryInterface, Sequelize) {
    }
};

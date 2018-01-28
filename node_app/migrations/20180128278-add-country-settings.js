'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('CountrySettings').then(function() {
            return queryInterface.sequelize.query("INSERT INTO CountrySettings (name, value, country_id, created_at, updated_at) VALUES " +
                "('country settings test', 'test test', 1, '2018-01-24 16:07:06', '2018-01-26 21:38:03');").then();
        });
    },

    down: function (queryInterface, Sequelize) {
    }
};

'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Roles', [{
            id: 1,
            role_id: 'admin',
            role_name: 'Admin'
        }]);
    },

    down: function (queryInterface, Sequelize) {
    }
};

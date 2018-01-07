'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('AdminUsers', [{
            name: 'test',
            email: 'test@test.com',
            password: 'b7bc2a2f5bb6d521e64c8974c143e9a0',
            company_id: 1,
            role_id: 1,
            max_session_time: '2h'
        }]);
    },

    down: function (queryInterface, Sequelize) {
    }
};

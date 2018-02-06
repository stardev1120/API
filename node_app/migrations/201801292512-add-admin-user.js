'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query("INSERT INTO AdminUsers (name, email, password, company_id, role_id, phone_number, number_password_attempt, max_session_time,  last_login ,  created_at ,  updated_at ) VALUES" +
            "('test', 'test0@test.com', 'b7bc2a2f5bb6d521e64c8974c143e9a0', 1, 1, NULL, 24, '2h', '2018-01-27 14:25:45', '2018-01-24 16:13:01', '2018-01-27 14:25:45');").then();
    },

    down: function (queryInterface, Sequelize) {
    }
};
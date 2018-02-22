'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE Roles " +
            "MODIFY column max_session_time VARCHAR(255);").then().catch(()=>{});
    },

    down: function (queryInterface, Sequelize) {
 return queryInterface.sequelize.query(
            "ALTER TABLE Roles " +
            "MODIFY column max_session_time INT(11);").then().catch(()=>{});
    }
};

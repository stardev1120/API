'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
        "ALTER TABLE UserActivityLogs ADD user_email VARCHAR(30);").then().catch(()=>{});
  },
  down: function(queryInterface, Sequelize) {
 return queryInterface.sequelize.query(
            "ALTER TABLE UserActivityLogs drop user_email;").then();
  }
};

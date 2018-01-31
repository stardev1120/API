'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
        "ALTER TABLE UserActivityLogs DROP COLUMN admin_user_id;").then().catch(()=>{});
  },
  down: function(queryInterface, Sequelize) {
 return queryInterface.sequelize.query(
            "ALTER TABLE UserActivityLogs ADD admin_user_id int;").then();
  }
};

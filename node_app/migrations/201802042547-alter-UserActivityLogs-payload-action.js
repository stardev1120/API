'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.sequelize.query(
        "ALTER TABLE UserActivityLogs MODIFY action TEXT;").then().catch(()=>{});
     queryInterface.sequelize.query(
    "ALTER TABLE UserActivityLogs MODIFY payload TEXT;").then().catch(()=>{});
      return;
  },
  down: function(queryInterface, Sequelize) {
    queryInterface.sequelize.query(
     "ALTER TABLE UserActivityLogs MODIFY action varchar(255);").then().catch(()=>{});
      queryInterface.sequelize.query(
      "ALTER TABLE UserActivityLogs MODIFY payload varchar(255);").then().catch(()=>{});
      return;
  }
};

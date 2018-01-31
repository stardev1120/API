'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
        "ALTER TABLE UserActivityLogs DROP FOREIGN KEY UserActivityLogs_ibfk_1").then().catch((error)=>{
});
  },
  down: function(queryInterface, Sequelize) {
  }
};

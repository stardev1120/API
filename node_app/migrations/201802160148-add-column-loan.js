'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE Loans " +
            "ADD admin_user_id int(11)," +
            "ADD CONSTRAINT fk_admin_user_id FOREIGN KEY (admin_user_id) REFERENCES AdminUsers(id);").then().catch(()=>{});
    },

    down: function (queryInterface, Sequelize) {
 return queryInterface.sequelize.query(
            "ALTER TABLE Loans " +
            "DROP FOREIGN KEY fk_admin_user_id,"+
            "drop admin_user_id;").then().catch(()=>{});
    }
};

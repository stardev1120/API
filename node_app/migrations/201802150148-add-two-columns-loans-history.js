'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE LoansHistories " +
            "ADD loan_id int(11)," +
            "ADD admin_user_id int(11)," +
            "ADD CONSTRAINT fk_loan_id FOREIGN KEY (loan_id) REFERENCES Loans(id)," +
            "ADD CONSTRAINT fk_admin_user_id FOREIGN KEY (admin_user_id) REFERENCES AdminUsers(id);").then().catch(()=>{});
    },

    down: function (queryInterface, Sequelize) {
 return queryInterface.sequelize.query(
            "ALTER TABLE LoansHistories " +
     "DROP FOREIGN KEY fk_admin_user_id,"+
            "DROP FOREIGN KEY fk_loan_id,"+
            "drop loan_id," +
            "drop admin_user_id;").then().catch(()=>{});
    }
};

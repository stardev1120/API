'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
 return queryInterface.sequelize.query("ALTER TABLE Roles " +
            "MODIFY role_id varchar(255);").then(()=>{
        queryInterface.sequelize.query("INSERT INTO Roles (id, role_id, role_name) VALUES" +
            "(1, 'Super Admin', 'super_admin') ON DUPLICATE KEY UPDATE role_name='Super Admin', role_id='super_admin'").then();

        queryInterface.sequelize.query("INSERT INTO Roles (id, role_id, role_name) VALUES" +         
            "(2, 'Admin', 'admin') ON DUPLICATE KEY UPDATE role_name='Admin', role_id='admin'").then();

         queryInterface.sequelize.query("INSERT INTO Roles (id, role_id, role_name) VALUES" +
            "(3, 'Call Center', 'call_center') ON DUPLICATE KEY UPDATE role_name='Call Center', role_id='call_center'").then();

       
         queryInterface.sequelize.query("INSERT INTO Roles (id, role_id, role_name) VALUES" +
            "(4, 'Distributor Admin', 'distributor_admin') ON DUPLICATE KEY UPDATE role_name='Distributor Admin', role_id='distributor_admin'").then();
        
queryInterface.sequelize.query("INSERT INTO Roles (id, role_id, role_name) VALUES" + "(5, 'Distribution', 'distribution') ON DUPLICATE KEY UPDATE role_name='Distribution', role_id='distribution'").then();
});
    },

    down: function (queryInterface, Sequelize) {
    }
};

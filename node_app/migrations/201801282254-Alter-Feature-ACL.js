'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query("ALTER TABLE FeatureACLs " +
            "MODIFY role_id int(11)," +
            "ADD module varchar(255)," +
            "ADD other text;").then().catch(()=>{});
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query("ALTER TABLE FeatureACLs " +
            "drop module," +
            "drop other;").then().catch(()=>{});
    }
};

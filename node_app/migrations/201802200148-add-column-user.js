'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE Users " +
            "ADD selfie_proof_video varchar(255);").then().catch(()=>{});
    },

    down: function (queryInterface, Sequelize) {
 return queryInterface.sequelize.query(
            "ALTER TABLE Users " +
            "drop selfie_proof_video;").then().catch(()=>{});
    }
};

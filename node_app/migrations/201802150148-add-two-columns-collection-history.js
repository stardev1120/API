'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            "ALTER TABLE CollectionHistories " +
            "ADD collection_id int(11)," +
            "ADD admin_user_id int(11)," +
            "ADD CONSTRAINT fk_collection_id FOREIGN KEY (collection_id) REFERENCES Collections(id)," +
            "ADD CONSTRAINT fk_admin_user_id FOREIGN KEY (admin_user_id) REFERENCES AdminUsers(id);").then().catch(()=>{});
    },

    down: function (queryInterface, Sequelize) {
 return queryInterface.sequelize.query(
            "ALTER TABLE CollectionHistories " +
            "DROP FOREIGN KEY fk_collection_id,"+
            "DROP FOREIGN KEY fk_admin_user_id,"+
            "drop collection_id," +
            "drop admin_user_id;").then().catch(()=>{});
    }
};

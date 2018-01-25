'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('FeatureACLs', [{
            role_id: 1,
            feature_api_url: '/api/admin/admin-user'
        },{
            role_id: 1,
            feature_api_url: '/api/admin/company'
        },{
            role_id: 1,
            feature_api_url: '/api/admin/distribution-center'
        }]);
    },

    down: function (queryInterface, Sequelize) {
    }
};

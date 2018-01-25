'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('FeatureACLs', [{
            role_id: 1,
            feature_api_url: '/api/admin/user'
        },{
            role_id: 1,
            feature_api_url: '/api/admin/country'
        },{
            role_id: 1,
            feature_api_url: '/api/admin/country-setting'
        },
            {
                role_id: 1,
                feature_api_url: '/api/admin/non-supported-country-lead'
            },{
                role_id: 1,
                feature_api_url: '/api/admin/country-investment'
            },{
                role_id: 1,
                feature_api_url: '/api/admin/loan'
            },{
                role_id: 1,
                feature_api_url: '/api/admin/collection'
            },{
                role_id: 1,
                feature_api_url: '/api/admin/view-profile-otp'
            }
        ]);
    },

    down: function (queryInterface, Sequelize) {
    }
};

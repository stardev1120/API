'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('FeatureACLs').then(()=>{
                return queryInterface.bulkInsert('FeatureACLs', [{
                    role_id: 1,
                    feature_api_url: '/api/admin/user',
                    actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }',
                    fields:'{ "ALL": true, "LOAN": true }'
                },{
                    role_id: 1,
                    feature_api_url: '/api/admin/country',
                    actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }'
                },{
                    role_id: 1,
                    feature_api_url: '/api/admin/country-setting',
                    actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }'
                },
                    {
                        role_id: 1,
                        feature_api_url: '/api/admin/non-supported-country-lead',
                        actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }'
                    },{
                        role_id: 1,
                        feature_api_url: '/api/admin/country-investment',
                        actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }'
                    },{
                        role_id: 1,
                        feature_api_url: '/api/admin/loan',
                        actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }',
                        fields:'{"ALL": true}'
                    },{
                        role_id: 1,
                        feature_api_url: '/api/admin/collection',
                        actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }',
                        fields:'{ "ALL": true }'
                    },{
                        role_id: 1,
                        feature_api_url: '/api/admin/admin-user-access',
                        actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }'
                    },
                    {
                        role_id: 1,
                        feature_api_url: '/api/admin/admin-user',
                        actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }'
                    },{
                        role_id: 1,
                        feature_api_url: '/api/admin/company',
                        actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }'
                    },{
                        role_id: 1,
                        feature_api_url: '/api/admin/distribution-center',
                        actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }'
                    },
                    {
                        role_id: 1,
                        feature_api_url:'/api/admin/admin-collect-distribute',
                        actions:'{ "GET":true, "POST": true, "PUT": true, "DELETE": true }'
                    }
                ]);
            });


    },

    down: function (queryInterface, Sequelize) {
    }
};

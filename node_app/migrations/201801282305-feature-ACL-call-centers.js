'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('delete from FeatureACLs where role_id = 3').then(function () {
            return queryInterface.bulkInsert('FeatureACLs', [
                {
                    role_id: 3,
                    module: 'users',
                    feature_api_url: '/api/admin/user',
                    actions: '{"GET": true, "PUT": true }',
                    fields: '{"ALL": true, "status": true, "fname": true, ' +
                    '"mname": true, "lname": true, "email": true, ' +
                    '"dob": true, "user_location": true, "access_token": true, "phone_number": true, ' +
                    '"verified": true, "accept": true, "no_of_active_loans": true, ' +
                    '"sex": true, "profilepic": true, "relationship": true, ' +
                    '"available_amount": true, "min_availalble_amount": true, "number_of_attempts": true, "last_attempts_time": true, "umbrella_score": true, ' +
                    '"fbId": true, "created_at": true, "smscode": true, "uScore_status": true, ' +
                    '"id_proof_file": true, "selfie_proof_file": true, "address_proof_file": true, ' +
                    '"id_verification_status": true, "address_verification_status": true, "updated_at": true, ' +
                    '"country_id": true, "LOAN": true }',
                    other: '{ "viewWithoutOTP": false, "viewWithOTP": true, "triggerCreditStore": true}'
                },
                {
                    role_id: 3,
                    module: 'loans',
                    feature_api_url: '/api/admin/loan',
                    actions: '{"GET": false, "PUT": true }',
                    fields: '{"ALL": true, "status": true}',
                    other: '{ "cancelLoanBasedOnStatus": true, "cancelLoanBasedOnStatusNotGiven": true, "closeLoan": true, "issueMoney": false}'
                },
                {
                    role_id: 3,
                    module: 'collections',
                    feature_api_url: '/api/admin/collection',
                    fields: '{"ALL":false}',
                    actions: '{"GET": false, "PUT": false }',
                    other: '{ "collectMoney": false }'
                },
                {
                    role_id: 3,
                    module: 'collection-history',
                    feature_api_url: '/api/admin/collection-history',
                    fields: '{}',
                    actions: '{"GET": false, "PUT": false }'
                },
                {
                    role_id: 3,
                    module: 'countries',
                    fields: '{}',
                    other: '{"seeAllCountries": false}',
                    feature_api_url: '/api/admin/country',
                    actions: '{ "GET":false, "POST": false, "PUT": false, "DELETE": false }'
                },
                {
                    role_id: 3,
                    module: 'country-settings',
                    fields: '{}',
                    other: '{}',
                    feature_api_url: '/api/admin/country-setting',
                    actions: '{ "GET":false, "POST": false, "PUT": false, "DELETE": false }'
                },
                {
                    role_id: 3,
                    module: 'country-investments',
                    fields: '{}',
                    other: '{}',
                    feature_api_url: '/api/admin/country-investment',
                    actions: '{ "GET":false, "POST": false, "PUT": false, "DELETE": false }'
                },
                {
                    role_id: 3,
                    module: 'non-supported-country-leads',
                    feature_api_url: '/api/admin/non-supported-country-lead',
                    fields: '{}',
                    other: '{}',
                    actions: '{ "GET":false }'
                },
                {
                    role_id: 3,
                    module: 'companies',
                    fields: '{}',
                    other: '{}',
                    feature_api_url: '/api/admin/company',
                    actions: '{ "GET":false, "POST": false, "PUT": false, "DELETE": false }'
                },
                {
                    role_id: 3,
                    module: 'distribution-centers',
                    fields: '{}',
                    other: '{}',
                    feature_api_url: '/api/admin/distribution-center',
                    actions: '{ "GET":false, "POST": false, "PUT": false, "DELETE": false }'
                },
                {
                    role_id: 3,
                    module: 'admin-users',
                    fields: '{}',
                    feature_api_url: '/api/admin/admin-user',
                    actions: '{ "GET":false, "POST": false, "PUT": false, "DELETE": false }',
                    other: '{ "createSuperAdminUser": false, "2FA": true }'
                },
                {
                    role_id: 3,
                    module: 'dashboard',
                    feature_api_url: '/api/admin/dashboard',
                    actions: '{ "GET":true, "POST":true }',
                    fields: '{}',
                    other: '{"total_of_users": true, ' +
                    '"total_of_loans": true,' +
                    '"total_of_collections": true,' +
                    '"total_of_given_out_loans": true,' +
                    '"total_amount_collected": true,' +
                    '"country_investment_money_left": true,' +
                    '"country_investment_status": true,' +
                    '"average_uScore": true,' +
                    '"total_of_unverified_users": true,' +
                    '"total_of_users_profile_viewed_by_otp_access": true,' +
                    '"revenue": true,' +
                    '"duration_users_loans_collections": true,' +
                    '"duration_users_amountOfLoans_amountOfCollections": true'+
                    '}'
                },
                {
                    role_id: 3,
                    module: 'user-activities',
                    feature_api_url: '/api/admin/user-activity-log',
                    actions: '{ "GET":true }',
                    fields: '{}',
                    other: '{}'
                },
                {
                    role_id: 3,
                    module: 'roles',
                    fields: '{}',
                    other: '{}',
                    feature_api_url: '/api/admin/role',
                    actions: '{ "GET":false, "POST": false, "PUT": false, "DELETE": false }'
                },
                {
                    role_id: 3,
                    module: 'admin-user-access',
                    feature_api_url: '/api/admin/admin-user-access',
                    actions: '{ "GET":true, "PUT": true, "POST": true }',
                    fields: '{}',
                    other: '{ "viewWithoutOTP": false, "viewWithOTP": false}'
                },
                {
                    role_id: 3,
                    module: 'admin-collect-distribute',
                    feature_api_url: '/api/admin/admin-collect-distribute',
                    actions: '{ "GET":true, "POST": true }',
                    fields: '{}',
                    other: '{}'
                },
                {
                    role_id: 3,
                    module: 'issue-collect-money',
                    actions: '{ "GET":false, "POST": false }',
                    fields: '{}',
                    other: '{}'
                },
                {
                    role_id: 3,
                    module: 'feature-acl',
                    feature_api_url: '/api/admin/feature-acl',
                    actions: '{"GET": true, "PUT": true }',
                    fields: '{}',
                    other: '{}'
                }
            ]);
        });
    },
    down: function (queryInterface, Sequelize) {
    }
};

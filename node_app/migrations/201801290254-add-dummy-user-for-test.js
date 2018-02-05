'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {

        queryInterface.sequelize.query(
            "INSERT INTO Users (id, fname, mname, lname, email, dob, user_location, access_token, phone_number, verified, accept, no_of_active_loans, status, sex, profilepic, relationship," + "available_amount, min_availalble_amount, number_of_attempts, last_attempts_time, created_at, umbrella_score, fbId, smscode, uScore_status, id_proof_file, selfie_proof_file," + "address_proof_file, id_verification_status, address_verification_status, updated_at, country_id) VALUES" +
            "(1,	'test',	'test',	'test',	'test',	'0000-00-00 00:00:00',	'test',	'test',	'test',	0,	2,	2,	'test',	'test'," + "'https://imageog.flaticon.com/icons/png/512/3/3729.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',	'test',	1,	0,	0,	'2018-01-30 20:57:13',	'2018-01-30 20:57:13',	0," + "'test',	'test',	'test',	'https://imageog.flaticon.com/icons/png/512/3/3729.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF'," + "'https://imageog.flaticon.com/icons/png/512/3/3729.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF'," + "'https://imageog.flaticon.com/icons/png/512/3/3729.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',	'test',	'test',	'0000-00-00 00:00:00',	NULL) " +
            "ON DUPLICATE KEY UPDATE fname='test', lname='test'").then()
    },

    down: function (queryInterface, Sequelize) {
    }
};

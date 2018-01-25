'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.sequelize.query("INSERT INTO Countries (id, name, country_code, status) " +
          "VALUES(1, 'some country', 'SG', 1) " +
          "ON DUPLICATE KEY UPDATE  name='some country', country_code='SG', status=1").then(()=>{
              return queryInterface.sequelize.query("INSERT INTO Countries (id, name, country_code, status) " +
                  "VALUES(2, 'ukraine', 'UA', 1) " +
                  "ON DUPLICATE KEY UPDATE  name='ukraine', country_code='UA', status=1").then()
          });
  },

  down: function (queryInterface, Sequelize) {
   /* return queryInterface.sequelize.bulkDelete('Countries', {where: {
        $or: [
        {country_code:'SG'},
        {country_code: 'UA'}
      ]
    }})*/
  }
};

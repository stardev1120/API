'use strict';

module.exports = function (sequelize, DataTypes) {
    const FeatureACL = sequelize.define('FeatureACL', {
        role_id: DataTypes.INTEGER,
        module: DataTypes.STRING,
        feature_api_url: DataTypes.STRING,
        actions: {
            type: DataTypes.TEXT,
            get: function () {
                return this.getDataValue('actions') ? JSON.parse(this.getDataValue('actions')) : null;
            },
            set: function (value) {
                this.setDataValue('actions', JSON.stringify(value))
            }
        },
        fields: {
            type: DataTypes.TEXT,
            get: function () {
                return this.getDataValue('fields') ? JSON.parse(this.getDataValue('fields')) : null;
            },
            set: function (value) {
                this.setDataValue('fields', JSON.stringify(value))
            }
        },
        other: {
            type: DataTypes.TEXT,
            get: function () {
                return this.getDataValue('other') ? JSON.parse(this.getDataValue('other')) : null;
            },
            set: function (value) {
                this.setDataValue('other', JSON.stringify(value))
            }
        }
    }, {
        underscored: true
    });

    return FeatureACL;
};

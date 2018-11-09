'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('recharge', {
            rechargeId: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
            },
            userId: {
                type: Sequelize.STRING,
            },
            amount: {
                type: Sequelize.FLOAT,
            },
            exchangeRate: {
                type: Sequelize.FLOAT,
            },
            paymentDate: {
                type: Sequelize.DATE,
            },
            paymentStatus: {
                type: Sequelize.STRING,
            }
        });
    },
    down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('recharge');
    }
};
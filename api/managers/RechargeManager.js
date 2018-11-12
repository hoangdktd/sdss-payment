// const sequelize = require('sequelize');
const Sequelize = require('sequelize');
// const database = require('../../config/database');
const Recharge = require('../models/Recharge');
const User = require('../models/User');
const uuidv1 = require('uuid/v1');

module.exports = {
    create: async (param, callback) => {
        try {
            // const rechargeModel = await Recharge.create({
            //     rechargeId: uuidv1(),
            //     userId: param.userId,
            //     amount: param.amount,
            //     exchangeRate: param.exchangeRate
            // });
    
            // if(!rechargeModel) {
            //     return callback(400, 'Bad Request: recharge not found', 400, null);
            // }
            // return callback(null,null,200, rechargeModel);

            return Recharge.sequelize.transaction(function (t) {
                
                // chain all your queries here. make sure you return them.
                return  Recharge.create({
                    rechargeId: uuidv1(),
                    userId: param.userId,
                    amount: param.amount,
                    exchangeRate: param.exchangeRate
                }, {transaction: t}).then( (recharge) => {
                    console.log(recharge.userId);
                    return User.findOne({
                        where: {
                            userId: recharge.userId
                        },
                    }, {transaction: t}).then( (user) => {
                        if(!user) {
                            const totalECoin = recharge.amount / recharge.exchangeRate;
                            console.log('totalECoin -----' + totalECoin);
                            return  User.create({
                                userId: recharge.userId,
                                eCoin: totalECoin
                            }, {transaction: t});
                        } else {
                            console.log(user.eCoin);
                            console.log(user.userId);
                            const totalECoin = (recharge.amount / recharge.exchangeRate) + (user.eCoin ? user.eCoin : 0);
                            return user.update({
                                eCoin: totalECoin
                            }, {transaction: t});
                        }
                    });
                    
                });

            }).then(function (result) {
                // Transaction has been committed
                // result is whatever the result of the promise chain returned to the transaction callback
                return callback(null,null,200, result);
            }).catch(function (err) {
                // Transaction has been rolled back
                // err is whatever rejected the promise chain returned to the transaction callback
                return callback(400, 'fail transaction', 400, null);
            });
        } catch (err) {
            return callback(521, 'system', 500, null);
        }
    }
};

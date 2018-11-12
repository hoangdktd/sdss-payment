const Recharge = require('../models/Recharge');
const RechargeManager = require('../managers/RechargeManager');
const OrderManager = require('../managers/OrderManager');
const UserManager = require('../managers/UserManager');
const uuidv1 = require('uuid/v1');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');

const PaymentController = () => {
    const recharge = async (req, res) => {
        // body is part of a form-data
        const { body } = req;
        await RechargeManager.create(
            {
                userId: body.userId,
                amount: body.amount,
                exchangeRate: body.exchangeRate
            },
            function (errorCode, errorMessage, httpCode, returnRechargeModel) {
                if (errorCode) {
                    return oRest.sendError(res, errorCode, errorMessage, httpCode);
                }
                var oResData = {};
                oResData.userId = returnRechargeModel.userId;
                oResData.eCoin = returnRechargeModel.eCoin;
                return oRest.sendSuccess(res, oResData, httpCode);
            }
        );
    };

    const buy_contents = async (req, res) => {
        // body is part of a form-data
        const { body } = req;
        const userPromises = [];
        console.log(body.listProducts);
        console.log(JSON.parse(body.listProducts));
        const listProducts = JSON.parse(body.listProducts);
        if (!body.listProducts || listProducts.length < 1) {
            return oRest.sendError(res, 400, 'errorMessage', 400);
        } else {
            await OrderManager.orderListProduct(
                {
                    userId: body.userId,
                    listProducts: listProducts
                },
                function (errorCode, errorMessage, httpCode, returnRechargeModel) {
                    if (errorCode) {
                        return oRest.sendError(res, errorCode, errorMessage, httpCode);
                    }
                    const oResData = {};
                    const user = UserManager.get({
                        userId: body.userId
                    }, function (errorCode, errorMessage, httpCode, returnUser) {
                        if (errorCode) {
                            return oRest.sendError(res, errorCode, errorMessage, httpCode);
                        }
                        oResData.userId = returnUser.userId;
                        oResData.eCoin = returnUser.eCoin;
                        return oRest.sendSuccess(res, oResData, httpCode);
                    });
                    
                }
            );
        }


        // return Order.sequelize.transaction(function (t) {
            
        //     userPromises.push(
        //         User.findOne({
        //             where: {
        //                 userId: order.buyerId
        //             },
        //         }, {transaction: t}).then( (user) => {
        //             if(!user) {
        //                 const totalECoin = 0 - order.price;
        //                 console.log(totalECoin);
        //                 return  User.create({
        //                     userId: order.buyerId,
        //                     eCoin: totalECoin
        //                 }, {transaction: t});
        //             } else {
        //                 console.log(user.eCoin);
        //                 console.log(user.userId);
        //                 const totalECoin = (user.eCoin ? user.eCoin : 0) - (order.price);
        //                 return user.update({
        //                     eCoin: totalECoin
        //                 }, {transaction: t});
        //             }
        //         })
        //     );

        //     // update ecoin for owner
        //     userPromises.push(
        //         User.findOne({
        //             where: {
        //                 userId: order.ownerId
        //             },
        //         }, {transaction: t}).then( (user) => {
        //             if(!user) {
        //                 const totalECoin = 0 + order.price;
        //                 console.log(totalECoin);
        //                 return  User.create({
        //                     userId: order.ownerId,
        //                     eCoin: totalECoin
        //                 }, {transaction: t});
        //             } else {
        //                 console.log(user.eCoin);
        //                 console.log(user.userId);
        //                 const totalECoin = (user.eCoin ? user.eCoin : 0) + (order.price);
        //                 return user.update({
        //                     eCoin: totalECoin
        //                 }, {transaction: t});
        //             }
        //         })
        //     );
        //     return Promise.all(userPromises);

        // }).then(function (result) {
        //     // Transaction has been committed
        //     // result is whatever the result of the promise chain returned to the transaction callback
        //     return callback(null,null,200, result);
        // }).catch(function (err) {
        //     // Transaction has been rolled back
        //     // err is whatever rejected the promise chain returned to the transaction callback
        //     return callback(400, 'fail transaction', 400, null);
        // });
    };

    return {
        recharge,
        buy_contents
    };
};

module.exports = PaymentController;

const sequelize = require('sequelize');
const Order = require('../models/Order');
const User = require('../models/User');
const uuidv1 = require('uuid/v1');

module.exports = {
    create: async (param, callback) => {
        try {
            return Order.sequelize.transaction(function (t) {
                
                // chain all your queries here. make sure you return them.
                return  Order.create({
                    orderId: uuidv1(),
                    productId: param.productId,
                    productName: param.productName,
                    price: param.price,
                    ownerId: param.ownerId,
                    buyerId: param.buyerId,
                    orderDate: sequelize.fn("NOW"),
                    orderStatus: 'done'
                }, {transaction: t}).then( (order) => {
                    console.log(order.userId);
                    const userPromises = [];

                    // update ecoin for buyer
                    userPromises.push(
                        User.findOne({
                            where: {
                                userId: order.buyerId
                            },
                        }, {transaction: t}).then( (user) => {
                            if(!user) {
                                const totalECoin = 0 - order.price;
                                console.log(totalECoin);
                                return  User.create({
                                    userId: order.buyerId,
                                    eCoin: totalECoin
                                }, {transaction: t});
                            } else {
                                console.log(user.eCoin);
                                console.log(user.userId);
                                const totalECoin = (user.eCoin ? user.eCoin : 0) - (order.price);
                                return user.update({
                                    eCoin: totalECoin
                                }, {transaction: t});
                            }
                        })
                    );

                    // update ecoin for owner
                    userPromises.push(
                        User.findOne({
                            where: {
                                userId: order.ownerId
                            },
                        }, {transaction: t}).then( (user) => {
                            if(!user) {
                                const totalECoin = 0 + order.price;
                                console.log(totalECoin);
                                return  User.create({
                                    userId: order.ownerId,
                                    eCoin: totalECoin
                                }, {transaction: t});
                            } else {
                                console.log(user.eCoin);
                                console.log(user.userId);
                                const totalECoin = (user.eCoin ? user.eCoin : 0) + (order.price);
                                return user.update({
                                    eCoin: totalECoin
                                }, {transaction: t});
                            }
                        })
                    );
                    return Promise.all(userPromises);
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
    },

    orderListProduct: async (params, callback) => {
        try {
            return Order.sequelize.transaction(function (t) {
                console.log('start transaction');
                const orderPromises = [];

                for (let i = 0; i < params.listProducts.length; i++) {
                    const childOrder = params.listProducts[i];
                    console.log(childOrder.ownerId);
                    console.log('childOrder.eCoinF   ----   ' + childOrder.eCoinF);
                    const newPromise = Order.create({
                        orderId: uuidv1(),
                        productId: childOrder.id,
                        productName: childOrder.name,
                        eCoinF: childOrder.eCoinF,
                        ownerId: childOrder.ownerId,
                        buyerId: params.userId,
                        orderDate: sequelize.fn("NOW"),
                        orderStatus: 'done'
                    }, {transaction: t});
                    if( childOrder.ownerId && params.userId !== childOrder.ownerId ) {
                        orderPromises.push(newPromise);
                    }
                }
                return Promise.all(orderPromises).then(function(orders) {
                    
                    const userPromises = [];
                    let totalPrice = 0;
                    const sanitizeListOrder = [];
                    for (let i = 0; i < orders.length; i++) {
                        const childOrder = orders[i];
                        console.log(childOrder.ownerId);
                        let indexOfItemInSanitizeList = -1;
                        for (let j = 0; j < sanitizeListOrder.length; j++) {
                            if (childOrder.ownerId && childOrder.ownerId === sanitizeListOrder[j].ownerId) {
                                sanitizeListOrder[j].eCoinF = sanitizeListOrder[j].eCoinF + childOrder.eCoinF;
                                indexOfItemInSanitizeList = j;
                                break;
                            }
                        }
                        if (indexOfItemInSanitizeList === -1) {
                            sanitizeListOrder.push(childOrder);
                        }
                    }
                    for (let i = 0; i < sanitizeListOrder.length; i++) {
                        const order = sanitizeListOrder[i];
                        totalPrice = totalPrice + order.eCoinF;
                        // update ecoin for owner
                        userPromises.push(
                            User.findOne({
                                where: {
                                    userId: order.ownerId
                                },
                            }, {transaction: t}).then( (user) => {
                                if(!user) {
                                    const totalECoin = 0 + order.eCoinF;
                                    console.log('create owner user  ' + order.ownerId + '   coin ====  ' + totalECoin);
                                    return  User.create({
                                        userId: order.ownerId,
                                        eCoin: totalECoin
                                    }, {transaction: t});
                                } else {
                                    const totalECoin = (user.eCoin ? user.eCoin : 0) + (order.eCoinF);
                                    console.log('update owner user  ' + order.ownerId + '   coin ====  ' + totalECoin);
                                    return user.update({
                                        eCoin: totalECoin
                                    }, {transaction: t});
                                }
                            })
                        );
                    }

                    // update ecoin for buyer
                    userPromises.push(
                        User.findOne({
                            where: {
                                userId: params.userId
                            },
                        }, {transaction: t}).then( (user) => {
                            if(!user) {
                                const totalECoin = 0 - totalPrice;
                                console.log('create new user  ' + params.userId + '   coin ====  ' + totalECoin);
                                return  User.create({
                                    userId: params.userId,
                                    eCoin: totalECoin
                                }, {transaction: t});
                            } else {
                                const totalECoin = (user.eCoin ? user.eCoin : 0) - (totalPrice);
                                console.log('update user  ' + params.userId + '   coin ====  ' + totalECoin);
                                return user.update({
                                    eCoin: totalECoin
                                }, {transaction: t});
                            }
                        })
                    );
                    
                    return Promise.all(userPromises);
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

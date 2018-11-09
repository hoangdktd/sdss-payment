const Recharge = require('../models/Recharge');
const RechargeManager = require('../manager/RechargeManager');
const uuidv1 = require('uuid/v1');
const oRest = require('../utils/restware');
const oConstant = require('../utils/constant');

const PaymentController = () => {
    const buyContents = async (req, res) => {
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

    return {
        buyContents
    };
};

module.exports = PaymentController;

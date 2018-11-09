const Recharge = require('../models/Recharge');
const uuidv1 = require('uuid/v1');

const RechargeController = () => {
    const create = async (req, res) => {
        // body is part of a form-data
        const { body } = req;
    
        try {
            const rechargeModel = await Recharge.create({
                rechargeId: uuidv1(),
                userId: body.userId,
                amount: body.amount,
                exchangeRate: body.exchangeRate
            });
    
            if(!rechargeModel) {
                return res.status(400).json({ msg: 'Bad Request: recharge not found' });
            }
    
            return res.status(200).json({ rechargeModel: rechargeModel });
        } catch (err) {
            // better save it to log file
            console.error(err);
    
            return res.status(500).json({ msg: 'Internal server error' });
        }
    };

    return {
        create
    };
};

module.exports = RechargeController;

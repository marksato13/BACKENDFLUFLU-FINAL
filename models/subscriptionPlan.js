const db = require('../config/config');

const SubscriptionPlan = {};

SubscriptionPlan.findAll = () => {
    const sql = `SELECT * FROM subscription_plans`;
    return db.manyOrNone(sql);
};

SubscriptionPlan.findById = (id) => {
    const sql = `SELECT * FROM subscription_plans WHERE id = $1`;
    return db.oneOrNone(sql, id);
};

module.exports = SubscriptionPlan;

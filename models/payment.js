const db = require('../config/config');
const Subscription = require('./subscription');
const User = require('./user');
const SubscriptionPlan = require('./subscriptionPlan');

const Payment = {};

Payment.create = async (id_user, id_subscription, amount, payment_method, transaction_id) => {
    try {
        console.log("Insertando amount en la base de datos:", amount);
        if (isNaN(amount) || amount === null) {
            throw new Error('El valor de amount debe ser un número válido.');
        }
        const paymentSql = `
            INSERT INTO payments (
                id_user,
                id_subscription,
                amount,
                payment_method,
                payment_date,
                status,
                transaction_id,
                created_at,
                updated_at
            ) VALUES (
                $1, $2, $3, $4, NOW(), 'completed', $5, NOW(), NOW()
            ) RETURNING id
        `;
        const payment = await db.one(paymentSql, [id_user, id_subscription, amount, payment_method, transaction_id]);
        await Subscription.activate(id_subscription);
        const subscription = await db.one(`SELECT id_plan FROM subscriptions WHERE id = $1`, [id_subscription]);
        const plan = await SubscriptionPlan.findById(subscription.id_plan);
        await User.updateSubscriptionStatus(id_user, true, plan.name);
        return payment;
    } catch (error) {
        throw new Error(`Error al registrar el pago y activar la suscripción: ${error.message}`);
    }
};

module.exports = Payment;

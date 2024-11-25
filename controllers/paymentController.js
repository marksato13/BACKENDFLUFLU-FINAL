const Payment = require('../models/payment');
const Subscription = require('../models/subscription');
const User = require('../models/user');

module.exports = {

    async create(req, res, next) {
        try {
            const { id_user, id_subscription, amount, payment_method, transaction_id } = req.body;
            console.log("Valor de amount recibido en el backend:", amount);
            const subscription = await Subscription.findById(id_subscription);
            if (!subscription || subscription.id_user !== Number(id_user)) {
                return res.status(404).json({
                    success: false,
                    message: 'Suscripción no encontrada o no pertenece al usuario',
                });
            }
            const payment = await Payment.create(id_user, id_subscription, amount, payment_method, transaction_id);
            return res.status(201).json({
                success: true,
                message: 'Pago registrado y suscripción activada correctamente',
                data: payment,
            });
        } catch (error) {
            console.error('Error al registrar el pago:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al registrar el pago',
                error: error.message,
            });
        }
    },
};

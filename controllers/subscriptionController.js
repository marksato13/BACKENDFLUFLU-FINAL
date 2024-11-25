const Subscription = require('../models/subscription');
const SubscriptionPlan = require('../models/subscriptionPlan');

module.exports = {

    async create(req, res, next) {
        try {
            // Asegúrate de convertir id_user y id_plan a enteros
            const id_user = parseInt(req.body.id_user, 10);
            const id_plan = parseInt(req.body.id_plan, 10);
    
            if (isNaN(id_user) || isNaN(id_plan)) {
                return res.status(400).json({
                    success: false,
                    message: 'id_user o id_plan no son válidos',
                });
            }
    
            const plan = await SubscriptionPlan.findById(id_plan);
            if (!plan) {
                return res.status(404).json({
                    success: false,
                    message: 'Plan de suscripción no encontrado',
                });
            }
    
            const subscription = await Subscription.create(id_user, id_plan, plan.duration_in_months);
            return res.status(201).json({
                success: true,
                message: 'Suscripción creada correctamente',
                data: subscription.id,
            });
        } catch (error) {
            console.error('Error al crear la suscripción:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al crear la suscripción',
                error: error.message,
            });
        }
    },
    
    async checkActiveSubscription(req, res, next) {
        try {
            const { id_user } = req.params;
            const subscription = await Subscription.findActiveByUserId(id_user);
            if (!subscription) {
                return res.status(404).json({
                    success: false,
                    message: 'El usuario no tiene una suscripción activa',
                });
            }
            return res.status(200).json({
                success: true,
                data: subscription,
            });
        } catch (error) {
            console.error('Error al verificar la suscripción activa:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al verificar la suscripción activa',
                error: error.message,
            });
        }
    },
};

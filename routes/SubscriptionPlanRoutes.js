const SubscriptionPlanController = require('../controllers/subscriptionPlanController'); 

module.exports = (app) => {
    app.get('/api/subscription-plans/getAll', SubscriptionPlanController.getAll);  
    app.get('/api/subscription-plans/:id', SubscriptionPlanController.getById);
};

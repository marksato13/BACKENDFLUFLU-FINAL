const SubscriptionController = require('../controllers/subscriptionController'); 

module.exports = (app) => {
    app.post('/api/subscriptions/create', SubscriptionController.create);
    app.get('/api/subscriptions/active/:id_user', SubscriptionController.checkActiveSubscription);
};

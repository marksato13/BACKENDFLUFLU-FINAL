const PaymentController = require('../controllers/paymentController'); 

module.exports = (app) => {
    app.post('/api/payments/create', PaymentController.create);
};

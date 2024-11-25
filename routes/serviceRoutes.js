const ServiceController = require('../controllers/serviceController');

module.exports = (app) => {
    app.post('/api/services/create', ServiceController.create);
    app.get('/api/services/getAll', ServiceController.getAll);
    app.get('/api/services/:id', ServiceController.findById);
    app.put('/api/services/update/:id', ServiceController.update);
    app.delete('/api/services/delete/:id', ServiceController.delete);
};

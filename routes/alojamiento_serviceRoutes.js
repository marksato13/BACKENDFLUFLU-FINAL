const AlojamientoHasServicesController = require('../controllers/alojamientoHasServicesController');

module.exports = (app) => {
    app.post('/api/alojamiento-services/create', AlojamientoHasServicesController.create);
    app.get('/api/alojamiento-services/:id_alojamiento', AlojamientoHasServicesController.findByAlojamientoId);
    app.delete('/api/alojamiento-services/delete/:id_alojamiento/:id_service', AlojamientoHasServicesController.delete);
};

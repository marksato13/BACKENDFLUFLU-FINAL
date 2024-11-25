const AlojamientoController = require('../controllers/alojamientoController');

module.exports = (app, upload) => {
    app.get('/api/alojamientos/getAll', AlojamientoController.getAll);
    app.get('/api/alojamientos/user/:id_user', AlojamientoController.findByUserId);
    app.post('/api/alojamientos/create', upload.array('images', 3), AlojamientoController.createAlojamiento);
    app.delete('/api/alojamientos/delete/:id', AlojamientoController.delete);
    app.get('/api/alojamientos/getAllGuest', AlojamientoController.getAllGuest);
    app.get('/api/alojamientos/filter', AlojamientoController.findByFilters);
};

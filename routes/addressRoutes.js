const AddressController = require('../controllers/addressController'); 

module.exports = (app) => {
    app.post('/api/address/create', AddressController.create);
    app.get('/api/address/findByUser/:id_user', AddressController.findByUserId);
    app.delete('/api/address/delete/:id', AddressController.delete);
};

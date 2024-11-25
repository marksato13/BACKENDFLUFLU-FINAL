const CategoriaController = require('../controllers/categoriaController');

module.exports = (app) => {
    app.post('/api/categorias/create', CategoriaController.create);
    app.get('/api/categorias/getAll', CategoriaController.getAll);
    app.get('/api/categorias/:id', CategoriaController.findById);
    app.put('/api/categorias/update/:id', CategoriaController.update);
    app.delete('/api/categorias/delete/:id', CategoriaController.delete);
};

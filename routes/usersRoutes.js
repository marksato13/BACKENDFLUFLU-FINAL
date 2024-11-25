const UsersController = require('../controllers/usersController'); 

module.exports = (app, upload) => {
    app.get('/api/users/getAll', UsersController.getAll);
    app.post('/api/users/login', UsersController.login);
    app.post('/api/users/assignRole', UsersController.assignRole);
    app.post('/api/users/create', upload.array('image', 1), UsersController.registerWithImage);
    app.post('/api/users/login', UsersController.login);
    app.post('/api/users/logout', UsersController.logout);
};

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Configuración de Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Configuración de multer para subida de imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


/*
* Importamos las rutas
*/
const users = require('./routes/usersRoutes');
const addressRoutes = require('./routes/addressRoutes');  
const alojamientos = require('./routes/alojamientoRoutes');  
const servicesRoutes = require('./routes/serviceRoutes');  
const alojamientoHasServicesRoutes = require('./routes/alojamiento_serviceRoutes');  
const categoriaRoutes = require('./routes/categoriaRoutes'); 

const subscriptionPlanRoutes = require('./routes/SubscriptionPlanRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.disable('x-powered-by');
app.set('port', port);

users(app, upload);
alojamientos(app, upload);         
addressRoutes(app);                
servicesRoutes(app);                     
alojamientoHasServicesRoutes(app);        
categoriaRoutes(app);  

subscriptionPlanRoutes(app);
subscriptionRoutes(app);
paymentRoutes(app);


server.listen(port, '192.168.56.1' || 'localhost', function() {
    console.log('fluflu' + port + ' Iniciada ...');
});


app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
};

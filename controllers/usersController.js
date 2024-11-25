const User = require('../models/user');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const keys = require('../config/Keys');
const storage = require('../utils/cloud_storage');

module.exports = {

    async getAll(req, res, next) {
        try {
            const data = await User.getAll();
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },

    async register(req, res, next) {
        try {
            const user = req.body;
            const data = await User.create(user);
            await Rol.create(data.id, 1);
            console.log('Datos de usuario creados:', data);
            return res.status(201).json({
                success: true,
                message: 'Usuario creado correctamente',
                data: data.id
            });
        } catch (error) {
            console.log('Error al crear usuario:', error);
            return res.status(501).json({
                success: false,
                message: 'Error ',
                error: error
            });
        }
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const myUser = await User.findByEmail(email);
            if (!myUser) {
                return res.status(401).json({ success: false, message: 'El email no fue encontrado' });
            }
            if (User.isPasswordMatched(password, myUser.password)) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey);
                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                };
                console.log(`USUARIO ENVIADO ${data}`);
                return res.status(201).json({
                    success: true,
                    data: data,
                    message: 'El usuario ha sido autenticado'
                });
            } else {
                return res.status(401).json({ success: false, message: 'La contraseña es incorrecta' });
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento de hacer login',
                error: error
            });
        }
    },

    async logout(req, res, next) {
        try {
            const id = req.body.id;
            await User.updateToken(id, null);
            return res.status(201).json({
                success: true,
                message: 'La sesion del usuario se ha cerrado correctamente'
            });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento de cerrar sesion',
                error: error
            });
        }
    },

    async registerWithImage(req, res, next) {
        try {
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario: ${user}`);
            const files = req.files;
            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`;
                const url = await storage(files[0], pathImage);
                if (url != undefined && url != null) {
                    user.image = url;
                }
            }
            const data = await User.create(user);
            await Rol.create(data.id, 1);
            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente, ahora inicia sesion',
                data: data.id
            });
        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: error
            });
        }
    },

    async assignRole(req, res, next) {
        try {
            const { id_user, id_rol } = req.body;
            const hasRole = await User.hasRole(id_user, id_rol);
            if (hasRole) {
                return res.status(400).json({
                    success: false,
                    message: 'El usuario ya tiene este rol'
                });
            }
            await Rol.create(id_user, id_rol);
            return res.status(201).json({
                success: true,
                message: 'El nuevo rol ha sido asignado exitosamente'
            });
        } catch (error) {
            console.log(`Error al asignar el rol: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al asignar el rol',
                error: error
            });
        }
    },



};

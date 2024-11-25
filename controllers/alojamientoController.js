const Alojamiento = require("../models/alojamiento");
const AlojamientoHasServices = require("../models/alojamientoHasServices");
const Address = require("../models/address");
const Categoria = require("../models/categoria");
const storage = require('../utils/cloud_storage');


module.exports = {

    async createAlojamiento(req, res) {
        try {
            const {
                id_user,
                direccion,
                neighborhood,
                lat,
                lng,
                place_id,
                pais,
                estado,
                ciudad,
                codigo_postal,
                id_categoria, // Cambiado de nombre_categoria a id_categoria
                //nombre_categoria, 
                nombre_alojamiento,
                descripcion,
                precio,
                services
            } = req.body;

            // Validación de campos obligatorios
            if (!id_user || !direccion || !id_categoria || !nombre_alojamiento || !descripcion || !precio) {
                return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
            }


            // Procesar imágenes subidas
            const files = req.files;
            let imageUrls = [];
            if (files && files.length > 0) {
                const uploadPromises = files.map((file) => {
                    const pathImage = `alojamiento_${Date.now()}`;
                    return storage(file, pathImage);
                });
                imageUrls = await Promise.all(uploadPromises);
            }

            // Crear dirección en la base de datos
            const address = await Address.create({
                id_user,
                direccion,
                neighborhood,
                lat,
                lng,
                place_id,
                pais,
                estado,
                ciudad,
                codigo_postal,
                created_at: new Date(),
                updated_at: new Date(),
            });
            if (!address || !address.id) {
                return res.status(500).json({ success: false, message: 'No se pudo crear la dirección.' });
            }

            const alojamiento = await Alojamiento.create({
                id_user,
                nombre: nombre_alojamiento,
                descripcion,
                precio,
                direccion_id: address.id,
                id_categoria, // Utiliza directamente el ID recibido
                image1: imageUrls[0] || null,
                image2: imageUrls[1] || null,
                image3: imageUrls[2] || null,
                created_at: new Date(),
                updated_at: new Date(),
            });

            if (!id_categoria) {
                return res.status(400).json({ success: false, message: 'El ID de la categoría es obligatorio.' });
            }



            // Asociar servicios
            if (services) {
                const serviceIds = services.split(',').map(id => parseInt(id.trim()));
                for (let serviceId of serviceIds) {
                    await AlojamientoHasServices.create(alojamiento.id, serviceId);
                }
            }

            res.status(201).json({
                success: true,
                message: 'Alojamiento creado correctamente.',
                data: alojamiento,
            });
        } catch (error) {
            console.error('Error al crear alojamiento:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor.',
                error: error.message,
            });
        }
    },

    async findByFilters(req, res) {
        try {
            const { categoriaId, serviceIds } = req.query;
            const parsedServiceIds = serviceIds
                ? serviceIds.split(",").map((id) => parseInt(id.trim()))
                : [];

            const alojamientos = await Alojamiento.findByFilters(
                categoriaId ? parseInt(categoriaId) : null,
                parsedServiceIds
            );

            return res.status(200).json({
                success: true,
                message: "Alojamientos filtrados correctamente",
                data: alojamientos,
            });
        } catch (error) {
            console.error("Error al filtrar alojamientos:", error);
            return res.status(500).json({
                success: false,
                message: "Error al filtrar alojamientos",
                error: error.message,
            });
        }
    },


    async findByUserId(req, res, next) {
        try {
            const data = await Alojamiento.findByUserId(req.params.id_user);
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error al obtener alojamientos por usuario:", error);
            return res.status(501).json({
                success: false,
                message: "Error al obtener los alojamientos del usuario",
                error: error,
            });
        }
    },

    async update(req, res, next) {
        try {
            const alojamiento = req.body;

            if (!alojamiento.id) {
                return res.status(400).json({ success: false, message: 'El ID del alojamiento es obligatorio.' });
            }

            await Alojamiento.update(alojamiento);

            return res.status(200).json({ success: true, message: 'Alojamiento actualizado correctamente.' });
        } catch (error) {
            console.error('Error al actualizar alojamiento:', error);
            return res.status(500).json({ success: false, message: 'Error al actualizar el alojamiento.', error });
        }
    },

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            await Alojamiento.delete(id);
            return res.status(200).json({
                success: true,
                message: "Alojamiento eliminado correctamente",
            });
        } catch (error) {
            console.error("Error al eliminar alojamiento:", error);
            return res.status(501).json({
                success: false,
                message: "Error al eliminar el alojamiento",
                error: error,
            });
        }
    },

    async getAll(req, res, next) {
        try {
            const alojamientos = await Alojamiento.findAll();

            for (let alojamiento of alojamientos) {
                const services = await AlojamientoHasServices.findByAlojamientoId(
                    alojamiento.id
                );
                alojamiento.services = services;
            }

            return res.status(200).json(alojamientos);
        } catch (error) {
            console.error("Error al obtener alojamientos:", error);
            return res.status(501).json({
                success: false,
                message: "Error al obtener los alojamientos",
                error: error,
            });
        }
    },

    async getAllGuest(req, res, next) {
        try {
            const data = await Alojamiento.findAll({
                attributes: ["id", "nombre", "descripcion", "precio", "image1"],
            });
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error al obtener alojamientos para invitados:", error);
            return res.status(501).json({
                success: false,
                message: "Error al obtener alojamientos para invitados",
                error: error,
            });
        }
    },
};

const Service = require('../models/service');

module.exports = {
    
    async create(req, res, next) {
        try {
            const service = req.body;
            const data = await Service.create(service);
            return res.status(201).json({
                success: true,
                message: 'service creada correctamente',
                data: data.id
            });
        } catch (error) {
            console.error('Error al crear la service:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al crear la service',
                error: error
            });
        }
    },

    async getAll(req, res, next) {
        try {
            const data = await Service.findAll();
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error al obtener los servicios:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los servicios',
                error: error
            });
        }
    },

    async findById(req, res, next) {
        try {
            const data = await Service.findById(req.params.id);
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error al obtener la service:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener la service',
                error: error
            });
        }
    },

    async update(req, res, next) {
        try {
            const service = req.body;
            await Service.update(service);
            return res.status(200).json({
                success: true,
                message: 'service actualizada correctamente'
            });
        } catch (error) {
            console.error('Error al actualizar la service:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al actualizar la service',
                error: error
            });
        }
    },

    async delete(req, res, next) {
        try {
            await Service.delete(req.params.id);
            return res.status(200).json({
                success: true,
                message: 'service eliminada correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar la service:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al eliminar la service',
                error: error
            });
        }
    }
};



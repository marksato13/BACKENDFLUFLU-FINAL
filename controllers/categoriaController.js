const Categoria = require('../models/categoria');

module.exports = {

    async create(req, res, next) {
        try {
            const categoria = req.body;
            const data = await Categoria.create(categoria);
            return res.status(201).json({
                success: true,
                message: 'Categoría creada correctamente',
                data: data.id
            });
        } catch (error) {
            console.error('Error al crear la categoría:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al crear la categoría',
                error: error
            });
        }
    },

    async getAll(req, res) {
        try {
            const data = await Categoria.findAll();
            return res.status(200).json({
                success: true,
                data: data
            });
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener las categorías',
                error: error
            });
        }
    },

    async findById(req, res, next) {
        try {
            const data = await Categoria.findById(req.params.id);
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error al obtener la categoría:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener la categoría',
                error: error
            });
        }
    },

    async update(req, res, next) {
        try {
            const categoria = req.body;
            await Categoria.update(categoria);
            return res.status(200).json({
                success: true,
                message: 'Categoría actualizada correctamente'
            });
        } catch (error) {
            console.error('Error al actualizar la categoría:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al actualizar la categoría',
                error: error
            });
        }
    },

    async delete(req, res, next) {
        try {
            await Categoria.delete(req.params.id);
            return res.status(200).json({
                success: true,
                message: 'Categoría eliminada correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al eliminar la categoría',
                error: error
            });
        }
    }
};

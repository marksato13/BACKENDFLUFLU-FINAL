const Address = require('../models/address'); 

module.exports = {
  

    async create(req, res, next) {
    try {
        const address = req.body; 

        const data = await Address.create(address);

        return res.status(201).json({
            success: true,
            message: 'Dirección creada correctamente',
            data: data.id
        });
    } catch (error) {
        console.error('Error al crear dirección:', error);
        return res.status(501).json({
            success: false,
            message: 'Error al crear la dirección',
            error: error
        });
    }
    },

    async getAll(req, res) {
        try {
            const data = await Address.findAll();
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error al obtener direcciones:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener las direcciones',
                error: error
            });
        }
    },

    async findByUserId(req, res) {
        try {
            const data = await Address.findByUserId(req.params.id_user);
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error al obtener direcciones por usuario:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener las direcciones del usuario',
                error: error
            });
        }
    },

    async delete(req, res) {
        try {
            const id = req.params.id;
            await Address.delete(id);
            return res.status(200).json({
                success: true,
                message: 'Dirección eliminada correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar dirección:', error);
            return res.status(501).json({
                success: false,
                message: 'Error al eliminar la dirección',
                error: error
            });
        }
    }
};

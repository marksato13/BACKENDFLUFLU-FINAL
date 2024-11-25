const db = require('../config/config');

const AlojamientoHasServices = {};

AlojamientoHasServices.create = (id_alojamiento, id_service) => {
    const sql = `
        INSERT INTO alojamiento_has_services (id_alojamiento, id_service)
        VALUES ($1, $2)
    `;
    return db.none(sql, [id_alojamiento, id_service]); // Quitamos el RETURNING id
};

AlojamientoHasServices.findByAlojamientoId = (idAlojamiento) => {
    const sql = `
        SELECT C.*
        FROM services AS C
        JOIN alojamiento_has_services AS AHC ON C.id = AHC.id_service
        WHERE AHC.id_alojamiento = $1
    `;
    return db.manyOrNone(sql, [idAlojamiento]);
};

AlojamientoHasServices.delete = (idAlojamiento, idService) => {
    const sql = `
        DELETE FROM alojamiento_has_services
        WHERE id_alojamiento = $1 AND id_service = $2
    `;
    return db.none(sql, [idAlojamiento, idService]);
};

module.exports = AlojamientoHasServices;



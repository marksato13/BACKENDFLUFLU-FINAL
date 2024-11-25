const db = require('../config/config');

const Address = {};

Address.create = (data) => {
    const sql = `
      INSERT INTO address (
        id_user, direccion, neighborhood, lat, lng, place_id, pais, estado, ciudad, codigo_postal, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id
    `;
    return db.one(sql, [
      data.id_user,
      data.direccion,
      data.neighborhood,
      data.lat,
      data.lng,
      data.place_id,
      data.pais,
      data.estado,
      data.ciudad,
      data.codigo_postal,
      data.created_at,
      data.updated_at,
    ]);
  };

Address.findAll = () => {
    const sql = `SELECT * FROM address`;
    return db.manyOrNone(sql);
};

Address.findByUserId = (id_user) => {
    const sql = `SELECT * FROM address WHERE id_user = $1`;
    return db.manyOrNone(sql, id_user);
};

Address.delete = (id) => {
    const sql = `DELETE FROM address WHERE id = $1`;
    return db.none(sql, id);
};

module.exports = Address;

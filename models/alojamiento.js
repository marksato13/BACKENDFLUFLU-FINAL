const db = require("../config/config");

const Alojamiento = {};

Alojamiento.create = (data) => {
  const sql = `
        INSERT INTO alojamientos (
          id_user, nombre, descripcion, precio, direccion_id, id_categoria, image1, image2, image3, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
      `;

  return db.one(sql, [
    data.id_user,
    data.nombre,
    data.descripcion,
    data.precio,
    data.direccion_id,
    data.id_categoria,
    data.image1 || null,
    data.image2 || null,
    data.image3 || null,
    data.created_at || new Date(),
    data.updated_at || new Date(),
  ]);
};

Alojamiento.findByFilters = (categoriaId = null, serviceIds = []) => {
  let sql = `
        SELECT a.*
        FROM alojamientos AS a
        LEFT JOIN categorias AS c ON a.id_categoria = c.id
        LEFT JOIN alojamiento_has_services AS ahs ON a.id = ahs.id_alojamiento
        LEFT JOIN services AS s ON ahs.id_service = s.id
    `;

  const conditions = [];
  const params = [];

  // Filtrar por categoría
  if (categoriaId) {
    conditions.push(`c.id = $${params.length + 1}`);
    params.push(categoriaId);
  }

  // Filtrar por servicios
  if (serviceIds.length > 0) {
    const serviceConditions = serviceIds.map(
      (_, index) => `s.id = $${params.length + 1 + index}`
    );
    conditions.push(`(${serviceConditions.join(" OR ")})`);
    params.push(...serviceIds);
  }

  // Agregar condiciones
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += `
    GROUP BY a.id
  `;

  // Validar si todos los servicios deben coincidir
  if (serviceIds.length > 1) {
    sql += ` HAVING COUNT(DISTINCT s.id) = $${params.length + 1}`;
    params.push(serviceIds.length);
  }

  return db.manyOrNone(sql, params);
};


Alojamiento.findAll = () => {
  const sql = `
        SELECT 
            A.*, 
            D.direccion, 
            D.neighborhood, 
            D.lat, 
            D.lng,
            C.nombre AS categoria_nombre  -- Obtenemos el nombre de la categoría
        FROM alojamientos AS A
        JOIN address AS D ON A.direccion_id = D.id
        LEFT JOIN categorias AS C ON A.id_categoria = C.id  -- Unimos con la tabla de categorías
    `;

  return db.manyOrNone(sql);
};

Alojamiento.findByUserId = (id_user) => {
  const sql = `
        SELECT 
            A.*, 
            D.direccion, 
            D.neighborhood, 
            D.lat, 
            D.lng 
        FROM alojamientos AS A
        JOIN address AS D ON A.direccion_id = D.id
        WHERE A.id_user = $1
    `;

  return db.manyOrNone(sql, id_user);
};

Alojamiento.delete = (id) => {
  const sql = `
        DELETE FROM alojamientos
        WHERE id = $1
    `;

  return db.none(sql, id);
};

module.exports = Alojamiento;

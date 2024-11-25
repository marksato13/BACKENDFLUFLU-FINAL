const db = require('../config/config'); 

const Categoria = {};

Categoria.create = (categoria) => {
    const sql = `
        INSERT INTO categorias (
            nombre,
            created_at,
            updated_at
        ) VALUES ($1, $2, $3) RETURNING id
    `;
    return db.oneOrNone(sql, [
        categoria.nombre,
        new Date(),
        new Date()
    ]);
};

Categoria.findByName = (name) => {
    const sql = `SELECT id FROM categorias WHERE nombre = $1`;
    return db.oneOrNone(sql, [name]);
};

Categoria.findAll = () => {
    const sql = `SELECT * FROM categorias`;
    return db.manyOrNone(sql);
};



















// Obtener una categoría por ID
Categoria.findById = (id) => {
    const sql = `SELECT * FROM categorias WHERE id = $1`;
    return db.oneOrNone(sql, id);
};

// Actualizar una categoría
Categoria.update = (categoria) => {
    const sql = `
        UPDATE categorias SET
            nombre = $2,
            updated_at = $3
        WHERE id = $1
    `;
    return db.none(sql, [
        categoria.id,
        categoria.nombre,
        new Date()
    ]);
};

// Eliminar una categoría
Categoria.delete = (id) => {
    const sql = `DELETE FROM categorias WHERE id = $1`;
    return db.none(sql, id);
};

module.exports = Categoria;

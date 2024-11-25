const db = require('../config/config');
const crypto = require('crypto');

const User = {};

User.getAll = () => {
    const sql = `
    SELECT
        *
    FROM
        users
    `;
    return db.manyOrNone(sql);
};

User.findById = (id, callback) => {
    const sql = `
    SELECT
        id,
        email,
        name,
        lastname,
        image,
        phone,
        password,
        session_token
    FROM
        users
    WHERE
        id = $1`;
    //------------------- Ejecuta la consulta y llama al callback con el usuario encontrado o null -------------------
    return db.oneOrNone(sql, id).then(user => { callback(null, user); });
}

User.findByEmail = (email) => {
    const sql = `
    SELECT
        U.id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.password,
        U.session_token,
        json_agg(
            json_build_object(
                'id', R.id,
                'name', R.name,
                'image', R.image,
                'route', R.route
            )
        ) AS roles
    FROM 
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        R.id = UHR.id_rol
    WHERE
        U.email = $1
    GROUP BY
        U.id
    `;
    //------------------- Ejecuta la consulta para obtener el usuario y sus roles -------------------
    return db.oneOrNone(sql, email);
}

User.create = (user) => {
    // Hashea la contraseña del usuario usando MD5
    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHashed;

    const sql = `
    INSERT INTO users (
        email,
        name,
        lastname,
        phone,
        image,
        password,
        created_at,
        updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `;
    //------------------- Ejecuta la consulta para crear el usuario y devuelve el ID -------------------
    return db.oneOrNone(sql, [
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        user.password,
        new Date(),
        new Date()
    ]);
}

User.isPasswordMatched = (userPassword, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    return myPasswordHashed === hash;
}

User.hasRole = (id_user, id_rol) => {
    const sql = `
    SELECT * FROM user_has_roles
    WHERE id_user = $1 AND id_rol = $2
    `;
    return db.oneOrNone(sql, [id_user, id_rol]); 
};













// Actualizar el estado de suscripción del usuario
User.updateSubscriptionStatus = (id, hasActiveSubscription, currentPlan) => {
    const sql = `
        UPDATE users
        SET has_active_subscription = $2,
            current_plan = $3,
            updated_at = NOW()
        WHERE id = $1
    `;
    return db.none(sql, [id, hasActiveSubscription, currentPlan]);
};

















// Verificar si la contraseña coincide con el hash almacenado
User.isPasswordMatched = (userPassword, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    return myPasswordHashed === hash;
};

// Verificar si el usuario tiene un rol específico
User.hasRole = (id_user, id_rol) => {
    const sql = `
        SELECT * FROM user_has_roles
        WHERE id_user = $1 AND id_rol = $2
    `;
    return db.oneOrNone(sql, [id_user, id_rol]);
};










//------------------- Exporta el objeto User para su uso en otros módulos -------------------
module.exports = User;

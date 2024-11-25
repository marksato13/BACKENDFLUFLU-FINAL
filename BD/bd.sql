DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE roles(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	image VARCHAR(255) NULL, 
	route VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	name VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	phone VARCHAR(80) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	password VARCHAR(255) NOT NULL,
	is_available BOOLEAN NULL,
	session_token VARCHAR(255) NULL,
	notification_token VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS user_has_roles CASCADE;
CREATE TABLE user_has_roles(
	id_user BIGSERIAL NOT NULL,
	id_rol BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,	
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY(id_user, id_rol)
);

------------------------------

INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'ESTUDIANTE',
	'client/estudiante/list',
	'2024-08-30',
	'2024-08-30'
);

INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'ARRENDADOR',
	'arrendador/arrendador/list',
	'2024-08-30',
	'2024-08-30'
);

INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'ANDMIN',
	'admin/mark/list',
	'2024-08-30',
	'2024-08-30'
);

------------------


DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	description VARCHAR(255) NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);


DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	description VARCHAR(255) NOT NULL,
	price DECIMAL DEFAULT 0,
	image1 VARCHAR(255) NOT NULL,
	image2 VARCHAR(255) NULL,
	image3 VARCHAR(255) NULL,
	id_category BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address(
	id BIGSERIAL PRIMARY KEY,
	id_user BIGINT NOT NULL,
	address VARCHAR(255) NOT NULL,
	neighborhood VARCHAR(255) NOT NULL,
	lat DECIMAL DEFAULT 0,
	lng DECIMAL DEFAULT 0,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);


DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders(
	id BIGSERIAL PRIMARY KEY,
	id_client BIGINT NOT NULL,
	id_delivery BIGINT NULL,
	id_address BIGINT NOT NULL,
	lat DECIMAL DEFAULT 0,
	lng DECIMAL DEFAULT 0,
	status VARCHAR(90) NOT NULL,
	timestamp BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS order_has_products CASCADE;
CREATE TABLE order_has_products(
	id_order BIGINT NOT NULL,
	id_product BIGINT NOT NULL,
	quantity BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	PRIMARY KEY(id_order, id_product),
	FOREIGN KEY(id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
);

--------------------
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
    email = $1





/*   Tabla address:
Propósito: Almacenar direcciones asociadas a usuarios y alojamientos. Incluye datos como latitud, longitud y detalles para la integración con servicios de mapas como Google Maps.
Por qué se creó: Es necesaria para relacionar direcciones detalladas con usuarios y alojamientos, facilitando la geolocalización en la app.    */



/*    Tabla alojamientos:
Propósito: Almacenar información sobre los alojamientos registrados, como nombre, descripción, imágenes y precios.
Por qué se creó: Para gestionar las propiedades que los propietarios ofrecen en la plataforma, vinculando cada propiedad con la dirección y el usuario propietario.     */


/*    Tabla categorias:
Propósito: Almacenar las diferentes categorías de alojamientos (por ejemplo, "Departamento", "Habitación").
Por qué se creó: Para permitir la clasificación de los alojamientos en diferentes categorías y así facilitar la búsqueda por parte de los estudiantes.     */


/*    Tabla calificaciones:

Propósito: Almacenar las calificaciones y comentarios que los usuarios hacen sobre los alojamientos.
Por qué se creó: Para permitir a los estudiantes evaluar los alojamientos en los que se hospedan, proporcionando información valiosa a otros usuarios.     */



/*    Tabla favoritos:

Propósito: Permitir a los usuarios marcar ciertos alojamientos como favoritos para un acceso rápido posterior.
Por qué se creó: Para mejorar la experiencia del usuario, dándoles la opción de guardar alojamientos que les interesen.     */



/*    Tabla roomies:

Propósito: Almacenar las publicaciones de estudiantes que buscan compañeros de cuarto (roomies).
Por qué se creó: Para facilitar la búsqueda y publicación de roomies, permitiendo a los estudiantes compartir alojamiento.     */



/*    Tabla mensajes:

Propósito: Almacenar mensajes entre estudiantes y propietarios, facilitando la comunicación dentro de la plataforma.
Por qué se creó: Para implementar un sistema de mensajería en la plataforma, permitiendo que los interesados en un alojamiento se comuniquen con los propietarios.     */



/*    Tabla reservas:

Propósito: Registrar las reservas de alojamientos realizadas por los estudiantes, incluyendo fechas de inicio y fin.
Por qué se creó: Para gestionar las reservas de los alojamientos y asegurarse de que no haya conflictos en las fechas de alquiler.     */




/*    Tabla alojamiento_has_categorias:

Propósito: Definir la relación entre los alojamientos y sus categorías, permitiendo que un alojamiento pertenezca a múltiples categorías.
Por qué se creó: Para manejar de manera eficiente la relación muchos a muchos entre alojamientos y categorías.     */



/*     Tabla roles:

Propósito: Almacenar los roles del sistema (por ejemplo, "propietario", "estudiante").
Por qué se creó: Para gestionar los diferentes permisos y accesos que los usuarios tienen según su rol en la plataforma.    */



/*    Tabla users:
Propósito: Almacenar la información básica de los usuarios, como nombre, correo, teléfono, y su estado de disponibilidad.
Por qué se actualizó: Se añadió información adicional sobre suscripciones activas y el tipo de plan que tienen (por ejemplo, "Gratuito", "Premium").     */



/*   Tabla user_has_roles:
Propósito: Definir la relación muchos a muchos entre los usuarios y sus roles.
Por qué se creó: Para permitir que los usuarios tengan múltiples roles en la plataforma (por ejemplo, ser propietario y estudiante).      */



/*   Gestión de pagos y suscripciones:
      */



/*    Tabla subscriptions:
Propósito: Almacenar las suscripciones de los usuarios, incluyendo el tipo de plan, la fecha de inicio y fin de la suscripción.
Por qué se creó: Para gestionar el estado de las suscripciones de los usuarios (por ejemplo, si están en un plan premium o gratuito).     */



/*   Tabla subscription_plans:
Propósito: Definir los diferentes planes de suscripción disponibles en la plataforma.
Por qué se creó: Para ofrecer a los usuarios diferentes opciones de suscripción, como planes gratuitos o premium, con distintas duraciones y precios.      */



/*    Tabla payments:
Propósito: Registrar los pagos realizados por los usuarios para suscribirse a un plan.
Por qué se creó: Para gestionar los pagos realizados, almacenando detalles como el método de pago y el estado de la transacción.     */



/*    Actualización en la tabla users:
     */




/*     Actualización en la tabla users:
Por qué se actualizó:
Se agregó un campo has_active_subscription para indicar si el usuario tiene una suscripción activa, y otro campo current_plan para almacenar el tipo de plan actual (por ejemplo, "Gratuito" o "Premium").
Esto permite un acceso rápido a la información de suscripción directamente desde la tabla users, sin necesidad de consultar siempre la tabla subscriptions.



Rol de propietario:
Por qué se insertó:
Se creó el rol de propietario para gestionar las funciones exclusivas para usuarios que publican alojamientos.    */




/*         */


	-------------------------------------

	-- Tabla de direcciones (address)
CREATE TABLE address (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_user BIGINT NOT NULL,  -- Cambiado a id_user para coincidir con tu estructura
  direccion VARCHAR(255) NOT NULL,
  neighborhood VARCHAR(255),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  place_id VARCHAR(255),
  pais VARCHAR(100),
  estado VARCHAR(100),
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Cambiado a created_at
  updated_at TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE  -- Relacionado con users.id
);

-- Tabla de alojamientos (alojamientos)
CREATE TABLE alojamientos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_user BIGINT NOT NULL,  -- Cambiado a id_user para coincidir con tu estructura
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2),
  image1 VARCHAR(255),
  image2 VARCHAR(255),
  image3 VARCHAR(255),
  direccion_id BIGINT NOT NULL,  -- Relación con la tabla address
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Cambiado a created_at
  updated_at TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,  -- Relacionado con users.id
  FOREIGN KEY (direccion_id) REFERENCES address(id) ON DELETE CASCADE  -- Relacionado con address.id
);


CREATE TABLE services (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre VARCHAR(180) NOT NULL,
  descripcion VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP
);

CREATE TABLE calificaciones (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_user BIGINT NOT NULL,
  id_alojamiento BIGINT NOT NULL,
  calificacion INT CHECK (calificacion BETWEEN 1 AND 5),  -- Rango de 1 a 5 estrellas
  comentario TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(id) ON DELETE CASCADE
);

CREATE TABLE favoritos (
  id_user BIGINT NOT NULL,
  id_alojamiento BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_user, id_alojamiento),
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(id) ON DELETE CASCADE
);

CREATE TABLE roomies (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_user BIGINT NOT NULL,
  descripcion TEXT NOT NULL,  -- Descripción del tipo de roomie que buscan
  id_alojamiento BIGINT,  -- Opcional, por si ya tienen un alojamiento
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(id) ON DELETE CASCADE
);

CREATE TABLE mensajes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_emisor BIGINT NOT NULL,
  id_receptor BIGINT NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_emisor) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_receptor) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reservas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_user BIGINT NOT NULL,
  id_alojamiento BIGINT NOT NULL,
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(id) ON DELETE CASCADE
);






categoria


-- GESTION USUARIO
CREATE TABLE alojamiento_has_services (
  id_alojamiento BIGINT NOT NULL,
  id_service BIGINT NOT NULL,
  PRIMARY KEY (id_alojamiento, id_service),
  FOREIGN KEY (id_alojamiento) REFERENCES alojamientos(id) ON DELETE CASCADE,
  FOREIGN KEY (id_service) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE roles(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	image VARCHAR(255) NULL, 
	route VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

CREATE TABLE users(
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	name VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	phone VARCHAR(80) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	password VARCHAR(255) NOT NULL,
	is_available BOOLEAN NULL,
	session_token VARCHAR(255) NULL,
	notification_token VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

CREATE TABLE user_has_roles(
	id_user BIGSERIAL NOT NULL,
	id_rol BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,	
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY(id_user, id_rol)
);


--GESTION PAGOS 

CREATE TABLE subscriptions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    id_user BIGINT NOT NULL,  -- Relacionado con la tabla de usuarios
    id_plan BIGINT NOT NULL,  -- Relacionado con la tabla de planes de suscripción
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Fecha de inicio de la suscripción
    end_date TIMESTAMP,  -- Fecha de fin de la suscripción
    status VARCHAR(50) NOT NULL DEFAULT 'active',  -- Estado de la suscripción: 'active', 'cancelled', 'expired'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,  -- Relación con la tabla de usuarios
    FOREIGN KEY (id_plan) REFERENCES subscription_plans(id) ON DELETE CASCADE  -- Relación con la tabla de planes
);


CREATE TABLE subscription_plans (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,  -- Nombre del plan (por ejemplo: "Gratuito", "Premium")
    description TEXT NOT NULL,   -- Descripción del plan (por ejemplo: "Acceso a funcionalidades premium")
    price DECIMAL(10, 2) NOT NULL,  -- Precio del plan
    duration_in_months INT NOT NULL,  -- Duración del plan en meses
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);


CREATE TABLE payments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    id_user BIGINT NOT NULL,  -- ID del usuario que realizó el pago
    id_subscription BIGINT NOT NULL,  -- ID de la suscripción a la que corresponde el pago
    amount DECIMAL(10, 2) NOT NULL,  -- Monto del pago
    payment_method VARCHAR(50),  -- Método de pago (por ejemplo: 'Tarjeta', 'PayPal')
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Fecha del pago
    status VARCHAR(50) NOT NULL DEFAULT 'completed',  -- Estado del pago ('completed', 'pending', 'failed')
    transaction_id VARCHAR(255),  -- ID de la transacción de pago (opcional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,  -- Relación con la tabla de usuarios
    FOREIGN KEY (id_subscription) REFERENCES subscriptions(id) ON DELETE CASCADE  -- Relación con la suscripción
);


ALTER TABLE users
ADD COLUMN has_active_subscription BOOLEAN DEFAULT FALSE,  -- Indica si el usuario tiene una suscripción activa
ADD COLUMN current_plan VARCHAR(50);  -- Tipo de plan actual (por ejemplo: "Gratuito", "Premium")


INSERT INTO roles (name, created_at, updated_at)
VALUES ('propietario', NOW(), NOW());










--cambios

ALTER TABLE alojamiento_has_categorias rename to alojamiento_has_services;

ALTER TABLE categoria rename to services;

Alter table alojamiento_has_services rename column id_categoria to id_service;


-- Tabla de categorías
CREATE TABLE categorias (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Modificación de la tabla de alojamientos
ALTER TABLE alojamientos
ADD COLUMN id_categoria BIGINT,
ADD CONSTRAINT fk_categoria_alojamiento
    FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE SET NULL;






--consulta

SELECT 
    A.id,
    A.id_user,
    A.nombre,
    A.descripcion,
    A.precio,
    A.image1,
    A.image2,
    A.image3,
    A.direccion_id,
    A.created_at,
    A.updated_at,
    A.id_categoria,
    C.nombre AS categoria_nombre,
    D.direccion,
    D.neighborhood,
    D.lat,
    D.lng,
    json_agg(
        json_build_object(
            'id', S.id,
            'nombre', S.nombre,
            'descripcion', S.descripcion,
            'creado_en', S.creado_en,
            'actualizado_en', S.actualizado_en
        )
    ) AS services
FROM 
    alojamientos AS A
JOIN 
    address AS D ON A.direccion_id = D.id
LEFT JOIN 
    categorias AS C ON A.id_categoria = C.id
LEFT JOIN 
    alojamiento_has_services AS AHS ON A.id = AHS.id_alojamiento
LEFT JOIN 
    services AS S ON AHS.id_service = S.id
GROUP BY 
    A.id, A.id_user, A.nombre, A.descripcion, A.precio, A.image1, A.image2, A.image3, 
    A.direccion_id, A.created_at, A.updated_at, A.id_categoria, C.nombre, D.direccion, 
    D.neighborhood, D.lat, D.lng;
--------------------------------------------------------------------------------------------------

-- Agregar columnas para gestionar el estado de suscripción del usuario
ALTER TABLE users
ADD COLUMN has_active_subscription BOOLEAN DEFAULT FALSE,  -- Indica si el usuario tiene una suscripción activa
ADD COLUMN current_plan VARCHAR(50);  -- Tipo de plan actual (por ejemplo: "Gratuito", "Premium")




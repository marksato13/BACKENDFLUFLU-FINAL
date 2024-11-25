





















ALTER TABLE users
ADD COLUMN has_active_subscription BOOLEAN DEFAULT FALSE,  -- Indica si el usuario tiene una suscripción activa
ADD COLUMN current_plan VARCHAR(50);  -- Tipo de plan actual 


















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






ONE
-- Crear función para agregar un alojamiento con dirección, categoría y servicios
CREATE OR REPLACE FUNCTION agregar_alojamiento_con_direccion(
    p_id_user BIGINT,
    p_direccion VARCHAR,
    p_neighborhood VARCHAR,
    p_lat DECIMAL,
    p_lng DECIMAL,
    p_place_id VARCHAR,
    p_pais VARCHAR,
    p_estado VARCHAR,
    p_ciudad VARCHAR,
    p_codigo_postal VARCHAR,
    p_nombre_alojamiento VARCHAR,
    p_descripcion TEXT,
    p_precio DECIMAL,
    p_image1 VARCHAR,
    p_image2 VARCHAR,
    p_image3 VARCHAR,
    p_nombre_categoria VARCHAR,
    p_service_ids BIGINT[]
)
RETURNS BIGINT AS $$
DECLARE
    address_id BIGINT;
    categoria_id BIGINT;
    alojamiento_id BIGINT;
BEGIN
    -- 1. Crear dirección
    INSERT INTO address (
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
        created_at
    ) VALUES (
        p_id_user,
        p_direccion,
        p_neighborhood,
        p_lat,
        p_lng,
        p_place_id,
        p_pais,
        p_estado,
        p_ciudad,
        p_codigo_postal,
        NOW()
    ) RETURNING id INTO address_id;

    -- 2. Seleccionar o verificar id de la categoría
    SELECT id INTO categoria_id
    FROM categorias
    WHERE nombre = p_nombre_categoria;

    IF categoria_id IS NULL THEN
        RAISE EXCEPTION 'La categoría "%" no existe en la tabla categorias', p_nombre_categoria;
    END IF;

    -- 3. Crear el alojamiento
    INSERT INTO alojamientos (
        id_user,
        nombre,
        descripcion,
        precio,
        image1,
        image2,
        image3,
        direccion_id,
        id_categoria,
        created_at
    ) VALUES (
        p_id_user,
        p_nombre_alojamiento,
        p_descripcion,
        p_precio,
        p_image1,
        p_image2,
        p_image3,
        address_id,
        categoria_id,
        NOW()
    ) RETURNING id INTO alojamiento_id;

    -- 4. Asociar servicios al alojamiento
    IF p_service_ids IS NOT NULL THEN
        INSERT INTO alojamiento_has_services (id_alojamiento, id_service)
        SELECT alojamiento_id, unnest(p_service_ids);
    END IF;

    -- Devuelve el ID del alojamiento creado
    RETURN alojamiento_id;
END;
$$ LANGUAGE plpgsql;



SELECT agregar_alojamiento_con_direccion(
    1,                    -- ID de usuario
    '123 Calle Falsa',    -- Dirección
    'Centro',             -- Barrio
    40.712776,            -- Latitud
    -74.005974,           -- Longitud
    'ChIJOwg_06VPwokRYv534QaPC8g', -- Place ID
    'Peru',               -- País
    'Lima',               -- Estado
    'Lima',               -- Ciudad
    '15001',              -- Código postal
    'Alojamiento en Lima',-- Nombre del alojamiento
    'Hermosa casa en Lima.',-- Descripción del alojamiento
    150.00,               -- Precio
    'image1.jpg',         -- Imagen 1
    'image2.jpg',         -- Imagen 2
    'image3.jpg',         -- Imagen 3
    'Departamento compartido',                -- Nombre de la categoría
    ARRAY[1, 2, 3]        -- Array de IDs de servicios (ejemplo: 1, 2, 3)
);



NONE

-- Crear función para agregar un alojamiento con dirección, categoría y servicios
CREATE OR REPLACE FUNCTION agregar_alojamiento_con_direccion(
    p_id_user BIGINT,
    p_direccion VARCHAR,
    p_neighborhood VARCHAR,
    p_lat DECIMAL,
    p_lng DECIMAL,
    p_place_id VARCHAR,
    p_pais VARCHAR,
    p_estado VARCHAR,
    p_ciudad VARCHAR,
    p_codigo_postal VARCHAR,
    p_nombre_alojamiento VARCHAR,
    p_descripcion TEXT,
    p_precio DECIMAL,
    p_image1 VARCHAR,
    p_image2 VARCHAR,
    p_image3 VARCHAR,
    p_nombre_categoria VARCHAR,
    p_service_ids BIGINT[]
)
RETURNS VOID AS $$
DECLARE
    address_id BIGINT;
    categoria_id BIGINT;
    alojamiento_id BIGINT;
BEGIN
    -- 1. Crear dirección
    INSERT INTO address (
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
        created_at
    ) VALUES (
        p_id_user,
        p_direccion,
        p_neighborhood,
        p_lat,
        p_lng,
        p_place_id,
        p_pais,
        p_estado,
        p_ciudad,
        p_codigo_postal,
        NOW()
    ) RETURNING id INTO address_id;

    -- 2. Seleccionar o verificar id de la categoría
    SELECT id INTO categoria_id
    FROM categorias
    WHERE nombre = p_nombre_categoria;

    IF categoria_id IS NULL THEN
        RAISE EXCEPTION 'La categoría "%" no existe en la tabla categorias', p_nombre_categoria;
    END IF;

    -- 3. Crear el alojamiento
    INSERT INTO alojamientos (
        id_user,
        nombre,
        descripcion,
        precio,
        image1,
        image2,
        image3,
        direccion_id,
        id_categoria,
        created_at
    ) VALUES (
        p_id_user,
        p_nombre_alojamiento,
        p_descripcion,
        p_precio,
        p_image1,
        p_image2,
        p_image3,
        address_id,
        categoria_id,
        NOW()
    ) RETURNING id INTO alojamiento_id;

    -- 4. Asociar servicios al alojamiento
    IF p_service_ids IS NOT NULL THEN
        INSERT INTO alojamiento_has_services (id_alojamiento, id_service)
        SELECT alojamiento_id, unnest(p_service_ids);
    END IF;
END;
$$ LANGUAGE plpgsql;


























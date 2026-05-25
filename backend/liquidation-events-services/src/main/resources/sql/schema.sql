-- Schema for liquidation-events-services
-- Tables based on JPA adapters usage

-- Recintos table
CREATE TABLE IF NOT EXISTS recintos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo_recinto VARCHAR(50) NOT NULL,
    tasa_comision DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) NOT NULL
);

-- Eventos table
CREATE TABLE IF NOT EXISTS eventos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    estado VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS eventos_externos (
    evento_local_id BIGINT PRIMARY KEY REFERENCES eventos(id),
    evento_externo_id VARCHAR(64) NOT NULL UNIQUE,
    recinto_externo_id VARCHAR(64),
    estado_externo VARCHAR(32),
    tipo VARCHAR(64),
    fecha_inicio VARCHAR(64),
    fecha_fin VARCHAR(64),
    fecha_sincronizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id BIGSERIAL PRIMARY KEY,
    evento_id BIGINT NOT NULL REFERENCES eventos(id),
    estado_financiero VARCHAR(50) NOT NULL,
    valor_ticket DECIMAL(10,2) NOT NULL,
    valor_liquidacion DECIMAL(10,2),
    estado_ingreso VARCHAR(50),
    tipo_acceso VARCHAR(50),
    fecha_hora_ingreso TIMESTAMP,
    condicion_liquidacion VARCHAR(50) NOT NULL
);

-- Configuraciones liquidacion table
CREATE TABLE IF NOT EXISTS configuraciones_liquidacion (
    id BIGSERIAL PRIMARY KEY,
    evento_id BIGINT NOT NULL UNIQUE REFERENCES eventos(id),
    tipo_liquidacion VARCHAR(50) NOT NULL,
    valor_comision DECIMAL(10,2),
    porcentaje DECIMAL(5,2)
);

-- Comisiones recinto table
CREATE TABLE IF NOT EXISTS comisiones_recinto (
    id BIGSERIAL PRIMARY KEY,
    recinto_id BIGINT NOT NULL UNIQUE REFERENCES recintos(id),
    tipo_comision VARCHAR(50) NOT NULL,
    valor_comision DECIMAL(10,2) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Distribucion recaudo table
CREATE TABLE IF NOT EXISTS distribucion_recaudo (
    id BIGSERIAL PRIMARY KEY,
    evento_id BIGINT NOT NULL UNIQUE REFERENCES eventos(id),
    nombre_evento VARCHAR(255) NOT NULL,
    total_bruto DECIMAL(10,2) NOT NULL,
    descuento_cancelados DECIMAL(10,2),
    descuento_cortesia DECIMAL(10,2),
    total_neto_preliminar DECIMAL(10,2),
    total_distribuible DECIMAL(10,2)
);

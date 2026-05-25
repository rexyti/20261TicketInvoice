CREATE TABLE IF NOT EXISTS eventos (
  id BIGINT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  estado VARCHAR(32) NOT NULL
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

CREATE TABLE IF NOT EXISTS recintos (
  id BIGINT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo_recinto VARCHAR(32) NOT NULL,
  tasa_comision NUMERIC(10,4) NOT NULL,
  estado VARCHAR(32) NOT NULL DEFAULT 'ACTIVO'
);

CREATE TABLE IF NOT EXISTS tickets (
  id BIGINT PRIMARY KEY,
  evento_id BIGINT NOT NULL REFERENCES eventos(id),
  estado_financiero VARCHAR(32) NOT NULL,
  valor_ticket NUMERIC(14,2) NOT NULL,
  estado_ingreso VARCHAR(32) NOT NULL,
  fecha_hora_ingreso TIMESTAMP NULL,
  tipo_acceso VARCHAR(64) NULL,
  condicion_liquidacion VARCHAR(32) NOT NULL,
  valor_liquidacion NUMERIC(14,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS comisiones_recinto (
  id BIGSERIAL PRIMARY KEY,
  recinto_id BIGINT NOT NULL UNIQUE REFERENCES recintos(id),
  tipo_comision VARCHAR(32) NOT NULL,
  valor_comision NUMERIC(14,2) NOT NULL,
  fecha_registro TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS configuraciones_liquidacion (
  id BIGSERIAL PRIMARY KEY,
  evento_id BIGINT NOT NULL UNIQUE REFERENCES eventos(id),
  tipo_liquidacion VARCHAR(32) NOT NULL,
  valor_comision NUMERIC(14,2) NULL,
  porcentaje NUMERIC(10,4) NULL
);

CREATE TABLE IF NOT EXISTS distribucion_recaudo (
  id BIGSERIAL PRIMARY KEY,
  evento_id BIGINT NOT NULL UNIQUE REFERENCES eventos(id),
  nombre_evento VARCHAR(255) NOT NULL,
  total_bruto NUMERIC(14,2) NOT NULL,
  descuento_cancelados NUMERIC(14,2) NOT NULL DEFAULT 0,
  descuento_cortesia NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_neto_preliminar NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_distribuible NUMERIC(14,2) NOT NULL DEFAULT 0
);

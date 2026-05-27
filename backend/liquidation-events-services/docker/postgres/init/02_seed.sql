INSERT INTO recintos (id, nombre, tipo_recinto, tasa_comision, estado) VALUES
  (1, 'Estadio Nacional de Colombia', 'ESTADIO', 0.1200, 'ACTIVO'),
  (2, 'Teatro Colon', 'TEATRO', 0.0800, 'ACTIVO'),
  (3, 'Estadio Metropolitano', 'ESTADIO', 0.1500, 'ACTIVO'),
  (4, 'Corferias', 'TEATRO', 0.1000, 'ACTIVO')
ON CONFLICT (id) DO NOTHING;

INSERT INTO comisiones_recinto (recinto_id, tipo_comision, valor_comision) VALUES
  (1, 'PORCENTAJE', 7.50),
  (2, 'PORCENTAJE', 8.00)
ON CONFLICT (recinto_id) DO NOTHING;

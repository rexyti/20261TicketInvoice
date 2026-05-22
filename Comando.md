# Ejecutar todos los casos de uso con un solo Docker Compose

## 1) Ir al modulo backend
```bash
cd backend/liquidation-events-services
```

## 2) Levantar contenedores (app + postgres)
```bash
docker compose up --build
```

## 3) Probar endpoints por caso de uso (solo pegando URL en navegador)

### Feature 1 - Consultar resumen de ventas (GET)
http://localhost:8080/api/v1/eventos/1/resumen-ventas

### Feature 2 - Consultar estado de ingreso (GET)
http://localhost:8080/api/v1/eventos/1/estado-ingreso

### Feature 3 - Consultar recinto (GET)
http://localhost:8080/api/v1/recintos/1

### Feature 4 - Consultar ingresos de tickets (GET)
http://localhost:8080/api/v1/eventos/1/ingresos

### Feature 5 - Determinar tipo de liquidacion (POST)
Configurar desde navegador (GET):
http://localhost:8080/api/v1/eventos/1/configuracion-liquidacion/configurar?tipoLiquidacion=REPARTO_INGRESOS&valorComision=50000&porcentaje=0.10

Consultar configuracion (GET):
http://localhost:8080/api/v1/eventos/1/configuracion-liquidacion

### Feature 6 - Registrar valor comision recinto (POST)
Configurar desde navegador (GET):
http://localhost:8080/api/v1/recintos/1/comision/configurar?tipoComision=PORCENTAJE&valorComision=7.5

Consultar comision (GET):
http://localhost:8080/api/v1/recintos/1/comision

### Feature 7 - Consultar valor comision recinto (GET)
http://localhost:8080/api/v1/recintos/1/comision

### Feature 8 - Calcular distribucion del recaudo (POST)
Calcular desde navegador (GET):
http://localhost:8080/api/v1/eventos/1/calcular-distribucion

Consultar distribucion (GET):
http://localhost:8080/api/v1/eventos/1/distribucion-recaudo

### Feature 9 - Consultar distribucion del recaudo (GET)
http://localhost:8080/api/v1/eventos/1/distribucion-recaudo

## 4) Abrir Swagger UI
URL principal:
http://localhost:8080/swagger-ui.html

JSON OpenAPI:
http://localhost:8080/api-docs

## 5) Apagar contenedores
```bash
docker compose down
```

## 6) Reinicio limpio (si hay problemas con datos)
```bash
docker compose down -v
docker compose up --build
```

## 7) Ejecutar frontend
```bash
cd front
npm install     //solo si no se a instalado//
npm run dev
```

Abrir en navegador:
http://localhost:5173

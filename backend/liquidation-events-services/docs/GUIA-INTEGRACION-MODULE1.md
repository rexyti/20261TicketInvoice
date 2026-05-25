# Guía: integración real con Módulo 1 (snapshot de ventas)

Esta guía explica cómo **probar y operar** la integración entre el **Módulo 3** (`liquidation-events-services`) y el **Módulo 1** (gestión de recintos), usando el endpoint de snapshot vía ngrok.

> **Documento de negocio del proyecto:** [README.md](../README.md)  
> **Esta guía:** solo configuración, pruebas y resolución de problemas de la integración HTTP.

---

## Qué hace la integración

1. Tu API recibe `GET /api/v1/eventos/{id}/resumen-ventas` con un **ID numérico local** (ej. `1`).
2. El adaptador resuelve el **UUID del Módulo 1** con el mapping en `application.properties`.
3. Llama a: `GET {base-url}/api/v1/eventos/{uuid}/snapshot`
4. Mapea condiciones externas (`VENDIDO_SIN_ASISTENCIA`, `CORTESIA`, etc.) al dominio interno.
5. Usa `nombreEvento` del snapshot de Module1; si no viene, lo toma de PostgreSQL local. `estadoEvento` sigue viniendo de la BD local (seed).
6. Devuelve el resumen consolidado.

---

## Requisitos previos

- **Java 21** y Maven (o `./mvnw.cmd` en este proyecto).
- **Docker Desktop** (para PostgreSQL local).
- **curl** (en Windows: `curl.exe`).
- El equipo del **Módulo 1** con el túnel **ngrok activo** y la URL base actualizada.

---

## Paso 1 — Coordinar con el Módulo 1

Pide al equipo del Módulo 1:

1. Que el túnel ngrok esté **encendido**.
2. La **URL base** actual (cambia cada vez que reinician ngrok si no usan dominio fijo).
3. Un **UUID de evento** de prueba que responda en snapshot.
4. Confirmación del path: `GET /api/v1/eventos/{eventoId}/snapshot`

Ejemplo de respuesta válida:

```json
{
  "eventoId": "03c22676-5ea5-43e5-9c8d-1ccc59211e3c",
  "condiciones": [
    { "condicion": "VENDIDO_SIN_ASISTENCIA", "cantidad": 3, "valorTotal": 60000.00 },
    { "condicion": "CORTESIA", "cantidad": 1, "valorTotal": 0.00 }
  ]
}
```

---

## Paso 2 — Levantar PostgreSQL (datos locales)

Desde la carpeta del servicio:

```powershell
cd backend\liquidation-events-services
docker compose up -d postgres
```

Verifica que esté healthy:

```powershell
docker ps
```

Debe aparecer `liquidation-events-services-postgres-1` en puerto **5433**.

Los datos de prueba incluyen el evento local `id=1`, nombre `Concierto Rock 2026`, estado `CERRADO` (ver `docker/postgres/init/02_seed.sql`).

---

## Paso 3 — Configurar `application.properties`

Archivo: `src/main/resources/application.properties`

```properties
# Activar integración real
external.module1.enabled=true
external.module1.base-url=https://TU-URL-NGROK-AQUI.ngrok-free.dev
external.module1.connect-timeout-ms=2000
external.module1.read-timeout-ms=5000
external.module1.fallback-to-jpa=false
external.module1.ngrok-skip-browser-warning=true

# ID local (PostgreSQL) -> UUID del Módulo 1
external.module1.mapping.1=03c22676-5ea5-43e5-9c8d-1ccc59211e3c
```

| Propiedad | Valor recomendado | Descripción |
|-----------|-------------------|-------------|
| `enabled` | `true` | Usa el adaptador remoto (Module1). |
| `enabled` | `false` | Solo datos locales JPA (desarrollo sin Module1). |
| `fallback-to-jpa` | `false` | Si Module1 falla → error 502 (no mezcla datos viejos). |
| `fallback-to-jpa` | `true` | Solo para depuración local; **no usar en integración real**. |
| `mapping.{id}` | UUID | Relaciona tu `eventoId` numérico con el UUID de Module1. |

Si agregas más eventos:

```properties
external.module1.mapping.2=otro-uuid-del-modulo-1
```

---

## Paso 4 — Probar el endpoint del Módulo 1 (directo)

Sustituye la URL y el UUID por los que te dio el Módulo 1:

```powershell
curl.exe -H "Ngrok-Skip-Browser-Warning: true" "https://TU-URL-NGROK.ngrok-free.dev/api/v1/eventos/03c22676-5ea5-43e5-9c8d-1ccc59211e3c/snapshot"
```

### Resultado esperado

- **JSON** con `condiciones` → el túnel está bien. Continúa al paso 5.
- **HTML** con `ERR_NGROK` o "endpoint is offline" → el túnel está apagado. **Detente** y pide al Módulo 1 que reinicie ngrok.
- **404 JSON** del API real → el UUID no existe en Module1; pide otro ID de prueba.

---

## Paso 5 — Arrancar el Módulo 3

```powershell
cd backend\liquidation-events-services
.\mvnw.cmd spring-boot:run
```

Espera en consola:

```text
Started LiquidationEventsServicesApplication
```

Si el puerto 8080 está ocupado:

```powershell
# Ver qué proceso usa el puerto
Get-NetTCPConnection -LocalPort 8080 | Select-Object OwningProcess
# Cerrar ese proceso o cambiar server.port en application.properties
```

---

## Paso 6 — Probar tu API (integración completa)

```powershell
curl.exe "http://localhost:8080/api/v1/eventos/1/resumen-ventas"
```

### Respuesta exitosa (HTTP 200)

Deberías ver algo similar a:

- `estadoEvento`: `"CERRADO"` (desde BD local)
- `nombreEvento`: `"Concierto Rock 2026"`
- Tickets/recaudo alineados con el snapshot del Módulo 1 (ej. 3 vendidos, 1 cortesía, total bruto ~60000 si usas el ejemplo del Módulo 1)

También puedes usar Swagger: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) → **Resumen de ventas** → `GET /api/v1/eventos/{id}/resumen-ventas`.

---

## Paso 7 — Test automático “live” (opcional)

Comprueba solo la conectividad con Module1 (sin levantar toda la app):

```powershell
.\mvnw.cmd test -Dtest=Module1LiveIntegrationTest
```

- Si ngrok está **offline**, el test se **omite** (no falla el build).
- Si ngrok está **online**, el test debe **pasar**.

Parámetros opcionales:

```powershell
.\mvnw.cmd test -Dtest=Module1LiveIntegrationTest `
  -Dmodule1.base-url=https://TU-URL.ngrok-free.dev `
  -Dmodule1.evento-uuid=03c22676-5ea5-43e5-9c8d-1ccc59211e3c
```

---

## Paso 8 — Ejecutar tests del proyecto

```powershell
.\mvnw.cmd test
```

Con perfil de test, Module1 está desactivado (`application-test.properties`):

```properties
external.module1.enabled=false
```

Así los tests de CI no dependen de ngrok.

---

## Modos de operación

### Integración real (recomendado para validar con Módulo 1)

```properties
external.module1.enabled=true
external.module1.fallback-to-jpa=false
```

### Solo datos locales (sin Módulo 1)

```properties
external.module1.enabled=false
```

La API usará el resumen calculado desde PostgreSQL (`tickets` del seed).

### Depuración con fallback (solo desarrollo)

```properties
external.module1.enabled=true
external.module1.fallback-to-jpa=true
```

Si Module1 falla, intenta JPA. **No usar** para validar integración real.

---

## Errores frecuentes

| HTTP | Código | Causa probable | Qué hacer |
|------|--------|----------------|-----------|
| 502 | `EXTERNAL_SERVICE_UNAVAILABLE` | ngrok caído, timeout, red | Paso 4; verificar URL y túnel |
| 404 | `EVENT_NOT_FOUND` | UUID incorrecto en Module1 | Corregir `external.module1.mapping.*` |
| 409 | `EVENT_NOT_CLOSED` | Evento local no está `CERRADO` | Actualizar `eventos.estado` en BD o usar evento 1 del seed |
| 502 + log “No Module1 mapping” | Sin mapping para ese `id` | Agregar `external.module1.mapping.{id}=uuid` |

Logs útiles (consola al llamar la API):

```text
Requesting Module1 snapshot from URL=...
Module1 tunnel appears offline ...
```

---

## Checklist rápido “¿está todo funcionando?”

Marca cada ítem cuando pase:

- [ ] Paso 4: `curl` directo a Module1 devuelve **JSON** (no HTML de ngrok).
- [ ] Paso 5: Spring Boot arranca sin error en puerto 8080.
- [ ] Paso 6: `GET /api/v1/eventos/1/resumen-ventas` devuelve **HTTP 200**.
- [ ] Los totales coinciden con el snapshot del Módulo 1.
- [ ] `estadoEvento` es `CERRADO` para eventos cerrados del seed.
- [ ] Paso 7 (opcional): `Module1LiveIntegrationTest` pasa con ngrok activo.

Cuando los cuatro primeros estén marcados, la **integración real está validada**.

---

## Archivos relevantes en el código

| Archivo | Rol |
|---------|-----|
| `Module1HttpClient.java` | Cliente HTTP (timeouts, header ngrok, errores) |
| `RemoteEventSnapshotRepositoryAdapter.java` | Adaptador del puerto `EventSnapshotRepository` |
| `Module1EventSnapshotMapper.java` | Mapeo tolerante de condiciones externas |
| `Module1MappingProperties.java` | Mapping y flags (`fallback-to-jpa`, ngrok) |
| `Module1IntegrationConfig.java` | Beans condicionales Spring |
| `application.properties` | Configuración de entorno |

---

## Contacto entre equipos

Cuando cambie algo en Module1, actualiza:

1. `external.module1.base-url` (nueva URL ngrok).
2. `external.module1.mapping.{id}` (nuevos UUIDs).
3. Condiciones de ticket si renombran estados (el mapper ya tolera `VENDIDO` / `VENDIDO_SIN_ASISTENCIA`; avisar si agregan valores nuevos).

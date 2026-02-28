# Feature Specification: [FEATURE]

**Created**: [DATE]  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar distribucion del recaudo (Priority: P1)

Como administrador financiero quiero consultar la distribucion del recaudo generado por un evento para validar que la liquidacion se haya ejecutado correctamente segun el modelo de negocio configurado.

**Why this priority**: Es necesario consultar la distribucion del recaudo para verificar la correcta aplicacion de la liquidacion y asegurar la transparencia en la dispersión de fondos.

**Independent Test**: Permitir visualizar la distribucion del recaudo por evento mostrando:

-Total pago al promotor

-Total comisión plataforma

-Estado de la liquidacion del evento

**Acceptance Scenarios**:

1. **Scenario**: Consulta de distribucion del recaudo de un evento liquidado
   - **Given** Dado que un evento se encuentra en estado "Liquidado"
   - **When** Cuando el administrador financiero consulta la distribucion del recaudo del evento
   - **Then** Entonces el sistema muestra el detalle de los montos distribuidos al promotor, comision de plataforma.

2. **Scenario**: Consulta de distribucion de un evento no liquidado
   - **Given** Dado que un evento no ha sido liquidado
   - **When** Cuando el administrador financiero intenta consultar la distribucion del recaudo
   - **Then** Entonces el sistema muestra un mensaje indicando que el evento aun no tiene liquidacion disponible

---

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

-Que pasa cuando se intenta consultar la distribucion de un evento que no existe?

Se muestra un mensaje de error indicando que el evento no se encuentra registrado.

-Que pasa si la liquidacion presenta inconsistencias en los montos calculados?

El sistema debe bloquear la consulta y notificar al administrador financiero para revision.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: El sistema DEBE permitir consultar la distribucion del recaudo por evento.
- **FR-002**: El sistema DEBE mostrar el detalle de montos distribuidos al promotor, comision de plataforma.
- **FR-003**: El sistema DEBE validar que el evento exista antes de permitir la consulta.
- **FR-004**: El sistema DEBE permitir la consulta solo cuando el evento tenga estado "Liquidado".
- **FR-006**: El sistema DEBE impedir modificaciones sobre los datos de distribucion una vez consultados.


### Key Entities *(include if feature involves data)*

- **[Entity 1]**: DistribucionRecaudo

-idDistribucion

-idEvento

-totalPagoPromotor

-totalComisionPlataforma

-totalReembolsos

-fechaLiquidacion




### Measurable Outcomes

- **SC-001**: El 100% de las consultas de distribucion del recaudo deben mostrar montos consistentes con la liquidacion generada.
- **SC-002**: El 100% de los eventos en estado "Liquidado" deben tener una distribucion disponible para consulta.




# Feature Specification: [FEATURE]

**Created**: [DATE]  

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar ingresos tickets (Priority: P1)

Como administrador financiero quiero consultar los ingresos generados por la venta de tickets de un evento para verificar el recaudo obtenido y validar la base financiera utilizada en la liquidacion.

**Why this priority**: Es necesario consultar los ingresos por tickets para validar el recaudo bruto del evento y asegurar que los montos utilizados en el proceso de liquidacion sean correctos.

**Independent Test**: Permitir visualizar los ingresos de tickets por evento mostrando:

- Total de tickets vendidos  
- Total de tickets validados  
- Total de tickets cancelados  
- Total de cortesías  
- Total recaudo bruto generado por la venta de tickets  

**Acceptance Scenarios**:

1. **Scenario**: Consulta de ingresos de tickets de un evento existente
   - **Given** Dado que existe un evento con tickets vendidos
   - **When** Cuando el administrador financiero consulta los ingresos de tickets del evento
   - **Then** Entonces el sistema muestra el resumen de tickets vendidos, estados de tickets y el recaudo bruto generado

2. **Scenario**: Consulta de ingresos de tickets de un evento sin ventas
   - **Given** Dado que existe un evento sin tickets vendidos
   - **When** Cuando el administrador financiero consulta los ingresos del evento
   - **Then** Entonces el sistema muestra que no existen ingresos registrados para el evento

---

### Edge Cases

- ¿Que pasa cuando se intenta consultar los ingresos de un evento que no existe?  

Se muestra un mensaje de error indicando que el evento no se encuentra registrado.

- ¿Que pasa si existen tickets sin estado definido?  

El sistema muestra una advertencia indicando inconsistencia en la informacion de tickets.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir consultar los ingresos generados por la venta de tickets por evento.
- **FR-002**: El sistema DEBE mostrar el total de tickets vendidos por evento.
- **FR-003**: El sistema DEBE mostrar el estado de los tickets (Validado, No asistio, Cortesia, Cancelado).
- **FR-004**: El sistema DEBE calcular y mostrar el recaudo bruto generado por la venta de tickets.
- **FR-005**: El sistema DEBE validar que el evento exista antes de permitir la consulta.
- **FR-006**: El sistema DEBE impedir modificaciones sobre los datos de ingresos una vez generados.

---

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: Ticket

idTicket  
idEvento  
estadoFinanciero (Validado / NoAsistio / Cortesia / Cancelado)  
valorBruto  
fechaVenta  

Relaciones:  
Pertenece a un evento.  
Su estado impacta el calculo financiero del recaudo.

- **[Entity 2]**: Evento

idEvento  
estadoEvento (Programado / EnCurso / Finalizado / Liquidado)  
totalRecaudoBruto  

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los eventos con tickets vendidos deben tener informacion de ingresos disponible para consulta.

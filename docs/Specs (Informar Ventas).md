# Feature Specification: Feature

**Created**: [21/02/2026]  

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 2 - [Informar Ventas] (Priority: P1)

Como "gestion de recintos e inventarios de aforo" quiero informar las ventas realizadas de las entradas para los eventos registrados en la plataforma

**Why this priority**: Es necesario informar las ventas de los tickets, para poder realizar una liquidacion y dispercion correcta de fondos.
**Independent Test**: Permitir visualizar informacion de ventas realizadas por evento mostrando:

-Total de tickets vendidos

-Total de tickets validados

-Total de tickets cancelados

-Total de cortesías

**Acceptance Scenarios**:

1. **Scenario**: 
   - **Given** Dado que se han vendido tickets para un evento 
   - **When** Cuando la gestion de recintos e inventarios de aforo registre la finalizacion de un evento
   - **Then** Entonces los datos deben ser registrados para calcular la distribucion del recaudo

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

-**FR-001**:El sistema DEBE permitir registrar y consolidar automáticamente las ventas por evento.

-**FR-002**:El sistema DEBE calcular y mostrar: Total de tickets vendidos, Total de tickets validados, Total de tickets cancelados y Total de recaudo bruto

-**FR-003**:El sistema DEBE permitir marcar un evento como “Finalizado”.

-**FR-004**:El sistema DEBE bloquear la modificación de datos de ventas una vez el evento haya sido liquidado.

-**FR-005**:El sistema DEBE validar que el evento exista antes de permitir registrar su finalización.

-**FR-006**:El sistema DEBE permitir consultar el resumen de ventas por evento despues de que dicho evento haya finalizado.

-**FR-007**:El sistema DEBE calcular el recaudo bruto excluyendo tickets cancelados.




### Key Entities *(include if feature involves data)*

- **[Entity 1]**: **Evento**
Representa un evento registrado en la plataforma.

**Atributos clave**:

- idEvento
  
- nombreEvento
  
- estadoEvento (Programado / En curso / Finalizado / Liquidado)
  
- fechaEvento
  
- totalRecaudoBruto
  
**Relación**:
- Un evento tiene muchos tickets.
  
- Un evento pertenece a un recinto.

  **[Entity 2]**: **Ticket**
  
Representa una entrada asociada a un evento.

**Atributos clave**:

idTicket

idEvento (FK)

estadoTicket (Vendido / Validado / Cancelado / Cortesía)

valorTicket

fechaVenta

**Relación**:

Muchos tickets pertenecen a un evento.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: **(Metrica operativa)** El 100 % de los eventos finalizados generan automáticamente un resumen de ventas sin errores de cálculo.
- **SC-002**: **(Metrica de rendimiento)** El sistema debe procesar y consolidar hasta 50.000 tickets por evento en menos de 5 segundos.

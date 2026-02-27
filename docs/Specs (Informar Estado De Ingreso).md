# Feature Specification: [FEATURE NAME]

**Created**: [DATE]  

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

### User Story 1 - [Informar estado de ingreso] (Priority: P1)

Como "Operacion de eventos y control de accesos" quiero informar el estado de ingreso de los tikeckts vendidos (Exitoso, Denegado, Re-ingreso)

**Why this priority**: Es necesario informar el estado de ingreso para el calculo del pago final y poder determinar los montos a dispersar.
**Independent Test**: Permitir visualizar la condicion del ticket dentro de los siguientes tipos:

-Validado (Check-in)
-Vendido (No asistió)
-Cortesía (Free Pass)
-Cancelado

**Acceptance Scenarios**:

1. **Scenario**: Condicion de ticket "Validado(Check-In)"
   - **Given** Dado que se vendio un ticket 
   - **When** Cuando la condicion del ticket es "validado"
   - **Then** Entonces el monto a dispersar del pago final se distribuye en 90% al promotor, 10% a la comision de la plataforma y como observacion: "Servcio Completado"

2. **Scenario**: Condicion de ticket "Vendido(No Asistio)"
   - **Given** Dado que se vendio un ticket 
   - **When** Cuando la condicion del ticket es "Vendido(No asistio)"
   - **Then** Entonces el monto a dispersar del pago final se distribuye en 100% al promotor, 10% a la comision de la plataforma y como observacion: "El ingreso se mantiene; menor gasto operativo"

3. **Scenario**: Condicion de ticket "Cortesia(Free Pass)"
   - **Given** Dado que se vendio un ticket 
   - **When** Cuando la condicion del ticket es "Cortesia(Free Pass)"
   - **Then** Entonces el monto a dispersar del pago final se distribuye en 0% al promotor, Tarifa Fija a la comision de la plataforma y como observacion: "Costo operativo por emisión de ticket."
  
4. **Scenario**: Condicion de ticket "Cortesia(Free Pass)"
   - **Given** Dado que se vendio un ticket 
   - **When** Cuando la condicion del ticket es "Cancelada"
   - **Then** Entonces el monto a dispersar del pago final se distribuye en -100% al promotor, 0% la comision de la plataforma y como observacion: "Costo operativo por emisión de ticket."



### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

-Que pasaria si no se le asigna ningun estado al ticket vendido?

Se manda un mesaje de "Error diciendo todos los tickets deben tener un estado asignado (Validado,Vendido(no asistio), cortesia y cancelado)
todos los ticket deben tener un estado.

-Que pasaria si se le quiere cambiar el estado a un ticket ya liquidado?
Se bloquea la operacion y se piden permisos de administrador financiero.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

**FR-001:**El sistema DEBE registrar el estado operativo del ticket en tiempo real (Validado,Vendido(no asistio), cortesia y cancelado).

**FR-002:**El sistema DEBE validar que el ticket pertenezca al evento antes de permitir check-in.

**FR-003:**El sistema DEBE impedir la liquidación de un evento si existen tickets sin estado financiero definido.

**FR-004:**El sistema DEBE calcular automáticamente la distribución financiera según la matriz definida.

**FR-005:**El sistema DEBE bloquear modificaciones de estado una vez el evento esté en estado "Liquidado".

**FR-006:**El sistema DEBE permitir exportar el resumen financiero consolidado por evento.



### Key Entities *(include if feature involves data)*

- **[Entity 1]**:

**Ticket**

Atributos clave:

idTicket

idEvento

estadoOperativo (Exitoso / Denegado / Re-ingreso)

estadoFinanciero (Validado / NoAsistio / Cortesia / Cancelado)

valorBruto

fechaVenta

fechaValidacion

- **[Entity 2]**:

**Evento**


Atributos:

idEvento

estadoEvento (Programado / EnCurso / Finalizado / Liquidado)

tipoLiquidacion (TarifaPlana / RepartoIngresos)

totalRecaudoBruto

totalComisionPlataforma

totalPagoPromotor

- **[Entity 3]**:

 **Liquidacion**

Atributos:

idLiquidacion

idEvento

fechaCorte

totalPromotor

totalPlataforma

totalReembolsos

estadoLiquidacion 

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

**SC-001:**El 100% de los tickets procesados deben tener un estado financiero válido antes de ejecutar la liquidación.

**SC-002:**El sistema debe procesar validaciones en tiempo real con latencia menor a 2 segundos por operación.

**SC-003:**El 99% de los eventos liquidables deben generar el cálculo financiero sin inconsistencias contables.

**SC-004:**Capacidad de procesar al menos 500 validaciones por hora sin degradación del servicio.

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

### User Story 1 - [Determinar Tipo liquidacion final] (Priority: P1)

Como administrador financiero, quiero poder registrar el tipo de liquidacion final que se va a usar para pagar los eventos donde se realizara , para que el sistema aplique el modelo correcto de calculo.

**Why this priority**: Es necesario definir los modelos de liquidacion, para establecer el valor de la comision de los recintos en el sistema.

**Independent Test**: 
Configurar un recinto con:
- Tarifa plana
- -Reparto de ingesos

Y validar que el sistema registre correctamente el tipo seleccionado.

**Acceptance Scenarios**:

1. **Scenario**: Configuracion de tarifa plana:
   - **Given** Dado que existe un evento asociado a un recinto.
   - **When** Cuando el administrador financiero selecciona "Tarifa Plana" define un monto fijo.
   - **Then** Entonces el sistema guarda el modelo financiero asociado al evento.

2. **Scenario**: Configuracion de reparto de ingresos
   - **Given** Dado que existe un evento asociado a un recinto.
   - **When** Cuando el administrador financiero selecciona "reparto de ingresos" define un porcentaje sobre la venta bruta.
   - **Then** Entonces el sistema guarda el modelo financiero asociado al evento.

3. **Scenario**: Configuracion de tipo de tarifa cuando el recinto no existe
   - **Given** Dado que no existe el recinto.
   - **When** Cuando el administrador financiero vaya a seleccionar una opcion
   - **Then** Lanzar un mensaje de error "el recinto al que se quiere asociar la tarifa no existe"

---

### User Story 2 - [Informar Ventas] (Priority: P1)

Como "gestion de recintos e inventarios de aforo" quiero informar las ventas realizadas de las entradas para los eventos registrados en la plataforma

**Why this priority**: Es necesario informar las ventas de los tickets, para poder realizar una liquidacion y dispercion correcta de fondos.
**Independent Test**: Permitir visualizar informacion de ventas realizadas por evento mostrando:

-Total de tickets vendidos

-Total de tickets validados

-Total de tickets cancelados

-Total de cortesías

**Acceptance Scenarios**:

1. **Scenario**: Busqueda de las ventas de los tickets de un evento
   - **Given** Dado que se han vendido tickets para un evento 
   - **When** Cuando la gestion de recintos e inventarios de aforo registre las ventas de un evento 
   - **Then** Entonces los datos deben ser visibles para el administrador financiero

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

-**FR-001**: El sistema MUST permitir configurar el tipo de liquidación por evento
-**FR-002**: El sistema MUST permitir configurar porcentaje de comisión por recinto


-**FR-003**: El sistema MUST calcular el total bruto de ventas confirmadas
-**FR-004**: El sistema MUST descontar tickets cancelados del total bruto
-**FR-005**: El sistema MUST aplicar la matriz de liquidación según estado del ticket


-**FR-006**: El sistema MUST calcular comisión de recinto
-**FR-007**: El sistema MUST calcular monto final al promotor
-**FR-008**: El sistema MUST almacenar el resultado de la liquidación
-**FR-009**: El sistema MUST impedir liquidación duplicada sin control de versión
-**FR-010**: El sistema MUST permitir consultar liquidaciones históricas



### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]


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

### User Story 1 - [Calcular Distribucion del Recaudo] (Priority: P1)

Como Administrador financiero quiero que el sistema calcule la distribución del recaudo de un evento finalizado
para conocer los valores preliminares antes de determinar el tipo de liquidación final.
**Why this priority**: Es necesario calcular la distribución del recaudo de un evento para determinar los montos a pagar 
al promotor, recinto y plataforma según la configuración establecida.
**Independent Test**: Calcular el recaudo bruto teniedno en cuenta los siguinetes lineamientos

-Aplica comisión de plataforma

-Determina pago final al promotor

-Registra el resultado del calculo de ingresos.

-Determinar el valor de las  comisiones acordadas para el evento.

-Estado de la liquidacion del evento

**Acceptance Scenarios**:

1. **Scenario**: Condicion cuando el recinto es de tipo teatro
   - **Given** Dado que se registró un recinto
   - **When** Cuando el tipo de recinto es un teatro
   - **Then** Entonces el sistema calcula:

              - El total bruto recaudado

              - Calcular el valor neto preliminar.

              - Registrar el resultado  como “Distribución preliminar”.

              - Calcular el valor de las  comisiones acordadas para el evento.

              - Registrar el resultado  como “Total distribuible”.

              - Registrar el estado de la liquidacion del evento


### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

-¿Qué sucede si el evento no tiene ventas?

El sistema genera distribución de reacudo en cero y registra el evento como “Sin recaudo”.

-¿Qué sucede si los valores de las comisiónes para el evento no estan definidos?

Se bloquea el cálculo y se solicita establecer comisión.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

-**FR-01:** El sistema debe permitir calcular automáticamente el recaudo total bruto del evento.

-**FR-02:** El sistema debe descontar:
          
          -Tickets cancelados

          -Cortesías (si no generan ingreso)

-**FR-03:** El sistema debe generar:

          -Valor neto preliminar

          -Total distribuible

-**FR-04:** El sistema debe almacenar el cálculo como registro financiero del evento.

-**FR-05:** El sistema debe permitir consultar la distribución calculada (relacionado con “Consultar distribución del recaudo”).

-**FR-06:** El sistema debe registrar el estado de la liquidacion del evento dentro de la distribucion del recaudo.



### Key Entities *(include if feature involves data)*

- **[Entity 1]**:

**DistribuciónRecaudo**

Atributos:

-Total bruto

-Total neto preliminar

-Fecha cálculo

-Estado (Preliminar)


## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

**SC-001:** El 100 % de los eventos finalizados deben permitir calcular distribución sin intervención manual cuando los datos estén completos.

**SC-002:** El cálculo debe ejecutarse en menos de 1 minuto y 52 segundos para eventos con hasta 500 tickets vendidos.

**SC-003:** El 95 % de los cálculos no deben requerir corrección posterior por inconsistencias.



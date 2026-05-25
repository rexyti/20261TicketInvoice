import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/core/api/query-client";
import { ErrorBoundary } from "@/core/errors/error-boundary";
import { AppLayout } from "@/shared/layout/AppLayout";
import { Feature01ConsultarResumenDeVentasPage } from "@/features/eventos/pages/feature-01ConsultarResumenDeVentas-page";
import type { ResumenEventoData } from "@/features/eventos/pages/feature-01ConsultarResumenDeVentas-page";
import { Feature02ConsultarEstadoIngresoPage } from "@/features/eventos/pages/feature-02ConsultarEstadoIngreso-page";
import type { EstadoIngresoEventoData } from "@/features/eventos/pages/feature-02ConsultarEstadoIngreso-page";
import { Feature03InformarTipoDeRecintoPage } from "@/features/eventos/pages/feature-03InformarTipoDeRecinto-page";
import type { TipoRecintoEventoData } from "@/features/eventos/pages/feature-03InformarTipoDeRecinto-page";
import { Feature04ConsultarIngresosTicketsPage } from "@/features/eventos/pages/feature-04ConsultarIngresosTickets-page";
import type { IngresosTicketsEventoData } from "@/features/eventos/pages/feature-04ConsultarIngresosTickets-page";
import { Feature05DeterminarTipoLiquidacionFinalPage } from "@/features/eventos/pages/feature-05DeterminarTipoLiquidacionFinal-page";
import type { TipoLiquidacionEventoData } from "@/features/eventos/pages/feature-05DeterminarTipoLiquidacionFinal-page";
import { Feature06RegistrarValorComisionRecintoPage } from "@/features/eventos/pages/feature-06RegistrarValorComisionRecinto-page";
import type { ComisionRecintoData } from "@/features/eventos/pages/feature-06RegistrarValorComisionRecinto-page";
import { Feature07ConsultarValorComisionRecintoPage } from "@/features/eventos/pages/feature-07ConsultarValorComisionRecinto-page";
import type { ConsultarComisionRecintoData } from "@/features/eventos/pages/feature-07ConsultarValorComisionRecinto-page";
import { Feature08CalcularDistribucionDelRecaudoPage } from "@/features/eventos/pages/feature-08CalcularDistribucionDelRecaudo-page";
import type { CalculoDistribucionData } from "@/features/eventos/pages/feature-08CalcularDistribucionDelRecaudo-page";
import { Feature09ConsultarDistribucionDelRecaudoPage } from "@/features/eventos/pages/feature-09ConsultarDistribucionDelRecaudo-page";
import type { ConsultarDistribucionRecaudoData } from "@/features/eventos/pages/feature-09ConsultarDistribucionDelRecaudo-page";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

type Screen =
  | "index"
  | "eventoAcciones"
  | "consultarResumenDeVentas"
  | "consultarEstadoIngreso"
  | "informarTipoRecinto"
  | "consultarIngresosTickets"
  | "determinarTipoLiquidacionFinal"
  | "registrarValorComisionRecinto"
  | "consultarValorComisionRecinto"
  | "calcularDistribucionDelRecaudo"
  | "consultarDistribucionDelRecaudo";
type EstadoEvento = "No inicia" | "En curso" | "Finalizado";
type TipoEvento = "Concierto" | "Festival";

interface NavigationState {
  screen: Screen;
  eventoId: string | null;
}

interface EventoMenu {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  tipo: TipoEvento;
  recinto: string;
}

const eventos: EventoMenu[] = [
  {
    id: "EV-24021",
    nombre: "Festival Estereo Capital 2026",
    fechaInicio: "2026-02-21",
    fechaFin: "2026-02-23",
    tipo: "Festival",
    recinto: "Parque Simon Bolivar",
  },
  {
    id: "EV-24100",
    nombre: "Coldplay Music of the Spheres",
    fechaInicio: "2026-08-10",
    fechaFin: "2026-08-10",
    tipo: "Concierto",
    recinto: "Estadio El Campin",
  },
  {
    id: "EV-24205",
    nombre: "Noche Clasica Filarmonica",
    fechaInicio: "2026-03-02",
    fechaFin: "2026-03-02",
    tipo: "Concierto",
    recinto: "Arena Norte",
  },
  {
    id: "EV-24399",
    nombre: "Demo Recinto Inexistente",
    fechaInicio: "2026-04-15",
    fechaFin: "2026-04-15",
    tipo: "Concierto",
    recinto: "Por definir",
  },
];

const resumenesPorEvento: Record<string, ResumenEventoData> = {
  "EV-24021": {
    snapshotId: "SNAP-24021",
    fechaEvento: "21/02/2026",
    estadoEvento: "Finalizado",
    metricas: {
      vendidos: "5,420",
      validados: "4,980",
      cancelados: "185",
      cortesias: "255",
      totalRecaudado: "$ 328,450,000",
    },
    rows: [
      { condicion: "Vendidos", descripcion: "Tickets emitidos con valor bruto asociado", tickets: "5,420", valor: "$ 337,700,000" },
      { condicion: "Validados", descripcion: "Tickets usados como referencia de asistencia y conciliacion", tickets: "4,980", valor: "$ 328,450,000" },
      { condicion: "Cancelados", descripcion: "Boletas reversadas y descontadas del consolidado", tickets: "185", valor: "- $ 9,250,000", danger: true },
      { condicion: "Cortesias", descripcion: "Tickets sin recaudo monetario", tickets: "255", valor: "$ 0" },
      { condicion: "Total usado para liquidacion", descripcion: "Base consolidada para distribucion del recaudo", tickets: "5,235", valor: "$ 328,450,000", total: true },
    ],
  },
  "EV-24100": {
    snapshotId: "SNAP-24100",
    fechaEvento: "10/08/2026",
    estadoEvento: "No inicia",
    metricas: {
      vendidos: "3,870",
      validados: "0",
      cancelados: "42",
      cortesias: "130",
      totalRecaudado: "$ 691,300,000",
    },
    rows: [
      { condicion: "Vendidos", descripcion: "Tickets emitidos con valor bruto asociado", tickets: "3,870", valor: "$ 699,500,000" },
      { condicion: "Validados", descripcion: "Tickets usados como referencia de asistencia y conciliacion", tickets: "0", valor: "$ 0" },
      { condicion: "Cancelados", descripcion: "Boletas reversadas y descontadas del consolidado", tickets: "42", valor: "- $ 8,200,000", danger: true },
      { condicion: "Cortesias", descripcion: "Tickets sin recaudo monetario", tickets: "130", valor: "$ 0" },
      { condicion: "Total usado para liquidacion", descripcion: "Base consolidada para distribucion del recaudo", tickets: "3,828", valor: "$ 691,300,000", total: true },
    ],
  },
  "EV-24399": {
    snapshotId: "SNAP-24399",
    fechaEvento: "15/04/2026",
    estadoEvento: "Finalizado",
    metricas: {
      vendidos: "0",
      validados: "0",
      cancelados: "0",
      cortesias: "0",
      totalRecaudado: "$ 0",
    },
    rows: [
      { condicion: "Vendidos", descripcion: "Sin movimiento", tickets: "0", valor: "$ 0" },
      { condicion: "Validados", descripcion: "Sin movimiento", tickets: "0", valor: "$ 0" },
      { condicion: "Cancelados", descripcion: "Sin movimiento", tickets: "0", valor: "$ 0" },
      { condicion: "Cortesias", descripcion: "Sin movimiento", tickets: "0", valor: "$ 0" },
      { condicion: "Total usado para liquidacion", descripcion: "Sin base financiera", tickets: "0", valor: "$ 0", total: true },
    ],
  },
};

const estadosIngresoPorEvento: Record<string, EstadoIngresoEventoData> = {
  "EV-24021": {
    controlId: "ACC-24021",
    fechaEvento: "21/02/2026",
    estadoEvento: "Finalizado",
    metricas: {
      vendidosConsultados: "5,420",
      checkinRealizado: "4,980",
      sinCheckin: "403",
      sinInformacionIngreso: "37",
      coberturaConsulta: "100%",
      totalProcesado: "5,420",
    },
    rows: [
      {
        estado: "Check-in realizado",
        descripcion: "Ticket con ingreso confirmado durante la operacion del evento",
        tickets: "4,980",
        usoFinanciero: "Asistio",
        resultado: "Incluido en conciliacion",
        highlight: "success",
      },
      {
        estado: "Sin check-in registrado",
        descripcion: "Ticket vendido sin evidencia de ingreso al recinto",
        tickets: "403",
        usoFinanciero: "No asistio",
        resultado: "Clasificado como no asistido",
        highlight: "neutral",
      },
      {
        estado: "Sin informacion de ingreso",
        descripcion: "No se recibio trazabilidad de acceso; el sistema debe asumir no asistencia",
        tickets: "37",
        usoFinanciero: "Revision",
        resultado: "No asistido por regla de negocio",
        highlight: "warning",
      },
      {
        estado: "Total procesado",
        descripcion: "Total de tickets con estado de ingreso valido para la liquidacion",
        tickets: "5,420",
        usoFinanciero: "Listo para calculo",
        resultado: "100% cobertura",
        total: true,
      },
    ],
  },
  "EV-24100": {
    controlId: "ACC-24100",
    fechaEvento: "10/08/2026",
    estadoEvento: "No inicia",
    metricas: {
      vendidosConsultados: "3,870",
      checkinRealizado: "0",
      sinCheckin: "0",
      sinInformacionIngreso: "3,870",
      coberturaConsulta: "100%",
      totalProcesado: "3,870",
    },
    rows: [
      {
        estado: "Check-in realizado",
        descripcion: "Ticket con ingreso confirmado durante la operacion del evento",
        tickets: "0",
        usoFinanciero: "Asistio",
        resultado: "Sin movimiento",
        highlight: "success",
      },
      {
        estado: "Sin check-in registrado",
        descripcion: "Ticket vendido sin evidencia de ingreso al recinto",
        tickets: "0",
        usoFinanciero: "No asistio",
        resultado: "Sin movimiento",
        highlight: "neutral",
      },
      {
        estado: "Sin informacion de ingreso",
        descripcion: "No se recibio trazabilidad de acceso; el sistema debe asumir no asistencia",
        tickets: "3,870",
        usoFinanciero: "Revision",
        resultado: "Pendiente por inicio de evento",
        highlight: "warning",
      },
      {
        estado: "Total procesado",
        descripcion: "Total de tickets con estado de ingreso valido para la liquidacion",
        tickets: "3,870",
        usoFinanciero: "Listo para calculo",
        resultado: "100% cobertura",
        total: true,
      },
    ],
  },
  "EV-24399": {
    controlId: "ACC-24399",
    fechaEvento: "15/04/2026",
    estadoEvento: "Finalizado",
    metricas: {
      vendidosConsultados: "0",
      checkinRealizado: "0",
      sinCheckin: "0",
      sinInformacionIngreso: "0",
      coberturaConsulta: "100%",
      totalProcesado: "0",
    },
    rows: [
      { estado: "Check-in realizado", descripcion: "Sin movimiento", tickets: "0", usoFinanciero: "Asistio", resultado: "Sin movimiento", highlight: "success" },
      { estado: "Sin check-in registrado", descripcion: "Sin movimiento", tickets: "0", usoFinanciero: "No asistio", resultado: "Sin movimiento", highlight: "neutral" },
      { estado: "Sin informacion de ingreso", descripcion: "Sin movimiento", tickets: "0", usoFinanciero: "Revision", resultado: "Sin movimiento", highlight: "warning" },
      { estado: "Total procesado", descripcion: "Sin base", tickets: "0", usoFinanciero: "Listo para calculo", resultado: "100% cobertura", total: true },
    ],
  },
};

const tipoRecintoPorEvento: Record<string, TipoRecintoEventoData> = {
  "EV-24021": {
    recintoId: "RC-1028",
    estadoRecinto: "ESTADO ACTIVO",
    ciudad: "Bogota",
    ultimaModificacion: "21/02/2026",
    eventosAsociados: "24",
    recintoNombre: "Coliseo Central",
    consultaPlaceholder: "Consultar recinto Coliseo Central",
    ctaLabel: "Ver detalle",
    badgeLabel: "Configuracion valida",
    tipoLabel: "Estadio",
    tasaLabel: "12%",
    aplicacionLabel: "Automatica",
    alertaTitulo: "Configuracion valida",
    alertaDescripcion: "El tipo informado permite asignar automaticamente la tasa de comision del recinto.",
    rightTitle: "Cuando el tipo es Estadio, el sistema asigna la tasa correspondiente.",
    rightDescription: "Esta vista deja clara la relacion entre tipo de recinto y tasa de comision aplicada.",
    functionalRequirements: "FR-001, FR-002 y FR-005 visibles en una sola pantalla: consulta del tipo, tasa asociada y disponibilidad operativa para revision financiera.",
    tableHeaders: ["REGLA", "VALOR", "RESULTADO"],
    rows: [
      { control: "Tipo informado", estado: "Estadio", accion: "Valido" },
      { control: "Tasa asociada", estado: "Comision por tipo estadio", accion: "12%" },
      { control: "Consulta disponible", estado: "Tipo y tasa visibles", accion: "Aprobado" },
    ],
    escenario: "exitoso",
  },
  "EV-24100": {
    recintoId: "RC-3104",
    estadoRecinto: "ESTADO ACTIVO",
    ciudad: "Cali",
    ultimaModificacion: "22/02/2026",
    eventosAsociados: "41",
    recintoNombre: "Teatro Mayor",
    consultaPlaceholder: "Consultar recinto Teatro Mayor",
    ctaLabel: "Solicitar permisos",
    badgeLabel: "Cambio bloqueado",
    tipoLabel: "Teatro",
    tasaLabel: "8%",
    aplicacionLabel: "A Estadio",
    alertaTitulo: "Operacion bloqueada",
    alertaDescripcion: "No es posible cambiar el tipo de un recinto existente desde esta vista. Se requieren permisos de administrador del sistema.",
    rightTitle: "El cambio de tipo se bloquea y se deriva a permisos de administrador del sistema.",
    rightDescription: "La pantalla mantiene visible el tipo actual y la tasa vigente, pero separa la consulta permitida de la accion restringida.",
    functionalRequirements: "FR-004, FR-005 y FR-006 presentes: bloqueo de cambio, permanencia del tipo y preparacion para administracion de tasas por tipo.",
    tableHeaders: ["SOLICITUD", "MOTIVO", "RESULTADO"],
    rows: [
      { control: "Cambio Teatro -> Estadio", estado: "Impacta tasa y calculo financiero", accion: "Requiere aprobacion" },
      { control: "Consulta de tasa", estado: "Permitida", accion: "8% visible" },
    ],
    escenario: "CambioDeTipoRecintoBloqueado",
  },
  "EV-24205": {
    recintoId: "RC-2041",
    estadoRecinto: "ESTADO EN REVISION",
    ciudad: "Medellin",
    ultimaModificacion: "22/02/2026",
    eventosAsociados: "0",
    recintoNombre: "Arena Norte",
    consultaPlaceholder: "Consultar recinto Arena Norte",
    ctaLabel: "Reintentar validacion",
    badgeLabel: "Configuracion incompleta",
    tipoLabel: "No definido",
    tasaLabel: "-",
    aplicacionLabel: "Bloqueada",
    alertaTitulo: "Error: no tiene tipo de recinto asignado",
    alertaDescripcion: "El sistema impide creacion o actualizacion del registro hasta que se seleccione Estadio o Teatro y se asigne una tasa valida.",
    rightTitle: "Si el recinto no tiene tipo asignado, se muestra error y la operacion queda bloqueada.",
    rightDescription: "La pantalla es independiente y comunica claramente el estado invalido sin mezclarlo con la vista exitosa.",
    functionalRequirements: "FR-003 visible: el sistema impide creacion o actualizacion de un recinto sin tipo asignado y deja el bloqueo explicito para auditoria.",
    tableHeaders: ["CONTROL", "ESTADO", "ACCION"],
    rows: [
      { control: "Tipo obligatorio", estado: "Incumplido", accion: "Seleccionar tipo" },
      { control: "Tasa automatica", estado: "No disponible", accion: "Pendiente" },
    ],
    escenario: "RecintoSinTipoAsignado",
  },
  "EV-24399": {
    recintoId: "RC-9999",
    estadoRecinto: "ESTADO NO ENCONTRADO",
    ciudad: "N/A",
    ultimaModificacion: "15/04/2026",
    eventosAsociados: "0",
    recintoNombre: "Recinto no registrado",
    consultaPlaceholder: "Consultar recinto RC-9999",
    ctaLabel: "Buscar por ID",
    badgeLabel: "Registro bloqueado",
    tipoLabel: "No definido",
    tasaLabel: "-",
    aplicacionLabel: "Bloqueada",
    alertaTitulo: "El recinto no está registrado",
    alertaDescripcion: "No es posible continuar con este identificador hasta corregir el ID.",
    rightTitle: "Recinto inexistente",
    rightDescription: "El sistema rechaza operaciones para IDs no registrados.",
    functionalRequirements: "FR-003 y FR-005.",
    tableHeaders: ["CONTROL", "ESTADO", "ACCION"],
    rows: [{ control: "Existencia de ID", estado: "No encontrado", accion: "Corregir ID" }],
    escenario: "RecintoSinTipoAsignado",
  },
};

const ingresosTicketsPorEvento: Record<string, IngresosTicketsEventoData> = {
  "EV-24021": {
    resumenId: "4092",
    estadoEvento: "Finalizado",
    estadoLiquidacion: "Liquidado",
    metricas: {
      vendidos: "15,420",
      validados: "14,100",
      noAsistio: "1,020",
      cortesias: "250",
      cancelados: "50",
    },
    recaudoBruto: "$ 1,923,400,000",
  },
  "EV-24100": {
    resumenId: "4103",
    estadoEvento: "No inicia",
    estadoLiquidacion: "Pendiente",
    metricas: {
      vendidos: "3,870",
      validados: "0",
      noAsistio: "0",
      cortesias: "130",
      cancelados: "42",
    },
    recaudoBruto: "$ 691,300,000",
  },
  "EV-24205": {
    resumenId: "4120",
    estadoEvento: "Finalizado",
    estadoLiquidacion: "En revision",
    metricas: {
      vendidos: "1,260",
      validados: "1,012",
      noAsistio: "198",
      cortesias: "34",
      cancelados: "16",
    },
    recaudoBruto: "$ 184,000,000",
  },
  "EV-24399": {
    resumenId: "4199",
    estadoEvento: "Finalizado",
    estadoLiquidacion: "Pendiente",
    metricas: {
      vendidos: "0",
      validados: "0",
      noAsistio: "0",
      cortesias: "0",
      cancelados: "0",
    },
    recaudoBruto: "$ 0",
  },
};

const tipoLiquidacionPorEvento: Record<string, TipoLiquidacionEventoData> = {
  "EV-24021": {
    recintoNombre: "Recinto 1",
    tipoLiquidacion: "Tarifa Plana",
    valorLabel: "Monto Fijo ($)",
    valor: "5000",
    mostrarError: false,
    errorMensaje: "",
    escenario: "exitoso",
  },
  "EV-24100": {
    recintoNombre: "No existente",
    tipoLiquidacion: "Reparto de ingresos",
    valorLabel: "Porcentaje de Comision (%)",
    valor: "15",
    mostrarError: true,
    errorMensaje: "Error, no se puede asignar un tipo a un recinto no existente..",
    escenario: "casoBordeRecintoNoExiste",
  },
  "EV-24205": {
    recintoNombre: "Recinto 2",
    tipoLiquidacion: "Tarifa Plana",
    valorLabel: "Monto Fijo ($)",
    valor: "3200",
    mostrarError: false,
    errorMensaje: "",
    escenario: "exitoso",
  },
  "EV-24399": {
    recintoNombre: "No existente",
    tipoLiquidacion: "Reparto de ingresos",
    valorLabel: "Porcentaje de Comision (%)",
    valor: "0",
    mostrarError: true,
    errorMensaje: "Error, no se puede asignar un tipo a un recinto no existente..",
    escenario: "casoBordeRecintoNoExiste",
  },
};

const comisionRecintoPorEvento: Record<string, ComisionRecintoData> = {
  "EV-24021": {
    tituloPantalla: "Pantalla 1 · Registro inicial",
    subtituloPantalla: "Registro de comision para un recinto existente que no tenia configuracion previa.",
    pillPantalla: "Éxito",
    recintoInput: "Recinto #RC-1028 seleccionado",
    accionLabel: "Guardar comisión",
    idRecinto: "#RC-1028",
    nombreRecinto: "Coliseo Central",
    metaRecinto: "Tipo: Estadio | Fecha registro: 21/02/2026",
    badgeEstado: "Comisión guardada",
    tipoComision: "Porcentaje",
    valorPrincipalLabel: "Valor asignado",
    valorPrincipal: "10%",
    rows: [
      { campo: "ID Recinto", datoIngresado: "#RC-1028", validacion: "Existente" },
      { campo: "Valor", datoIngresado: "10%", validacion: "Numérico válido" },
    ],
    escenario: "comisionGuardada",
  },
  "EV-24100": {
    tituloPantalla: "Pantalla 2 · Actualización de comisión",
    subtituloPantalla: "El recinto ya tenia una comision y el administrador ingresa un nuevo valor para actualizarla.",
    pillPantalla: "Éxito",
    recintoInput: "Recinto #RC-3104 seleccionado",
    accionLabel: "Actualizar comisión",
    idRecinto: "#RC-3104",
    nombreRecinto: "Teatro Mayor",
    metaRecinto: "Tipo: Teatro | Última actualización: Hoy",
    badgeEstado: "Comisión actualizada",
    tipoComision: "Valor Fijo",
    valorPrincipalLabel: "Nuevo valor",
    valorPrincipal: "$15,000",
    valorExtraLabel: "Valor anterior",
    valorExtra: "$12,000",
    rows: [
      { campo: "ID Recinto", datoIngresado: "#RC-3104", validacion: "Existente" },
      { campo: "Valor", datoIngresado: "$15,000", validacion: "Numérico válido" },
    ],
    escenario: "ActualizarComision",
  },
  "EV-24205": {
    tituloPantalla: "Pantalla 4 · Valor inválido",
    subtituloPantalla: "El administrador intenta registrar un valor negativo o vacio para la comisión.",
    pillPantalla: "Advertencia",
    recintoInput: "Recinto #RC-2041 seleccionado",
    accionLabel: "Corregir monto",
    idRecinto: "#RC-2041",
    nombreRecinto: "Arena Norte",
    metaRecinto: "Tipo: Estadio",
    badgeEstado: "Datos inválidos",
    tipoComision: "Porcentaje",
    valorPrincipalLabel: "Valor ingresado",
    valorPrincipal: "-5%",
    alertaTitulo: "Valor de comisión inválido",
    alertaDescripcion: "El sistema rechaza el registro. Debe ingresar un valor numérico válido mayor o igual a cero.",
    rows: [
      { campo: "ID Recinto", datoIngresado: "#RC-2041", validacion: "Existente" },
      { campo: "Valor", datoIngresado: "-5%", validacion: "Inválido" },
    ],
    escenario: "ValorComisionInvalido",
  },
  "EV-24399": {
    tituloPantalla: "Pantalla 3 · Recinto inexistente",
    subtituloPantalla: "Intento de registrar comisión en un recinto que no se encuentra en el sistema.",
    pillPantalla: "Error Crítico",
    recintoInput: "ID ingresado: #RC-9999",
    accionLabel: "Buscar otro ID",
    idRecinto: "#RC-9999",
    nombreRecinto: "ID: #RC-9999",
    metaRecinto: "Operación rechazada",
    badgeEstado: "Registro bloqueado",
    tipoComision: "No aplica",
    valorPrincipalLabel: "Estado",
    valorPrincipal: "No encontrado",
    alertaTitulo: "El recinto no está registrado",
    alertaDescripcion: "No es posible registrar una comisión para un identificador de recinto inexistente. Verifique el ID e intente nuevamente.",
    rows: [{ campo: "Existencia de ID", datoIngresado: "No encontrado", validacion: "Corregir ID" }],
    escenario: "ComisionRecintoInexistente",
  },
};

const consultaComisionRecintoPorEvento: Record<string, ConsultarComisionRecintoData> = {
  "EV-24021": {
    recintoId: "#8821",
    nombreRecinto: "Teatro Mayor Julio Mario Santo Domingo",
    tipoRecinto: "Teatro",
    tipoComision: "Reparto de Ingresos",
    valorComision: "15%",
    estadoConfiguracion: "Registrada y Activa",
    descripcionValor: "Sobre venta bruta de tickets",
    otrosRecintos: [
      { id: "#RC-1028", nombre: "Coliseo Central", tipo: "Estadio", comision: "12%" },
      { id: "#RC-3104", nombre: "Teatro Mayor", tipo: "Teatro", comision: "$15,000" },
      { id: "#RC-2041", nombre: "Arena Norte", tipo: "Estadio", comision: "10%" },
    ],
  },
  "EV-24100": {
    recintoId: "#3104",
    nombreRecinto: "Teatro Mayor",
    tipoRecinto: "Teatro",
    tipoComision: "Valor Fijo",
    valorComision: "$15,000",
    estadoConfiguracion: "Registrada y Activa",
    descripcionValor: "Monto fijo por evento",
    otrosRecintos: [
      { id: "#RC-1028", nombre: "Coliseo Central", tipo: "Estadio", comision: "12%" },
      { id: "#RC-2041", nombre: "Arena Norte", tipo: "Estadio", comision: "10%" },
    ],
  },
  "EV-24205": {
    recintoId: "#2041",
    nombreRecinto: "Arena Norte",
    tipoRecinto: "Estadio",
    tipoComision: "Porcentaje",
    valorComision: "10%",
    estadoConfiguracion: "Registrada y Activa",
    descripcionValor: "Sobre venta bruta de tickets",
    otrosRecintos: [
      { id: "#RC-1028", nombre: "Coliseo Central", tipo: "Estadio", comision: "12%" },
      { id: "#RC-3104", nombre: "Teatro Mayor", tipo: "Teatro", comision: "$15,000" },
    ],
  },
  "EV-24399": {
    recintoId: "#9999",
    nombreRecinto: "Recinto no registrado",
    tipoRecinto: "No definido",
    tipoComision: "Sin configuración",
    valorComision: "N/A",
    estadoConfiguracion: "Registrada y Activa",
    descripcionValor: "Sin datos disponibles",
    otrosRecintos: [{ id: "#RC-1028", nombre: "Coliseo Central", tipo: "Estadio", comision: "12%" }],
  },
};

const distribucionPorEvento: Record<string, CalculoDistribucionData> = {
  "EV-24021": {
    calculoId: "CD-24021",
    fechaCalculo: "2026-02-21",
    estadoLiquidacion: "Finalizado",
    metricas: {
      totalBruto: "$ 328,450,000",
      ticketsCancelados: "185",
      cortesias: "255",
      totalNetoPreliminar: "$ 328,450,000",
      comisionPlataforma: "$ 32,845,000",
      comisionRecinto: "$ 39,414,000",
      totalDistribuible: "$ 256,191,000",
      pagaPromotor: "$ 200,000,000",
    },
    rows: [
      { concepto: "Total bruto", descripcion: "Bruto antes de descuentos", valor: "$ 328,450,000" },
      { concepto: "Cancelaciones", descripcion: "Tickets cancelados", valor: "- $ 9,250,000", porcentaje: "2.8%" },
      { concepto: "Cortesias", descripcion: "Tickets sin ingreso", valor: "$ 0" },
      { concepto: "Total distribuible", descripcion: "Neto final a distribuir", valor: "$ 256,191,000", total: true, destacado: true },
    ],
    puedeCalcular: true,
  },
  "EV-24100": {
    calculoId: "CD-24100",
    fechaCalculo: "2026-08-10",
    estadoLiquidacion: "Pendiente",
    metricas: {
      totalBruto: "$ 691,300,000",
      ticketsCancelados: "42",
      cortesias: "130",
      totalNetoPreliminar: "$ 691,300,000",
      comisionPlataforma: "$ 69,130,000",
      comisionRecinto: "$ 41,000,000",
      totalDistribuible: "$ 581,170,000",
      pagaPromotor: "$ 400,000,000",
    },
    rows: [],
    puedeCalcular: false,
    razonBloqueo: "Evento no iniciado, no es posible calcular aún.",
  },
  "EV-24205": {
    calculoId: "CD-24205",
    fechaCalculo: "2026-03-02",
    estadoLiquidacion: "En revision",
    metricas: {
      totalBruto: "$ 184,000,000",
      ticketsCancelados: "16",
      cortesias: "34",
      totalNetoPreliminar: "$ 184,000,000",
      comisionPlataforma: "$ 18,400,000",
      comisionRecinto: "$ 22,080,000",
      totalDistribuible: "$ 143,520,000",
      pagaPromotor: "$ 111,945,600",
    },
    rows: [
      { concepto: "Total bruto", descripcion: "Bruto antes de descuentos", valor: "$ 184,000,000" },
      { concepto: "Cancelaciones", descripcion: "Tickets cancelados", valor: "- $ 1,600,000", porcentaje: "0.9%" },
      { concepto: "Cortesias", descripcion: "Tickets sin ingreso", valor: "- $ 3,400,000", porcentaje: "1.8%" },
      { concepto: "Total distribuible", descripcion: "Neto final a distribuir", valor: "$ 143,520,000", total: true, destacado: true },
    ],
    puedeCalcular: true,
  },
  "EV-24399": {
    calculoId: "CD-24399",
    fechaCalculo: "2026-04-15",
    estadoLiquidacion: "Pendiente",
    metricas: {
      totalBruto: "$ 0",
      ticketsCancelados: "0",
      cortesias: "0",
      totalNetoPreliminar: "$ 0",
      comisionPlataforma: "$ 0",
      comisionRecinto: "$ 0",
      totalDistribuible: "$ 0",
      pagaPromotor: "$ 0",
    },
    rows: [
      { concepto: "Total bruto", descripcion: "Sin movimiento", valor: "$ 0" },
      { concepto: "Cancelaciones", descripcion: "Sin movimiento", valor: "$ 0", porcentaje: "-" },
      { concepto: "Cortesias", descripcion: "Sin movimiento", valor: "$ 0", porcentaje: "-" },
      { concepto: "Total distribuible", descripcion: "Sin base financiera", valor: "$ 0", total: true, destacado: true },
    ],
    puedeCalcular: false,
    razonBloqueo: "No existen ventas liquidadas para este evento.",
  },
};

const consultarDistribucionPorEvento: Record<string, ConsultarDistribucionRecaudoData> = {
  "EV-24021": {
    distribucionId: "4092",
    estadoLiquidacion: "Preliminar",
    totalBrutoRecaudado: "$1,250,000.00",
    totalComisiones: "$312,500.00",
    totalDistribuible: "$937,500.00",
    recintoAsociado: "Teatro Mayor",
    modeloComisionRecinto: "Reparto de Ingresos (15%)",
    comisionPlataforma: "10% sobre Bruto",
    fechaCalculo: "21 Feb 2026, 14:30",
    detalle: [
      { concepto: "Total bruto recaudado", descripcion: "Venta total de tickets del evento", porcentaje: "-", valor: "$1,250,000.00" },
      { concepto: "Comision plataforma", descripcion: "10% aplicado sobre bruto", porcentaje: "10%", valor: "-$125,000.00" },
      { concepto: "Comision recinto", descripcion: "Reparto de ingresos del recinto", porcentaje: "15%", valor: "-$187,500.00" },
      { concepto: "Total distribuible", descripcion: "Monto neto disponible para reparto final", porcentaje: "-", valor: "$937,500.00", total: true },
    ],
  },
  "EV-24100": {
    distribucionId: "4103",
    estadoLiquidacion: "Pendiente",
    totalBrutoRecaudado: "$0.00",
    totalComisiones: "$0.00",
    totalDistribuible: "$0.00",
    recintoAsociado: "Estadio El Campin",
    modeloComisionRecinto: "Sin liquidacion",
    comisionPlataforma: "No aplica",
    fechaCalculo: "Sin calculo",
    detalle: [
      { concepto: "Sin distribucion", descripcion: "El evento aun no tiene liquidacion disponible", porcentaje: "-", valor: "$0.00", total: true },
    ],
  },
  "EV-24205": {
    distribucionId: "4120",
    estadoLiquidacion: "En revision",
    totalBrutoRecaudado: "$184,000,000.00",
    totalComisiones: "$40,480,000.00",
    totalDistribuible: "$143,520,000.00",
    recintoAsociado: "Arena Norte",
    modeloComisionRecinto: "Porcentaje (12%)",
    comisionPlataforma: "10% sobre Bruto",
    fechaCalculo: "02 Mar 2026, 20:10",
    detalle: [
      { concepto: "Total bruto recaudado", descripcion: "Venta total de tickets del evento", porcentaje: "-", valor: "$184,000,000.00" },
      { concepto: "Comision plataforma", descripcion: "10% aplicado sobre bruto", porcentaje: "10%", valor: "-$18,400,000.00" },
      { concepto: "Comision recinto", descripcion: "Comision del recinto sobre neto preliminar", porcentaje: "12%", valor: "-$22,080,000.00" },
      { concepto: "Total distribuible", descripcion: "Monto neto disponible para reparto final", porcentaje: "-", valor: "$143,520,000.00", total: true },
    ],
  },
  "EV-24399": {
    distribucionId: "4199",
    estadoLiquidacion: "Pendiente",
    totalBrutoRecaudado: "$0.00",
    totalComisiones: "$0.00",
    totalDistribuible: "$0.00",
    recintoAsociado: "Por definir",
    modeloComisionRecinto: "Sin configuracion",
    comisionPlataforma: "No aplica",
    fechaCalculo: "Sin calculo",
    detalle: [
      { concepto: "Sin distribucion", descripcion: "No hay datos financieros para consultar distribucion", porcentaje: "-", valor: "$0.00", total: true },
    ],
  },
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const getEstadoEvento = (fechaInicio: string, fechaFin: string): EstadoEvento => {
  const hoy = new Date();
  const inicio = new Date(`${fechaInicio}T00:00:00`);
  const fin = new Date(`${fechaFin}T23:59:59`);

  if (hoy < inicio) return "No inicia";
  if (hoy > fin) return "Finalizado";
  return "En curso";
};

const estadoClasses: Record<EstadoEvento, string> = {
  "No inicia": "bg-[#ece9f5] text-[#4f4474]",
  "En curso": "bg-[#deebff] text-[#1d4ed8]",
  "Finalizado": "bg-[#e5f6ea] text-[#166534]",
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("index");
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoMenu | null>(null);

  const resumenEventoSeleccionado = eventoSeleccionado ? resumenesPorEvento[eventoSeleccionado.id] : null;
  const estadoIngresoEventoSeleccionado = eventoSeleccionado ? estadosIngresoPorEvento[eventoSeleccionado.id] : null;
  const tipoRecintoEventoSeleccionado = eventoSeleccionado ? tipoRecintoPorEvento[eventoSeleccionado.id] : null;
  const ingresosTicketsEventoSeleccionado = eventoSeleccionado ? ingresosTicketsPorEvento[eventoSeleccionado.id] : null;
  const tipoLiquidacionEventoSeleccionado = eventoSeleccionado ? tipoLiquidacionPorEvento[eventoSeleccionado.id] : null;
  const comisionRecintoEventoSeleccionado = eventoSeleccionado ? comisionRecintoPorEvento[eventoSeleccionado.id] : null;
  const consultaComisionRecintoEventoSeleccionado = eventoSeleccionado ? consultaComisionRecintoPorEvento[eventoSeleccionado.id] : null;
  const distribucionEventoSeleccionado = eventoSeleccionado ? distribucionPorEvento[eventoSeleccionado.id] : null;
  const consultaDistribucionEventoSeleccionado = eventoSeleccionado ? consultarDistribucionPorEvento[eventoSeleccionado.id] : null;

  const getEventoById = (eventoId: string | null) => eventos.find((item) => item.id === eventoId) ?? null;

  const applyNavigationState = (state: NavigationState) => {
    setScreen(state.screen);
    setEventoSeleccionado(getEventoById(state.eventoId));
  };

  const navigateTo = (nextScreen: Screen, nextEvento?: EventoMenu | null) => {
    const resolvedEvento = nextEvento !== undefined ? nextEvento : eventoSeleccionado;
    const navState: NavigationState = {
      screen: nextScreen,
      eventoId: resolvedEvento?.id ?? null,
    };
    setScreen(nextScreen);
    setEventoSeleccionado(resolvedEvento ?? null);
    window.history.pushState(navState, "");
  };

  useEffect(() => {
    const initialState: NavigationState = { screen: "index", eventoId: null };
    window.history.replaceState(initialState, "");

    const onPopState = (event: PopStateEvent) => {
      const state = event.state as NavigationState | null;
      if (!state || !state.screen) {
        applyNavigationState(initialState);
        return;
      }
      applyNavigationState(state);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppLayout>
          {screen === "index" && (
            <div className="px-8 md:px-12 py-10">
              <h1 className="text-4xl font-semibold text-[#1f1a37] mb-2">Eventos</h1>
              <p className="text-lg text-[#6f6990] mb-8">Selecciona un evento</p>

              <div className="grid gap-4">
                {eventos.map((evento) => {
                  const estado = getEstadoEvento(evento.fechaInicio, evento.fechaFin);
                  return (
                    <Card key={evento.id} className="p-5 border border-[#d7d1e9] bg-white">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold text-[#1f1a37]">{evento.nombre}</h2>
                          <p className="text-sm text-[#6f6990] mt-1">ID unico: {evento.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${estadoClasses[estado]}`}>{estado}</span>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-[#4f4474] md:grid-cols-2">
                        <p><strong>Fecha de Inicio:</strong> {formatDate(evento.fechaInicio)}</p>
                        <p><strong>Fecha de Fin:</strong> {formatDate(evento.fechaFin)}</p>
                        <p><strong>Tipo:</strong> {evento.tipo}</p>
                        <p><strong>Recinto:</strong> {evento.recinto}</p>
                      </div>
                      <div className="mt-5">
                        <Button className="bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("eventoAcciones", evento)}>
                          Realizar acciones
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {screen === "eventoAcciones" && eventoSeleccionado && (
            <div className="px-8 md:px-12 py-10">
              <Button variant="ghost" className="mb-6 text-[#4f4474] hover:bg-[#d8d2e8]" onClick={() => navigateTo("index", null)}>
                Volver a eventos
              </Button>

              <h1 className="text-3xl font-semibold text-[#1f1a37]">{eventoSeleccionado.nombre}</h1>
              <p className="text-[#6f6990] mt-2">
                ID: {eventoSeleccionado.id} | Tipo: {eventoSeleccionado.tipo} | Recinto: {eventoSeleccionado.recinto}
              </p>
              <p className="text-[#6f6990]">
                Inicio: {formatDate(eventoSeleccionado.fechaInicio)} | Fin: {formatDate(eventoSeleccionado.fechaFin)}
              </p>

              <div className="mt-8">
                <p className="text-lg text-[#6f6990] mb-4">Selecciona una accion</p>
                <div className="max-w-3xl grid gap-3">
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("consultarResumenDeVentas")}>
                    Consultar resumen de ventas
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("consultarEstadoIngreso")}>
                    Estado de ingreso
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("informarTipoRecinto")}>
                    Informar tipo de recinto
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("consultarIngresosTickets")}>
                    Consultar ingresos tickets
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("determinarTipoLiquidacionFinal")}>
                    Determinar tipo liquidacion final
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("registrarValorComisionRecinto")}>
                    Registrar valor comision recinto
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("consultarValorComisionRecinto")}>
                    Consultar valor comision recinto
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("calcularDistribucionDelRecaudo")}>
                    Calcular distribución del recaudo
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("consultarDistribucionDelRecaudo")}>
                    Consultar distribucion del recaudo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {screen === "consultarResumenDeVentas" && eventoSeleccionado && resumenEventoSeleccionado && (
            <Feature01ConsultarResumenDeVentasPage
              onBack={() => navigateTo("eventoAcciones")}
              evento={{ id: eventoSeleccionado.id, nombre: eventoSeleccionado.nombre }}
              resumen={resumenEventoSeleccionado}
            />
          )}

          {screen === "consultarEstadoIngreso" && eventoSeleccionado && estadoIngresoEventoSeleccionado && (
            <Feature02ConsultarEstadoIngresoPage
              onBack={() => navigateTo("eventoAcciones")}
              evento={{ id: eventoSeleccionado.id, nombre: eventoSeleccionado.nombre }}
              estadoIngreso={estadoIngresoEventoSeleccionado}
            />
          )}

          {screen === "informarTipoRecinto" && eventoSeleccionado && tipoRecintoEventoSeleccionado && (
            <Feature03InformarTipoDeRecintoPage
              onBack={() => navigateTo("eventoAcciones")}
              evento={{ id: eventoSeleccionado.id, nombre: eventoSeleccionado.nombre }}
              tipoRecinto={tipoRecintoEventoSeleccionado}
            />
          )}

          {screen === "consultarIngresosTickets" && eventoSeleccionado && ingresosTicketsEventoSeleccionado && (
            <Feature04ConsultarIngresosTicketsPage
              onBack={() => navigateTo("eventoAcciones")}
              evento={{ id: eventoSeleccionado.id, nombre: eventoSeleccionado.nombre }}
              ingresos={ingresosTicketsEventoSeleccionado}
            />
          )}

          {screen === "determinarTipoLiquidacionFinal" && eventoSeleccionado && tipoLiquidacionEventoSeleccionado && (
            <Feature05DeterminarTipoLiquidacionFinalPage
              onBack={() => navigateTo("eventoAcciones")}
              evento={{ id: eventoSeleccionado.id, nombre: eventoSeleccionado.nombre }}
              liquidacion={tipoLiquidacionEventoSeleccionado}
            />
          )}

          {screen === "registrarValorComisionRecinto" && eventoSeleccionado && comisionRecintoEventoSeleccionado && (
            <Feature06RegistrarValorComisionRecintoPage
              onBack={() => navigateTo("eventoAcciones")}
              evento={{ id: eventoSeleccionado.id, nombre: eventoSeleccionado.nombre }}
              comision={comisionRecintoEventoSeleccionado}
            />
          )}

          {screen === "consultarValorComisionRecinto" && eventoSeleccionado && consultaComisionRecintoEventoSeleccionado && (
            <Feature07ConsultarValorComisionRecintoPage
              onBack={() => navigateTo("eventoAcciones")}
              evento={{ id: eventoSeleccionado.id, nombre: eventoSeleccionado.nombre }}
              consulta={consultaComisionRecintoEventoSeleccionado}
            />
          )}

          {screen === "calcularDistribucionDelRecaudo" && eventoSeleccionado && distribucionEventoSeleccionado && (
            <Feature08CalcularDistribucionDelRecaudoPage
              onBack={() => navigateTo("eventoAcciones")}
              evento={{ id: eventoSeleccionado.id, nombre: eventoSeleccionado.nombre, recintoTipo: tipoRecintoEventoSeleccionado?.tipoLabel ?? eventoSeleccionado.recinto }}
              distribucion={distribucionEventoSeleccionado}
              onCalcular={() => {}}
            />
          )}

          {screen === "consultarDistribucionDelRecaudo" && eventoSeleccionado && consultaDistribucionEventoSeleccionado && (
            <Feature09ConsultarDistribucionDelRecaudoPage
              onBack={() => navigateTo("eventoAcciones")}
              evento={{ id: eventoSeleccionado.id, nombre: eventoSeleccionado.nombre }}
              consulta={consultaDistribucionEventoSeleccionado}
            />
          )}
        </AppLayout>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

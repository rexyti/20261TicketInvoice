import { useQuery } from "@tanstack/react-query";
import { api } from "@/core/api/client";
import type {
  ResumenVentasResponse,
  EstadoIngresoResponse,
  IngresosResponse,
} from "../models/eventos.types";

const EVENTOS_KEYS = {
  all: ["eventos"] as const,
  list: () => [...EVENTOS_KEYS.all, "list"] as const,
  detail: (eventoId: number) => [...EVENTOS_KEYS.all, "detail", eventoId] as const,
  resumenVentas: (eventoId: number) => [...EVENTOS_KEYS.all, "resumen-ventas", eventoId] as const,
  estadoIngreso: (eventoId: number) => [...EVENTOS_KEYS.all, "estado-ingreso", eventoId] as const,
  ingresos: (eventoId: number) => [...EVENTOS_KEYS.all, "ingresos", eventoId] as const,
  recinto: (recintoId: number) => [...EVENTOS_KEYS.all, "recinto", recintoId] as const,
  configuracionLiquidacion: (eventoId: number) => [...EVENTOS_KEYS.all, "configuracion-liquidacion", eventoId] as const,
  comisionRecinto: (recintoId: number) => [...EVENTOS_KEYS.all, "comision-recinto", recintoId] as const,
  distribucionRecaudo: (eventoId: number) => [...EVENTOS_KEYS.all, "distribucion-recaudo", eventoId] as const,
  calcularDistribucion: (eventoId: number) => [...EVENTOS_KEYS.all, "calcular-distribucion", eventoId] as const,
};

// Tipos para listado de eventos
export interface EventoListItem {
  id: number;
  nombre: string;
  ciudad: string;
  estado: "PROGRAMADO" | "EN_CURSO" | "CERRADO" | "LIQUIDADO";
  fecha: string;
  capacidad: number;
  ticketsVendidos: number;
}

/**
 * Hook para obtener lista de eventos
 * Los eventos son consumidos desde otro microservicio de gestión de recintos.
 * Si el servicio no está disponible, se muestra el error correspondiente.
 */
export function useEventos() {
  return useQuery({
    queryKey: EVENTOS_KEYS.list(),
    queryFn: async () => {
      return api.get("eventos").json<EventoListItem[]>();
    },
    retry: false,
  });
}

/**
 * Hook para consultar el resumen de ventas de un evento
 */
export function useResumenVentas(eventoId?: number) {
  return useQuery<ResumenVentasResponse>({
    queryKey: eventoId ? EVENTOS_KEYS.resumenVentas(eventoId) : ["disabled"],
    queryFn: async () => {
      if (!eventoId) throw new Error("eventoId es requerido");
      return api.get(`eventos/${eventoId}/resumen-ventas`).json<ResumenVentasResponse>();
    },
    enabled: Boolean(eventoId),
  });
}

/**
 * Hook para consultar el estado de ingreso de un evento
 */
export function useEstadoIngreso(eventoId?: number) {
  return useQuery<EstadoIngresoResponse>({
    queryKey: eventoId ? EVENTOS_KEYS.estadoIngreso(eventoId) : ["disabled"],
    queryFn: async () => {
      if (!eventoId) throw new Error("eventoId es requerido");
      return api.get(`eventos/${eventoId}/estado-ingreso`).json<EstadoIngresoResponse>();
    },
    enabled: Boolean(eventoId),
  });
}

/**
 * Hook para consultar los ingresos de un evento
 */
export function useIngresosTickets(eventoId?: number) {
  return useQuery<IngresosResponse>({
    queryKey: eventoId ? EVENTOS_KEYS.ingresos(eventoId) : ["disabled"],
    queryFn: async () => {
      if (!eventoId) throw new Error("eventoId es requerido");
      return api.get(`eventos/${eventoId}/ingresos`).json<IngresosResponse>();
    },
    enabled: Boolean(eventoId),
  });
}

export interface ConsultarRecintoResponse {
  id: number;
  nombre: string;
  tipoRecinto: string;
  tasaComision: number;
  estado: string;
}

export function useRecinto(recintoId?: number) {
  return useQuery<ConsultarRecintoResponse>({
    queryKey: recintoId ? EVENTOS_KEYS.recinto(recintoId) : ["disabled"],
    queryFn: async () => {
      if (!recintoId) throw new Error("recintoId es requerido");
      return api.get(`recintos/${recintoId}`).json<ConsultarRecintoResponse>();
    },
    enabled: Boolean(recintoId),
  });
}

export interface DeterminarTipoLiquidacionResponse {
  id: number;
  eventoId: number;
  tipoLiquidacion: string;
  valorComision: number;
  porcentaje: number;
  mensaje: string;
}

export function useConfiguracionLiquidacion(eventoId?: number) {
  return useQuery<DeterminarTipoLiquidacionResponse>({
    queryKey: eventoId ? EVENTOS_KEYS.configuracionLiquidacion(eventoId) : ["disabled"],
    queryFn: async () => {
      if (!eventoId) throw new Error("eventoId es requerido");
      return api.get(`eventos/${eventoId}/configuracion-liquidacion`).json<DeterminarTipoLiquidacionResponse>();
    },
    enabled: Boolean(eventoId),
  });
}

export interface ComisionResponse {
  configurada: boolean;
  mensaje: string;
  tipoComision: string;
  valorComision: number;
}

export function useComisionRecinto(recintoId?: number) {
  return useQuery<ComisionResponse>({
    queryKey: recintoId ? EVENTOS_KEYS.comisionRecinto(recintoId) : ["disabled"],
    queryFn: async () => {
      if (!recintoId) throw new Error("recintoId es requerido");
      return api.get(`recintos/${recintoId}/comision`).json<ComisionResponse>();
    },
    enabled: Boolean(recintoId),
  });
}

export interface ConsultarDistribucionResponse {
  eventoId: number;
  nombreEvento: string;
  totalBruto: number;
  totalPagoPromotor: number;
  totalComisionPlataforma: number;
  totalDistribuible: number;
  estado: string;
  fechaCalculo: string;
  fechaLiquidacion: string;
}

export function useDistribucionRecaudo(eventoId?: number) {
  return useQuery<ConsultarDistribucionResponse>({
    queryKey: eventoId ? EVENTOS_KEYS.distribucionRecaudo(eventoId) : ["disabled"],
    queryFn: async () => {
      if (!eventoId) throw new Error("eventoId es requerido");
      return api.get(`eventos/${eventoId}/distribucion-recaudo`).json<ConsultarDistribucionResponse>();
    },
    enabled: Boolean(eventoId),
  });
}

export interface CalcularDistribucionResponse {
  eventoId: number;
  nombreEvento: string;
  totalBruto: number;
  totalNetoPreliminar: number;
  totalDistribuible: number;
  comisionPlataforma: number;
  descuentoCancelados: number;
  descuentoCortesia: number;
  estado: string;
  fechaCalculo: string;
  mensaje: string;
}

export function useCalcularDistribucion(eventoId?: number) {
  return useQuery<CalcularDistribucionResponse>({
    queryKey: eventoId ? EVENTOS_KEYS.calcularDistribucion(eventoId) : ["disabled"],
    queryFn: async () => {
      if (!eventoId) throw new Error("eventoId es requerido");
      return api.get(`eventos/${eventoId}/calcular-distribucion`).json<CalcularDistribucionResponse>();
    },
    enabled: Boolean(eventoId),
  });
}

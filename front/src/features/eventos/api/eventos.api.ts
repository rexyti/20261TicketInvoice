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
 * Mocks de eventos (datos realistas según specs)
 * Coinciden con: ResumenVentasResponse, EstadoIngresoResponse, IngresosResponse
 */
const MOCK_EVENTOS: EventoListItem[] = [
  {
    id: 1,
    nombre: "Festival Estéreo Capital 2026",
    ciudad: "Bogotá",
    estado: "CERRADO",
    fecha: "02/03/2026",
    capacidad: 25000,
    ticketsVendidos: 5420,
  },
  {
    id: 2,
    nombre: "Festival de Verano 2026",
    ciudad: "Medellín",
    estado: "LIQUIDADO",
    fecha: "15/02/2026",
    capacidad: 20000,
    ticketsVendidos: 15420,
  },
  {
    id: 3,
    nombre: "Concierto Rock - Teatro Mayor",
    ciudad: "Cali",
    estado: "CERRADO",
    fecha: "10/01/2026",
    capacidad: 5000,
    ticketsVendidos: 4980,
  },
  {
    id: 4,
    nombre: "Conferencia Tech Summit 2026",
    ciudad: "Bogotá",
    estado: "CERRADO",
    fecha: "05/03/2026",
    capacidad: 2000,
    ticketsVendidos: 1850,
  },
  {
    id: 5,
    nombre: "Festival Rock al Parque 2026",
    ciudad: "Bogotá",
    estado: "LIQUIDADO",
    fecha: "21/02/2026",
    capacidad: 30000,
    ticketsVendidos: 23450,
  },
];

/**
 * Hook para obtener lista de eventos
 */
export function useEventos() {
  return useQuery({
    queryKey: EVENTOS_KEYS.list(),
    queryFn: async () => {
      // Por ahora retorna mock, reemplazar con:
      // return api.get("eventos").json<EventoListItem[]>();
      return new Promise<EventoListItem[]>((resolve) => {
        setTimeout(() => resolve(MOCK_EVENTOS), 300);
      });
    },
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

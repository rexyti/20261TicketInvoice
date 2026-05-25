import { useEventos } from "../api/eventos.api";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { ChevronRight, AlertCircle } from "lucide-react";
import type { EventoListItem } from "../api/eventos.api";

interface EventosListPageProps {
  onSelectEvento: (evento: EventoListItem) => void;
}

export function EventosListPage({ onSelectEvento }: EventosListPageProps) {
  const { data: eventos, isLoading, error } = useEventos();

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "LIQUIDADO":
        return "default";
      case "CERRADO":
        return "secondary";
      case "EN_CURSO":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">Liquidación de Eventos</h1>
          <p className="text-gray-600 mt-2">Selecciona un evento para consultar el resumen de ventas y proceder con la liquidación</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-semibold">Error al cargar eventos</p>
              <p className="text-red-600 text-xs mt-1">{error instanceof Error ? error.message : "Error desconocido"}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="grid grid-cols-4 gap-4">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : !eventos || eventos.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-500">
              <p className="text-lg font-semibold">No hay eventos disponibles</p>
              <p className="text-sm mt-2">Intenta más tarde</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {eventos.map((evento) => (
              <Card
                key={evento.id}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                onClick={() => onSelectEvento(evento)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{evento.nombre}</h3>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-sm text-gray-600">{evento.ciudad}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <Badge variant={getEstadoBadge(evento.estado)}>{evento.estado}</Badge>
                          <span className="text-xs text-gray-500">ID: #{evento.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium">Capacidad</p>
                        <p className="text-lg font-bold text-blue-600 mt-1">
                          {evento.capacidad.toLocaleString("es-CO")}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium">Tickets Vendidos</p>
                        <p className="text-lg font-bold text-green-600 mt-1">
                          {evento.ticketsVendidos.toLocaleString("es-CO")}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium">Ocupación</p>
                        <p className="text-lg font-bold text-purple-600 mt-1">
                          {((evento.ticketsVendidos / evento.capacidad) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium">Fecha</p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">{evento.fecha}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-4 flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors flex-shrink-0">
                    <ChevronRight className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

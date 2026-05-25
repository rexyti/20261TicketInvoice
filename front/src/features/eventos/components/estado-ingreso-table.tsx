import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { Badge } from "@/shared/ui/badge";
import type { EstadoIngresoResponse } from "../models/eventos.types";

interface EstadoIngresoTableProps {
  data?: EstadoIngresoResponse;
  isLoading?: boolean;
  error?: Error | null;
}

export function EstadoIngresoTable({ data, isLoading, error }: EstadoIngresoTableProps) {
  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <p className="text-sm text-red-700">Error al cargar estado de ingreso</p>
        <p className="text-xs text-red-600 mt-1">{error.message}</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const estadoData = [
    {
      estado: "CHECK-IN (Asistieron)",
      cantidad: data.ticketsCheckedIn,
      badge: "success",
    },
    {
      estado: "NO ASISTIERON",
      cantidad: data.ticketsNotAttended,
      badge: "warning",
    },
  ];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Estado de Ingreso - Evento {data.eventoId}</h3>

        {/* Tabla de estados */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {estadoData.map((row) => {
                const total = (data.ticketsCheckedIn ?? 0) + (data.ticketsNotAttended ?? 0);
                const porcentaje = total > 0 ? ((row.cantidad ?? 0) / total) * 100 : 0;

                return (
                  <tr key={row.estado} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            row.badge === "success"
                              ? "default"
                              : row.badge === "warning"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {row.estado}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {row.cantidad ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">{porcentaje.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Resumen */}
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {(data.ticketsCheckedIn ?? 0) + (data.ticketsNotAttended ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tasa de Asistencia</p>
              <p className="text-xl font-bold text-green-600 mt-1">
                {(((data.ticketsCheckedIn ?? 0) / ((data.ticketsCheckedIn ?? 0) + (data.ticketsNotAttended ?? 0))) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useResumenVentas, useEstadoIngreso, useIngresosTickets } from "../api/eventos.api";
import { StepsNavigator, type StepType } from "../components/steps-navigator";
import { ResumenVentasCard } from "../components/resumen-ventas-card";
import { EstadoIngresoTable } from "../components/estado-ingreso-table";
import { IngresosTicketsTable } from "../components/ingresos-tickets-table";
import type { EventoListItem } from "../api/eventos.api";
import { Feature08CalcularDistribucionDelRecaudoPage, type CalculoDistribucionData } from "./feature-08CalcularDistribucionDelRecaudo-page";

interface EventoDetailPageProps {
  evento: EventoListItem;
  onBack: () => void;
}

export function EventoDetailPage({ evento, onBack }: EventoDetailPageProps) {
  const [currentStep, setCurrentStep] = useState<StepType>(1);
  const [showFeature08, setShowFeature08] = useState(false);
  
  const distribucionPreview: CalculoDistribucionData = resumenData
    ? {
        calculoId: `preview-${evento.id}`,
        fechaCalculo: new Date().toLocaleDateString(),
        estadoLiquidacion: "PRELIMINAR",
        metricas: {
          totalBruto: String((resumenData as any)?.totalRecaudoBruto ?? "$0"),
          ticketsCancelados: String((resumenData as any)?.totalTicketsCancelados ?? 0),
          cortesias: String((resumenData as any)?.totalTicketsCortesia ?? 0),
          totalNetoPreliminar: String((resumenData as any)?.totalRecaudoBruto ?? "$0"),
          comisionPlataforma: "$0",
          comisionRecinto: "$0",
          totalDistribuible: String((resumenData as any)?.totalRecaudoBruto ?? "$0"),
          pagaPromotor: String((resumenData as any)?.totalRecaudoBruto ?? "$0"),
        },
        rows: [],
        puedeCalcular: true,
      }
    : {
        calculoId: `preview-${evento.id}`,
        fechaCalculo: new Date().toLocaleDateString(),
        estadoLiquidacion: "SIN_DATOS",
        metricas: {
          totalBruto: "$0",
          ticketsCancelados: "0",
          cortesias: "0",
          totalNetoPreliminar: "$0",
          comisionPlataforma: "$0",
          comisionRecinto: "$0",
          totalDistribuible: "$0",
          pagaPromotor: "$0",
        },
        rows: [],
        puedeCalcular: false,
        razonBloqueo: "Resumen de ventas no disponible",
      };

  const { data: resumenData, isLoading: resumenLoading, error: resumenError } = useResumenVentas(evento.id);
  const { data: estadoData, isLoading: estadoLoading, error: estadoError } = useEstadoIngreso(evento.id);
  const { data: ingresosData, isLoading: ingresosLoading, error: ingresosError } = useIngresosTickets(evento.id);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Resumen de Ventas</h2>
              <p className="text-gray-600">Consultar consolidado de tickets vendidos y recaudo bruto</p>
            </div>
            <ResumenVentasCard data={resumenData} isLoading={resumenLoading} error={resumenError} />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Estado de Ingreso (Check-in)</h2>
              <p className="text-gray-600">Consultar estado de ingreso de tickets al evento</p>
            </div>
            <EstadoIngresoTable data={estadoData} isLoading={estadoLoading} error={estadoError} />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ingresos de Tickets</h2>
              <p className="text-gray-600">Consolidado financiero de tickets vendidos por estado</p>
            </div>
            <IngresosTicketsTable data={ingresosData} isLoading={ingresosLoading} error={ingresosError} />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Consultar Tipo de Recinto</h2>
              <p className="text-gray-600">Información del recinto asociado al evento</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
              <p className="text-blue-700 font-semibold">Funcionalidad en desarrollo</p>
              <p className="text-sm text-blue-600 mt-2">Este paso consultará el tipo de recinto desde el Módulo 1</p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurar Tipo de Liquidación</h2>
              <p className="text-gray-600">Definir el modelo de negocio: Tarifa Plana o Reparto de Ingresos</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 text-center">
              <p className="text-orange-700 font-semibold">Funcionalidad en desarrollo</p>
              <p className="text-sm text-orange-600 mt-2">Este paso permitirá configurar el tipo de liquidación del evento</p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrar Comisión del Recinto</h2>
              <p className="text-gray-600">Definir el valor o porcentaje de comisión del recinto</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <p className="text-red-700 font-semibold">Funcionalidad en desarrollo</p>
              <p className="text-sm text-red-600 mt-2">Este paso permitirá registrar la comisión del recinto</p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Distribución del Recaudo</h2>
              <p className="text-gray-600">Calcular y consultar la distribución final del recaudo</p>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-8 text-center">
              <p className="text-pink-700 font-semibold">Funcionalidad disponible</p>
              <p className="text-sm text-pink-600 mt-2">Abra la calculadora de distribución para el evento</p>
              <div className="mt-4">
                <Button onClick={() => setShowFeature08(true)} className="inline-flex items-center gap-2 bg-pink-600 text-white">
                  Abrir calculadora de distribución
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón atrás */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-transparent hover:bg-gray-100 h-auto px-0 py-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a eventos
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={evento.estado === "LIQUIDADO" ? "default" : "secondary"}>
                  {evento.estado}
                </Badge>
                <span className="text-sm text-gray-600">ID: {evento.id}</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900">{evento.nombre}</h1>
              <p className="text-gray-600 mt-2">{evento.ciudad} • {evento.fecha}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Navigator */}
      <StepsNavigator currentStep={currentStep} onStepChange={setCurrentStep} />

      {showFeature08 && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center p-6">
          <div className="w-full max-w-[1280px]">
            <Feature08CalcularDistribucionDelRecaudoPage
              onBack={() => setShowFeature08(false)}
              evento={{ id: String(evento.id), nombre: evento.nombre, recintoTipo: "Teatro" }}
              distribucion={distribucionPreview}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {renderStepContent()}
      </div>
    </div>
  );
}

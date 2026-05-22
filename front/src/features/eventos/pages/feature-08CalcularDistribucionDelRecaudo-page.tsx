import { useState } from "react";
import { CheckCircle2, ChevronDown, AlertCircle, CalculatorIcon, Download } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { BackendNotConnectedModal } from "@/shared/ui/backend-not-connected-modal";

interface DistribucionRow {
  concepto: string;
  descripcion: string;
  valor: string;
  porcentaje?: string;
  destacado?: boolean;
  total?: boolean;
}

interface CalculoDistribucionData {
  calculoId: string;
  fechaCalculo: string;
  estadoLiquidacion: string;
  metricas: {
    totalBruto: string;
    ticketsCancelados: string;
    cortesias: string;
    totalNetoPreliminar: string;
    comisionPlataforma: string;
    comisionRecinto: string;
    totalDistribuible: string;
    pagaPromotor: string;
  };
  rows: DistribucionRow[];
  puedeCalcular: boolean;
  razonBloqueo?: string;
}

interface EventoDistribucionRef {
  id: string;
  nombre: string;
  recintoTipo: string;
}

interface Feature08CalcularDistribucionDelRecaudoPageProps {
  onBack: () => void;
  evento: EventoDistribucionRef;
  distribucion: CalculoDistribucionData;
  onCalcular?: () => void;
}

export function Feature08CalcularDistribucionDelRecaudoPage({
  onBack,
  evento,
  distribucion: _distribucion,
  onCalcular: _onCalcular,
}: Feature08CalcularDistribucionDelRecaudoPageProps) {
  const [showNotConnectedModal, setShowNotConnectedModal] = useState(false);

  const [localDistribucion] = useState<CalculoDistribucionData>({
    calculoId: `preview-${evento.id}`,
    fechaCalculo: "22/05/2026",
    estadoLiquidacion: "PRELIMINAR",
    metricas: {
      totalBruto: "$ 48.500.000",
      ticketsCancelados: "-$ 1.120.000",
      cortesias: "-$ 2.450.000",
      totalNetoPreliminar: "$ 44.930.000",
      comisionPlataforma: "-$ 4.493.000",
      comisionRecinto: "-$ 5.391.600",
      totalDistribuible: "$ 35.045.400",
      pagaPromotor: "$ 27.335.412",
    },
    rows: [
      {
        concepto: "Total bruto recaudado",
        descripcion: "Recaudo total por venta de tickets",
        porcentaje: "-",
        valor: "$ 48.500.000",
      },
      {
        concepto: "Tickets cancelados",
        descripcion: "Dinero no reconocido por cancelaciones",
        porcentaje: "-",
        valor: "-$ 1.120.000",
      },
      {
        concepto: "Cortesias",
        descripcion: "Valor no ingresado por tickets de cortesia",
        porcentaje: "-",
        valor: "-$ 2.450.000",
      },
      {
        concepto: "Comision plataforma",
        descripcion: "Comision operativa de plataforma",
        porcentaje: "10%",
        valor: "-$ 4.493.000",
      },
      {
        concepto: "Comision recinto",
        descripcion: "Comision del recinto sobre el neto preliminar",
        porcentaje: "12%",
        valor: "-$ 5.391.600",
      },
      {
        concepto: "Total distribuible",
        descripcion: "Monto final base para distribucion",
        porcentaje: "-",
        valor: "$ 35.045.400",
        total: true,
        destacado: true,
      },
    ],
    puedeCalcular: true,
  });

  return (
    <div className="pb-10 [zoom:0.64]">
      <section className="bg-[#c9c4da] px-8 md:px-12 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr_auto] gap-4 items-end">
          <label className="h-14 flex items-center rounded-full bg-[#ece9f5] px-6 gap-4 text-[#211c34]">
            <CalculatorIcon className="w-7 h-7" />
            <input className="w-full bg-transparent text-xl placeholder:text-[#211c34]/80 outline-none" placeholder="Buscar evento por ID o nombre..." />
          </label>
          <div>
            <p className="text-lg text-[#6f6990] font-semibold mb-2">Tipo de recinto</p>
            <button
              className="w-full h-14 rounded-xl bg-[#ece9f5] px-5 text-xl text-left text-[#211c34] flex items-center justify-between"
              onClick={() => setShowNotConnectedModal(true)}
            >
              {evento.recintoTipo}
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
          <Button
            className="h-14 px-7 rounded-xl bg-[#6351a0] text-[#f2effa] text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {}}
            disabled={!localDistribucion.puedeCalcular}
          >
            <CalculatorIcon className="w-6 h-6" />
            Calcular Distribucion
          </Button>
        </div>
      </section>

      <section className="px-8 md:px-12 py-10 text-[#1f1a37]">
        <div className="mb-4">
          <Button onClick={onBack} variant="ghost" className="text-[#4f4474] hover:bg-[#d8d2e8]">Volver al indice</Button>
        </div>
        <p className="text-2xl font-semibold text-[#787296] uppercase">
          Calculo de distribucion del recaudo · Resultado #{localDistribucion.calculoId}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-6xl font-semibold">{evento.nombre}</h1>
            <p className="mt-4 text-2xl text-[#6f6990]">
              ID Evento: #{evento.id} | Fecha calculo: {localDistribucion.fechaCalculo} | Estado: {localDistribucion.estadoLiquidacion}
            </p>
          </div>
          <div className={`h-16 px-6 rounded-full text-[#eaf8ee] text-2xl font-semibold flex items-center gap-3 ${
            localDistribucion.puedeCalcular ? "bg-[#2f914a]" : "bg-[#c1463a]"
          }`}>
            {localDistribucion.puedeCalcular ? (
              <>
                <CheckCircle2 className="w-7 h-7" />
                Distribucion calculable
              </>
            ) : (
              <>
                <AlertCircle className="w-7 h-7" />
                No calculable
              </>
            )}
          </div>
        </div>
      </section>

      {!localDistribucion.puedeCalcular && localDistribucion.razonBloqueo && (
        <section className="px-8 md:px-12 mb-8">
          <div className="rounded-lg bg-[#fdd5d5] border border-[#f17a7a] p-6 text-[#c1463a]">
            <div className="flex gap-4 items-start">
              <AlertCircle className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <p className="text-2xl font-semibold mb-2">No se puede calcular la distribucion</p>
                <p className="text-xl">{localDistribucion.razonBloqueo}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-8 md:px-12">
        <div className="rounded-xl border border-[#8f83b7] bg-[#e9e7f0] p-8 text-[#1f1a37]">
          <div className="flex items-end justify-between gap-4 border-b border-[#d0ccdd] pb-6">
            <h2 className="text-4xl font-semibold">Calculo consolidado de distribucion</h2>
            <p className="text-2xl text-[#6f6990]">Valores expresados en moneda local (COP)</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 pt-8">
            <div>
              <p className="text-lg font-semibold text-[#787296]">TOTAL BRUTO RECAUDADO</p>
              <p className="w-full text-5xl font-semibold mt-2 bg-transparent">{localDistribucion.metricas.totalBruto}</p>
              <p className="text-2xl text-[#6f6990] mt-2">Monto total recaudado antes de descuentos</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-[#787296]">DESCUENTOS</p>
              <div className="flex gap-4 mt-2">
                <p className="text-3xl font-semibold">Cancelados: {localDistribucion.metricas.ticketsCancelados}</p>
                <p className="text-3xl font-semibold">Cortesias: {localDistribucion.metricas.cortesias}</p>
              </div>
              <p className="text-2xl text-[#6f6990] mt-2">Tickets cancelados y cortesias sin ingreso</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-[#787296]">TOTAL NETO PRELIMINAR</p>
              <p className="w-full text-5xl font-semibold mt-2 bg-transparent">{localDistribucion.metricas.totalNetoPreliminar}</p>
              <p className="text-2xl text-[#6f6990] mt-2">Base para calculo de comisiones</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-[#787296]">TOTAL DISTRIBUIBLE</p>
              <p className="w-full text-5xl font-semibold mt-2 bg-transparent">{localDistribucion.metricas.totalDistribuible}</p>
              <p className="text-2xl text-[#6f6990] mt-2">Monto final a distribuir entre actores</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button className="h-12 px-6 rounded-xl bg-[#2f914a] text-[#eaf8ee] text-lg font-semibold" onClick={() => setShowNotConnectedModal(true)}>
              Realizar calculo
            </Button>
          </div>

          <div className="mt-8 border-t border-dashed border-[#d0ccdd] pt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold text-[#716a8f]">PAGO AL PROMOTOR</p>
              <p className="text-4xl font-semibold mt-3">Valor transferible segun modelo de negocio</p>
              <p className="text-2xl mt-3 text-[#6f6990]">Despues de descontar comisiones de plataforma y recinto.</p>
            </div>
            <p className="text-6xl text-[#6051a0] font-semibold bg-transparent text-right">{localDistribucion.metricas.pagaPromotor}</p>
          </div>
        </div>
      </section>

      <section className="px-8 md:px-12 mt-8">
        <div className="overflow-hidden rounded-xl border border-[#d8d4e6] bg-[#f3f1f8] text-[#1f1a37]">
          <div className="px-6 py-5 border-b border-[#dfdbea]">
            <h3 className="text-3xl font-semibold">Detalle de distribucion</h3>
            <p className="text-xl text-[#6f6990] mt-2">Desglose de comisiones y pagos segun configuracion del evento</p>
          </div>
          <table className="w-full">
            <thead className="bg-[#ece9f5] text-[#6f6990]">
              <tr className="text-left text-xl">
                <th className="px-6 py-4">CONCEPTO</th>
                <th className="px-6 py-4">DESCRIPCION</th>
                <th className="px-6 py-4 text-right">PORCENTAJE</th>
                <th className="px-6 py-4 text-right">VALOR</th>
              </tr>
            </thead>
            <tbody className="text-2xl">
              {localDistribucion.rows.map((row, idx) => (
                <tr key={`${row.concepto}-${idx}`} className="border-t border-[#e1ddec]">
                  <td className={`px-6 py-5 ${row.total ? "font-semibold" : ""}`}>{row.concepto}</td>
                  <td className={`px-6 py-5 text-[#6f6990] ${row.total ? "font-semibold" : ""}`}>{row.descripcion}</td>
                  <td className={`px-6 py-5 text-right ${row.total ? "font-semibold" : ""}`}>
                    <p className="w-32 text-right bg-transparent outline-none">{row.porcentaje ?? "-"}</p>
                  </td>
                  <td className={`px-6 py-5 text-right font-semibold ${row.destacado ? "text-[#6051a0]" : ""}`}>
                    <p className="w-48 text-right font-semibold bg-transparent outline-none">{row.valor}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="px-8 md:px-12 mt-8 pb-10">
        <div className="flex gap-4">
          <Button
            className="flex-1 h-14 rounded-xl bg-[#6351a0] text-[#f2effa] text-xl font-semibold"
            onClick={() => setShowNotConnectedModal(true)}
          >
            <Download className="w-6 h-6" />
            Exportar Distribucion
          </Button>
          <Button
            className="flex-1 h-14 rounded-xl border-2 border-[#6351a0] bg-transparent text-[#6351a0] text-xl font-semibold"
            onClick={onBack}
          >
            Volver
          </Button>
        </div>
      </section>

      <BackendNotConnectedModal
        open={showNotConnectedModal}
        onClose={() => setShowNotConnectedModal(false)}
        onGoMenu={onBack}
      />
    </div>
  );
}

export type { CalculoDistribucionData, EventoDistribucionRef };

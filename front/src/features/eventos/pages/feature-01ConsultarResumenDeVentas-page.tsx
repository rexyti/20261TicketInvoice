import { useState } from "react";
import { CheckCircle2, ChevronDown, Download, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { BackendNotConnectedModal } from "@/shared/ui/backend-not-connected-modal";

interface RowResumen {
  condicion: string;
  descripcion: string;
  tickets: string;
  valor: string;
  danger?: boolean;
  total?: boolean;
}

interface ResumenEventoData {
  snapshotId: string;
  fechaEvento: string;
  estadoEvento: string;
  metricas: {
    vendidos: string;
    validados: string;
    cancelados: string;
    cortesias: string;
    totalRecaudado: string;
  };
  rows: RowResumen[];
}

interface EventoResumenRef {
  id: string;
  nombre: string;
}

interface Feature01ConsultarResumenDeVentasPageProps {
  onBack: () => void;
  evento: EventoResumenRef;
  resumen: ResumenEventoData;
}

export function Feature01ConsultarResumenDeVentasPage({ onBack, evento, resumen }: Feature01ConsultarResumenDeVentasPageProps) {
  const [showNotConnectedModal, setShowNotConnectedModal] = useState(false);

  return (
    <div className="pb-10 [zoom:0.64]">
      <section className="bg-[#c9c4da] px-8 md:px-12 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr_auto] gap-4 items-end">
          <label className="h-14 flex items-center rounded-full bg-[#ece9f5] px-6 gap-4 text-[#211c34]">
            <Search className="w-7 h-7" />
            <input className="w-full bg-transparent text-xl placeholder:text-[#211c34]/80 outline-none" placeholder="Buscar evento por ID o nombre..." />
          </label>
          <div>
            <p className="text-lg text-[#6f6990] font-semibold mb-2">Origen del resumen</p>
            <button
              className="w-full h-14 rounded-xl bg-[#ece9f5] px-5 text-xl text-left text-[#211c34] flex items-center justify-between"
              onClick={() => setShowNotConnectedModal(true)}
            >
              Snapshot de evento
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
          <Button className="h-14 px-7 rounded-xl bg-[#6351a0] text-[#f2effa] text-xl font-semibold" onClick={() => setShowNotConnectedModal(true)}>
            <Download className="w-6 h-6" />
            Exportar Resumen
          </Button>
        </div>
      </section>

      <section className="px-8 md:px-12 py-10 text-[#1f1a37]">
        <div className="mb-4">
          <Button onClick={onBack} variant="ghost" className="text-[#4f4474] hover:bg-[#d8d2e8]">Volver al indice</Button>
        </div>
        <p className="text-2xl font-semibold text-[#787296] uppercase">
          Resumen de ventas del evento · Snapshot financiero #{resumen.snapshotId}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-6xl font-semibold">{evento.nombre}</h1>
            <p className="mt-4 text-2xl text-[#6f6990]">
              ID Evento: #{evento.id} | Fecha evento: {resumen.fechaEvento} | Estado evento: {resumen.estadoEvento}
            </p>
          </div>
          <div className="h-16 px-6 rounded-full bg-[#2f914a] text-[#eaf8ee] text-2xl font-semibold flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7" />
            Resumen disponible
          </div>
        </div>
      </section>

      <section className="px-8 md:px-12">
        <div className="rounded-xl border border-[#8f83b7] bg-[#e9e7f0] p-8 text-[#1f1a37]">
          <div className="flex items-end justify-between gap-4 border-b border-[#d0ccdd] pb-6">
            <h2 className="text-4xl font-semibold">Resumen consolidado de ventas</h2>
            <p className="text-2xl text-[#6f6990]">Valores expresados en moneda local (COP)</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 pt-8">
            <Metric title="TOTAL TICKETS VENDIDOS" value={resumen.metricas.vendidos} desc="Total de tickets emitidos con recaudo asociado al evento" />
            <Metric title="TOTAL TICKETS VALIDADOS" value={resumen.metricas.validados} desc="Entradas utilizadas y reconocidas para operacion financiera" />
            <Metric title="TOTAL TICKETS CANCELADOS" value={resumen.metricas.cancelados} desc="Tickets anulados o devueltos que no suman al recaudo" danger />
            <Metric title="TOTAL DE CORTESIAS" value={resumen.metricas.cortesias} desc="Boletas sin ingreso monetario para el proceso de liquidacion" />
            <Metric title="VALOR TOTAL RECAUDADO POR CONDICION DE LIQUIDACION" value={resumen.metricas.totalRecaudado} desc="Monto consolidado usado como insumo del calculo de distribucion" />
          </div>

          <div className="mt-8 border-t border-dashed border-[#d0ccdd] pt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold text-[#716a8f]">INSUMO PRINCIPAL</p>
              <p className="text-4xl font-semibold mt-3">Base financiera disponible para distribucion del recaudo</p>
              <p className="text-2xl mt-3 text-[#6f6990]">Este snapshot alimenta el calculo de liquidacion y bloquea modificaciones manuales sobre los ingresos.</p>
            </div>
            <p className="text-6xl text-[#6051a0] font-semibold">{resumen.metricas.totalRecaudado}</p>
          </div>
        </div>
      </section>

      <section className="px-8 md:px-12 mt-8">
        <div className="overflow-hidden rounded-xl border border-[#d8d4e6] bg-[#f3f1f8] text-[#1f1a37]">
          <div className="px-6 py-5 border-b border-[#dfdbea]">
            <h3 className="text-3xl font-semibold">Detalle por condicion de liquidacion</h3>
            <p className="text-xl text-[#6f6990] mt-2">Conteos recibidos desde el modulo de gestion de recintos e inventario de aforo</p>
          </div>
          <table className="w-full">
            <thead className="bg-[#ece9f5] text-[#6f6990]">
              <tr className="text-left text-xl">
                <th className="px-6 py-4">CONDICION</th>
                <th className="px-6 py-4">DESCRIPCION</th>
                <th className="px-6 py-4 text-right">TICKETS</th>
                <th className="px-6 py-4 text-right">VALOR</th>
              </tr>
            </thead>
            <tbody className="text-2xl">
              {resumen.rows.map((row) => (
                <tr key={row.condicion} className="border-t border-[#e1ddec]">
                  <td className={`px-6 py-5 ${row.total ? "font-semibold" : ""}`}>{row.condicion}</td>
                  <td className={`px-6 py-5 text-[#6f6990] ${row.total ? "font-semibold" : ""}`}>{row.descripcion}</td>
                  <td className={`px-6 py-5 text-right ${row.total ? "font-semibold" : ""}`}>{row.tickets}</td>
                  <td className={`px-6 py-5 text-right font-semibold ${row.danger ? "text-[#b24a4a]" : ""}`}>{row.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

interface MetricProps {
  title: string;
  value: string;
  desc: string;
  danger?: boolean;
}

function Metric({ title, value, desc, danger = false }: MetricProps) {
  return (
    <div>
      <p className="text-lg font-semibold text-[#787296]">{title}</p>
      <p className={`text-5xl font-semibold mt-2 ${danger ? "text-[#c1463a]" : "text-[#1f1a37]"}`}>{value}</p>
      <p className="text-2xl text-[#6f6990] mt-2">{desc}</p>
    </div>
  );
}

export type { ResumenEventoData, EventoResumenRef };

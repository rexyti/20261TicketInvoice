import { useState } from "react";
import { CheckCircle2, ChevronDown, Download, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { BackendNotConnectedModal } from "@/shared/ui/backend-not-connected-modal";

interface RowEstadoIngreso {
  estado: string;
  descripcion: string;
  tickets: string;
  usoFinanciero: string;
  resultado: string;
  highlight?: "success" | "warning" | "neutral";
  total?: boolean;
}

interface EstadoIngresoEventoData {
  controlId: string;
  fechaEvento: string;
  estadoEvento: string;
  metricas: {
    vendidosConsultados: string;
    checkinRealizado: string;
    sinCheckin: string;
    sinInformacionIngreso: string;
    coberturaConsulta: string;
    totalProcesado: string;
  };
  rows: RowEstadoIngreso[];
}

interface EventoEstadoIngresoRef {
  id: string;
  nombre: string;
}

interface Feature02ConsultarEstadoIngresoPageProps {
  onBack: () => void;
  evento: EventoEstadoIngresoRef;
  estadoIngreso: EstadoIngresoEventoData;
}

export function Feature02ConsultarEstadoIngresoPage({
  onBack,
  evento,
  estadoIngreso,
}: Feature02ConsultarEstadoIngresoPageProps) {
  const [showNotConnectedModal, setShowNotConnectedModal] = useState(false);

  return (
    <div className="pb-10 [zoom:0.64]">
      <section className="bg-[#c9c4da] px-8 md:px-12 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr_auto] gap-4 items-end">
          <label className="h-14 flex items-center rounded-full bg-[#ece9f5] px-6 gap-4 text-[#211c34]">
            <Search className="w-7 h-7" />
            <input
              className="w-full bg-transparent text-xl placeholder:text-[#211c34]/80 outline-none"
              placeholder="Buscar evento por ID o nombre..."
            />
          </label>
          <div>
            <p className="text-lg text-[#6f6990] font-semibold mb-2">Origen de datos</p>
            <button
              className="w-full h-14 rounded-xl bg-[#ece9f5] px-5 text-xl text-left text-[#211c34] flex items-center justify-between"
              onClick={() => setShowNotConnectedModal(true)}
            >
              Control de accesos
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
          <Button className="h-14 px-7 rounded-xl bg-[#6351a0] text-[#f2effa] text-xl font-semibold" onClick={() => setShowNotConnectedModal(true)}>
            <Download className="w-6 h-6" />
            Exportar Estado
          </Button>
        </div>
      </section>

      <section className="px-8 md:px-12 py-10 text-[#1f1a37]">
        <div className="mb-4">
          <Button onClick={onBack} variant="ghost" className="text-[#4f4474] hover:bg-[#d8d2e8]">
            Volver al indice
          </Button>
        </div>
        <p className="text-2xl font-semibold text-[#787296] uppercase">
          Estado de ingreso de tickets · Control de accesos #{estadoIngreso.controlId}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-6xl font-semibold">{evento.nombre}</h1>
            <p className="mt-4 text-2xl text-[#6f6990]">
              ID Evento: #{evento.id} | Fecha evento: {estadoIngreso.fechaEvento} | Estado evento: {estadoIngreso.estadoEvento}
            </p>
          </div>
          <div className="h-16 px-6 rounded-full bg-[#2f914a] text-[#eaf8ee] text-2xl font-semibold flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7" />
            Estado disponible
          </div>
        </div>
      </section>

      <section className="px-8 md:px-12">
        <div className="rounded-xl border border-[#8f83b7] bg-[#e9e7f0] p-8 text-[#1f1a37]">
          <div className="flex items-end justify-between gap-4 border-b border-[#d0ccdd] pb-6">
            <h2 className="text-4xl font-semibold">Resumen consolidado de ingreso</h2>
            <p className="text-2xl text-[#6f6990]">Informacion usada como insumo para la liquidacion final</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 pt-8">
            <Metric
              title="TICKETS VENDIDOS CONSULTADOS"
              value={estadoIngreso.metricas.vendidosConsultados}
              desc="Total de tickets procesados desde el modulo de operacion de eventos."
            />
            <Metric
              title="CHECK-IN REALIZADO"
              value={estadoIngreso.metricas.checkinRealizado}
              desc="Asistentes que ingresaron al evento y tienen registro valido."
            />
            <Metric
              title="SIN CHECK-IN REGISTRADO"
              value={estadoIngreso.metricas.sinCheckin}
              desc="Tickets vendidos que se consideran no asistidos para liquidacion."
            />
            <Metric
              title="TICKETS SIN INFORMACION DE INGRESO"
              value={estadoIngreso.metricas.sinInformacionIngreso}
              desc="Se clasifican como no asistidos mientras se resuelve la trazabilidad."
            />
            <Metric
              title="COBERTURA DE CONSULTA"
              value={estadoIngreso.metricas.coberturaConsulta}
              desc="Todos los tickets retornan un estado valido antes del calculo final."
            />
          </div>

          <div className="mt-8 border-t border-dashed border-[#d0ccdd] pt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold text-[#716a8f]">INSUMO PRINCIPAL</p>
              <p className="text-4xl font-semibold mt-3">Base de asistencia lista para calculo de liquidacion</p>
              <p className="text-2xl mt-3 text-[#6f6990]">
                El estado de ingreso determina que tickets se reconocen como asistidos y cuales quedan clasificados como no asistidos.
              </p>
            </div>
            <p className="text-6xl text-[#6051a0] font-semibold">{estadoIngreso.metricas.totalProcesado} tickets</p>
          </div>
        </div>
      </section>

      <section className="px-8 md:px-12 mt-8">
        <div className="overflow-hidden rounded-xl border border-[#d8d4e6] bg-[#f3f1f8] text-[#1f1a37]">
          <div className="px-6 py-5 border-b border-[#dfdbea]">
            <h3 className="text-3xl font-semibold">Detalle por estado de ingreso</h3>
            <p className="text-xl text-[#6f6990] mt-2">
              Respuesta consolidada desde el modulo de operacion de eventos y control de accesos
            </p>
          </div>
          <table className="w-full">
            <thead className="bg-[#ece9f5] text-[#6f6990]">
              <tr className="text-left text-xl">
                <th className="px-6 py-4">ESTADO</th>
                <th className="px-6 py-4">DESCRIPCION</th>
                <th className="px-6 py-4 text-right">TICKETS</th>
                <th className="px-6 py-4 text-center">USO FINANCIERO</th>
                <th className="px-6 py-4 text-right">RESULTADO</th>
              </tr>
            </thead>
            <tbody className="text-2xl">
              {estadoIngreso.rows.map((row) => (
                <tr key={row.estado} className="border-t border-[#e1ddec]">
                  <td className={`px-6 py-5 ${row.total ? "font-semibold" : ""}`}>{row.estado}</td>
                  <td className={`px-6 py-5 text-[#6f6990] ${row.total ? "font-semibold" : ""}`}>{row.descripcion}</td>
                  <td className={`px-6 py-5 text-right ${row.total ? "font-semibold" : ""}`}>{row.tickets}</td>
                  <td className="px-6 py-5 text-center">
                    {row.total ? (
                      <span className="font-semibold">{row.usoFinanciero}</span>
                    ) : (
                      <Tag value={row.usoFinanciero} tone={row.highlight} />
                    )}
                  </td>
                  <td className={`px-6 py-5 text-right font-semibold ${row.total ? "text-[#1f1a37]" : ""}`}>{row.resultado}</td>
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
}

function Metric({ title, value, desc }: MetricProps) {
  return (
    <div>
      <p className="text-lg font-semibold text-[#787296]">{title}</p>
      <p className="text-5xl font-semibold mt-2 text-[#1f1a37]">{value}</p>
      <p className="text-2xl text-[#6f6990] mt-2">{desc}</p>
    </div>
  );
}

interface TagProps {
  value: string;
  tone?: "success" | "warning" | "neutral";
}

function Tag({ value, tone = "neutral" }: TagProps) {
  const toneClass =
    tone === "success"
      ? "bg-[#dcebdc] text-[#2f914a]"
      : tone === "warning"
        ? "bg-[#efdfaa] text-[#3a3318]"
        : "bg-[#ddd8e7] text-[#2f284a]";

  return <span className={`inline-flex px-6 py-2 rounded-full font-semibold ${toneClass}`}>{value}</span>;
}

export type { EstadoIngresoEventoData, EventoEstadoIngresoRef };

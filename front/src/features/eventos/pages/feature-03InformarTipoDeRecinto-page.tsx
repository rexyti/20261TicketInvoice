import { useState } from "react";
import { AlertTriangle, CheckCircle2, Lock, RefreshCcw, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { BackendNotConnectedModal } from "@/shared/ui/backend-not-connected-modal";

type TipoRecintoEscenario = "exitoso" | "CambioDeTipoRecintoBloqueado" | "RecintoSinTipoAsignado";

interface TipoRecintoControlRow {
  control: string;
  estado: string;
  accion: string;
}

interface TipoRecintoEventoData {
  recintoId: string;
  estadoRecinto: string;
  ciudad: string;
  ultimaModificacion: string;
  eventosAsociados: string;
  recintoNombre: string;
  consultaPlaceholder: string;
  ctaLabel: string;
  badgeLabel: string;
  tipoLabel: string;
  tasaLabel: string;
  aplicacionLabel: string;
  alertaTitulo: string;
  alertaDescripcion: string;
  rightTitle: string;
  rightDescription: string;
  functionalRequirements: string;
  tableHeaders: [string, string, string];
  rows: TipoRecintoControlRow[];
  escenario: TipoRecintoEscenario;
}

interface EventoTipoRecintoRef {
  id: string;
  nombre: string;
}

interface Feature03InformarTipoDeRecintoPageProps {
  onBack: () => void;
  evento: EventoTipoRecintoRef;
  tipoRecinto: TipoRecintoEventoData;
}

export function Feature03InformarTipoDeRecintoPage({ onBack, evento, tipoRecinto }: Feature03InformarTipoDeRecintoPageProps) {
  const tone = getScenarioTone(tipoRecinto.escenario);
  const BadgeIcon = tone.badgeIcon;
  const ActionIcon = tone.actionIcon;
  const [showNotConnectedModal, setShowNotConnectedModal] = useState(false);

  return (
    <div className="pb-10 [zoom:0.68]">
      <section className="px-8 md:px-12 py-8 text-[#1f1a37]">
        <div className="mb-4">
          <Button onClick={onBack} variant="ghost" className="text-[#4f4474] hover:bg-[#d8d2e8]">Volver al indice</Button>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold">Consulta tipo de recinto</h1>
            <p className="mt-2 text-xl text-[#6f6990]">Evento: {evento.nombre} · ID: #{evento.id}</p>
          </div>
          <span className={`inline-flex h-12 items-center gap-2 rounded-full px-5 text-lg font-semibold ${tone.pageBadgeClass}`}>
            <BadgeIcon className="w-5 h-5" />
            {tone.pageBadgeLabel}
          </span>
        </div>
      </section>

      <section className="px-8 md:px-12">
        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_1fr] gap-6">
          <div className="rounded-xl bg-[#efedf5] p-5 border border-[#d8d4e6]">
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <label className="h-12 flex items-center rounded-full bg-white px-5 gap-3 text-[#6f6990]">
                <Search className="w-5 h-5" />
                <input className="w-full bg-transparent text-lg placeholder:text-[#6f6990] outline-none" placeholder={tipoRecinto.consultaPlaceholder} />
              </label>
              <Button className={`h-12 rounded-lg px-5 text-base font-semibold ${tone.ctaClass}`} onClick={() => setShowNotConnectedModal(true)}>
                <ActionIcon className="w-4 h-4" />
                {tipoRecinto.ctaLabel}
              </Button>
            </div>

            <div className="mt-4 rounded-lg bg-white border border-[#ddd9ea] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#7a7590]">Recinto #{tipoRecinto.recintoId} · {tipoRecinto.estadoRecinto}</p>
                  <h2 className="text-4xl font-semibold mt-1">{tipoRecinto.recintoNombre}</h2>
                  <p className="text-lg text-[#6f6990] mt-2">
                    Ciudad: {tipoRecinto.ciudad} | Última modificación: {tipoRecinto.ultimaModificacion} | Eventos asociados: {tipoRecinto.eventosAsociados}
                  </p>
                </div>
                <span className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold ${tone.cardBadgeClass}`}>
                  <BadgeIcon className="w-4 h-4" />
                  {tipoRecinto.badgeLabel}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <Metric title={tipoRecinto.escenario === "CambioDeTipoRecintoBloqueado" ? "TIPO ACTUAL" : "TIPO DE RECINTO"} value={tipoRecinto.tipoLabel} />
                <Metric title={tipoRecinto.escenario === "CambioDeTipoRecintoBloqueado" ? "TASA VIGENTE" : "TASA DE COMISIÓN"} value={tipoRecinto.tasaLabel} />
                <Metric title={tipoRecinto.escenario === "CambioDeTipoRecintoBloqueado" ? "SOLICITUD" : "APLICACIÓN"} value={tipoRecinto.aplicacionLabel} />
              </div>

              <div className={`mt-4 rounded-lg border px-4 py-3 ${tone.alertClass}`}>
                <p className="text-xl font-semibold">{tipoRecinto.alertaTitulo}</p>
                <p className="text-base mt-1">{tipoRecinto.alertaDescripcion}</p>
              </div>

              <table className="w-full mt-4 text-[#1f1a37]">
                <thead className="bg-[#ece9f5] text-[#6f6990] text-sm">
                  <tr className="text-left">
                    <th className="px-3 py-2">{tipoRecinto.tableHeaders[0]}</th>
                    <th className="px-3 py-2">{tipoRecinto.tableHeaders[1]}</th>
                    <th className="px-3 py-2 text-right">{tipoRecinto.tableHeaders[2]}</th>
                  </tr>
                </thead>
                <tbody className="text-base">
                  {tipoRecinto.rows.map((row) => (
                    <tr key={row.control} className="border-b border-[#e9e5f2]">
                      <td className="px-3 py-3">{row.control}</td>
                      <td className="px-3 py-3">{row.estado}</td>
                      <td className="px-3 py-3 text-right font-semibold">{row.accion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-[#ece9f5] p-5 border border-[#dfdbea]">
              <p className="text-xs font-semibold uppercase text-[#7a7590]">{tipoRecinto.escenario === "exitoso" ? "ACCEPTANCE SCENARIO" : "EDGE CASE"}</p>
              <h3 className="mt-2 text-3xl font-semibold">{tipoRecinto.rightTitle}</h3>
              <p className="mt-3 text-lg text-[#6f6990]">{tipoRecinto.rightDescription}</p>
            </div>
            <div className="rounded-xl bg-[#ece9f5] p-5 border border-[#dfdbea]">
              <p className="text-xs font-semibold uppercase text-[#7a7590]">FUNCTIONAL REQUIREMENTS</p>
              <p className="mt-3 text-lg text-[#6f6990]">{tipoRecinto.functionalRequirements}</p>
            </div>
          </div>
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

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#ece9f5] p-3">
      <p className="text-xs font-semibold uppercase text-[#7a7590]">{title}</p>
      <p className="text-4xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function getScenarioTone(escenario: TipoRecintoEscenario) {
  if (escenario === "exitoso") {
    return {
      pageBadgeClass: "bg-[#dcebdc] text-[#2f914a]",
      pageBadgeLabel: "Éxito",
      badgeIcon: CheckCircle2,
      cardBadgeClass: "bg-[#dcebdc] text-[#2f914a]",
      ctaClass: "bg-[#6351a0] text-white hover:opacity-95",
      actionIcon: CheckCircle2,
      alertClass: "bg-[#ebf7ee] border-[#d4ead9] text-[#2f914a]",
    };
  }
  if (escenario === "CambioDeTipoRecintoBloqueado") {
    return {
      pageBadgeClass: "bg-[#f9dede] text-[#c1463a]",
      pageBadgeLabel: "Acción restringida",
      badgeIcon: Lock,
      cardBadgeClass: "bg-[#f9dede] text-[#c1463a]",
      ctaClass: "bg-[#6351a0] text-white hover:opacity-95",
      actionIcon: Lock,
      alertClass: "bg-[#faecec] border-[#f3d9d9] text-[#b43f35]",
    };
  }
  return {
    pageBadgeClass: "bg-[#efdfaa] text-[#3a3318]",
    pageBadgeLabel: "Advertencia crítica",
    badgeIcon: AlertTriangle,
    cardBadgeClass: "bg-[#efdfaa] text-[#3a3318]",
    ctaClass: "bg-[#ece9f5] text-[#4f4474] border border-[#d8d2e8]",
    actionIcon: RefreshCcw,
    alertClass: "bg-[#f7f0d7] border-[#e8d7a2] text-[#3a3318]",
  };
}

export type { EventoTipoRecintoRef, TipoRecintoEventoData, TipoRecintoEscenario };

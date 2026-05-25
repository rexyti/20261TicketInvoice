import { useState } from "react";
import { AlertTriangle, CheckCircle2, Pencil, RefreshCcw, Search, ShieldAlert, Wallet } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { BackendNotConnectedModal } from "@/shared/ui/backend-not-connected-modal";

type ComisionEscenario = "comisionGuardada" | "ActualizarComision" | "ComisionRecintoInexistente" | "ValorComisionInvalido";

interface ComisionRow {
  campo: string;
  datoIngresado: string;
  validacion: string;
}

interface ComisionRecintoData {
  tituloPantalla: string;
  subtituloPantalla: string;
  pillPantalla: string;
  recintoInput: string;
  accionLabel: string;
  idRecinto: string;
  nombreRecinto: string;
  metaRecinto: string;
  badgeEstado: string;
  tipoComision: string;
  valorPrincipalLabel: string;
  valorPrincipal: string;
  valorExtraLabel?: string;
  valorExtra?: string;
  alertaTitulo?: string;
  alertaDescripcion?: string;
  rows: ComisionRow[];
  escenario: ComisionEscenario;
}

interface EventoComisionRef {
  id: string;
  nombre: string;
}

interface Feature06RegistrarValorComisionRecintoPageProps {
  onBack: () => void;
  evento: EventoComisionRef;
  comision: ComisionRecintoData;
}

export function Feature06RegistrarValorComisionRecintoPage({ onBack, evento, comision }: Feature06RegistrarValorComisionRecintoPageProps) {
  const tone = getTone(comision.escenario);
  const ActionIcon = tone.actionIcon;
  const [showNotConnectedModal, setShowNotConnectedModal] = useState(false);

  return (
    <div className="pb-10 [zoom:0.72]">
      <section className="px-8 md:px-12 py-8 text-[#1f1a37]">
        <div className="mb-4">
          <Button onClick={onBack} variant="ghost" className="text-[#4f4474] hover:bg-[#d8d2e8]">Volver al indice</Button>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-5xl font-semibold">{comision.tituloPantalla}</h1>
            <p className="mt-2 text-2xl text-[#6f6990]">{comision.subtituloPantalla}</p>
            <p className="mt-2 text-lg text-[#6f6990]">Evento: {evento.nombre} · ID: #{evento.id}</p>
          </div>
          <span className={`inline-flex h-12 items-center rounded-full px-5 text-lg font-semibold ${tone.pillClass}`}>{comision.pillPantalla}</span>
        </div>
      </section>

      <section className="px-8 md:px-12">
        <div className="rounded-xl bg-[#efedf5] p-5 border border-[#d8d4e6]">
          <div className="rounded-lg bg-[#5d4e97] h-14 px-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-white/20" />
              <p className="text-xl font-semibold">Ticket Seller</p>
            </div>
            <div className="w-7 h-7 rounded-full border border-white/40" />
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
            <label className="h-12 flex items-center rounded-full bg-white px-5 gap-3 text-[#6f6990]">
              <Search className="w-5 h-5" />
              <input className="w-full bg-transparent text-lg placeholder:text-[#6f6990] outline-none" placeholder={comision.recintoInput} />
            </label>
            <Button className={`h-12 rounded-lg px-5 text-base font-semibold ${tone.actionClass}`} onClick={() => setShowNotConnectedModal(true)}>
              <ActionIcon className="w-4 h-4" />
              {comision.accionLabel}
            </Button>
          </div>

          <div className="mt-4 rounded-lg bg-white border border-[#ddd9ea] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-[#7a7590]">Identificador de recinto: {comision.idRecinto}</p>
                <h2 className="text-5xl font-semibold mt-1">{comision.nombreRecinto}</h2>
                <p className="text-lg text-[#6f6990] mt-2">{comision.metaRecinto}</p>
              </div>
              <span className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold ${tone.badgeClass}`}>
                {comision.badgeEstado}
              </span>
            </div>

            <div className={`mt-4 grid gap-3 ${comision.valorExtra ? "grid-cols-3" : "grid-cols-2"}`}>
              <Metric title="TIPO DE COMISIÓN" value={comision.tipoComision} />
              <Metric title={comision.valorPrincipalLabel.toUpperCase()} value={comision.valorPrincipal} />
              {comision.valorExtra && comision.valorExtraLabel && <Metric title={comision.valorExtraLabel.toUpperCase()} value={comision.valorExtra} />}
            </div>

            {comision.alertaTitulo && comision.alertaDescripcion && (
              <div className={`mt-4 rounded-lg border px-4 py-3 ${tone.alertClass}`}>
                <p className="text-xl font-semibold">{comision.alertaTitulo}</p>
                <p className="text-base mt-1">{comision.alertaDescripcion}</p>
              </div>
            )}

            <table className="w-full mt-4 text-[#1f1a37]">
              <thead className="bg-[#ece9f5] text-[#6f6990] text-sm">
                <tr className="text-left">
                  <th className="px-3 py-2">CAMPO</th>
                  <th className="px-3 py-2">DATO INGRESADO</th>
                  <th className="px-3 py-2 text-right">VALIDACIÓN</th>
                </tr>
              </thead>
              <tbody className="text-base">
                {comision.rows.map((row) => (
                  <tr key={row.campo} className="border-b border-[#e9e5f2]">
                    <td className="px-3 py-3">{row.campo}</td>
                    <td className="px-3 py-3">{row.datoIngresado}</td>
                    <td className="px-3 py-3 text-right font-semibold">{row.validacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

function getTone(escenario: ComisionEscenario) {
  if (escenario === "comisionGuardada") {
    return {
      pillClass: "bg-[#dcebdc] text-[#2f914a]",
      badgeClass: "bg-[#dcebdc] text-[#2f914a]",
      actionClass: "bg-[#6351a0] text-white hover:opacity-95",
      actionIcon: Wallet,
      alertClass: "bg-[#ebf7ee] border-[#d4ead9] text-[#2f914a]",
    };
  }
  if (escenario === "ActualizarComision") {
    return {
      pillClass: "bg-[#dcebdc] text-[#2f914a]",
      badgeClass: "bg-[#dcebdc] text-[#2f914a]",
      actionClass: "bg-[#6351a0] text-white hover:opacity-95",
      actionIcon: RefreshCcw,
      alertClass: "bg-[#ebf7ee] border-[#d4ead9] text-[#2f914a]",
    };
  }
  if (escenario === "ComisionRecintoInexistente") {
    return {
      pillClass: "bg-[#f9dede] text-[#c1463a]",
      badgeClass: "bg-[#f9dede] text-[#c1463a]",
      actionClass: "bg-[#ece9f5] text-[#4f4474] border border-[#d8d2e8]",
      actionIcon: Search,
      alertClass: "bg-[#faecec] border-[#f3d9d9] text-[#b43f35]",
    };
  }
  return {
    pillClass: "bg-[#efdfaa] text-[#3a3318]",
    badgeClass: "bg-[#efdfaa] text-[#3a3318]",
    actionClass: "bg-[#ece9f5] text-[#4f4474] border border-[#d8d2e8]",
    actionIcon: Pencil,
    alertClass: "bg-[#f7f0d7] border-[#e8d7a2] text-[#3a3318]",
  };
}

export type { EventoComisionRef, ComisionRecintoData, ComisionEscenario };

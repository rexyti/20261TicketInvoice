import { useMemo, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { BackendNotConnectedModal } from "@/shared/ui/backend-not-connected-modal";

type TipoLiquidacionEscenario = "exitoso" | "casoBordeRecintoNoExiste";
type TipoLiquidacion = "Tarifa Plana" | "Reparto de ingresos";

interface TipoLiquidacionEventoData {
  recintoNombre: string;
  tipoLiquidacion: TipoLiquidacion;
  valorLabel: string;
  valor: string;
  mostrarError: boolean;
  errorMensaje: string;
  escenario: TipoLiquidacionEscenario;
}

interface EventoLiquidacionRef {
  id: string;
  nombre: string;
}

interface Feature05DeterminarTipoLiquidacionFinalPageProps {
  onBack: () => void;
  evento: EventoLiquidacionRef;
  liquidacion: TipoLiquidacionEventoData;
}

export function Feature05DeterminarTipoLiquidacionFinalPage({
  onBack,
  evento,
  liquidacion,
}: Feature05DeterminarTipoLiquidacionFinalPageProps) {
  const isEdge = liquidacion.escenario === "casoBordeRecintoNoExiste";
  const [showNotConnectedModal, setShowNotConnectedModal] = useState(false);
  const [tipoLiquidacionSeleccionado, setTipoLiquidacionSeleccionado] = useState<TipoLiquidacion>(liquidacion.tipoLiquidacion);

  const valorConfig = useMemo(() => {
    if (tipoLiquidacionSeleccionado === "Tarifa Plana") {
      return { label: "Monto Fijo ($)", value: "5000" };
    }
    return { label: "Porcentaje de Comisión (%)", value: "15" };
  }, [tipoLiquidacionSeleccionado]);

  return (
    <div className="min-h-screen bg-[#e9e9e5] [zoom:0.72]">
      <section className="bg-[#4b437c] px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#9aa2b0]" />
            <h1 className="text-5xl text-[#adb1c2] font-semibold">Ticket Seller</h1>
          </div>
          <div className="flex items-center gap-4 text-[#adb1c2]">
            <span className="text-3xl">Nombre del Administrador</span>
            <div className="w-14 h-14 rounded-full border border-[#a9afbf] flex items-center justify-center text-3xl">◯</div>
          </div>
        </div>
      </section>

      <section className="px-8 py-8">
        <Button onClick={onBack} variant="ghost" className="text-[#4f4474] hover:bg-[#d8d2e8] text-lg mb-4">
          Volver al indice
        </Button>
        <p className="text-xl text-[#6e6a80]">Evento: {evento.nombre} · ID: #{evento.id}</p>
      </section>

      <section className="fixed inset-0 bg-black/35 flex items-center justify-center p-6">
        <div className="w-full max-w-[980px] rounded-2xl bg-white border border-[#dddbe6] shadow-xl p-7">
          <div className="flex items-center justify-between border-b border-[#e4e2ec] pb-4">
            <h2 className="text-6xl font-semibold text-[#1a1b21]">Configurar Liquidación</h2>
            <button className="text-[#767b84]" onClick={onBack}>
              <X className="w-9 h-9" />
            </button>
          </div>

          <p className="text-right text-3xl text-[#5b5a66] mt-5">Recinto: {liquidacion.recintoNombre}</p>

          {liquidacion.mostrarError && (
            <div className="mt-4 rounded-lg bg-[#d93535] text-white px-5 py-4 text-2xl font-semibold">
              {liquidacion.errorMensaje}
            </div>
          )}

          <div className={`mt-4 rounded-xl border-4 ${isEdge ? "border-[#6943a2]" : "border-[#1f2340]"} bg-[#c6cede] p-5`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl text-[#3e4050] mb-2">Tipo Liquidación</p>
                <select
                  value={tipoLiquidacionSeleccionado}
                  onChange={(e) => setTipoLiquidacionSeleccionado(e.target.value as TipoLiquidacion)}
                  className="h-14 w-full bg-white rounded-lg border border-[#a8acb8] px-4 text-left text-3xl text-[#2a2d35]"
                >
                  <option value="Tarifa Plana">Tarifa Plana</option>
                  <option value="Reparto de ingresos">Reparto de ingresos</option>
                </select>
              </div>
              <div>
                <p className="text-3xl text-[#3e4050] mb-2">{valorConfig.label}</p>
                <input
                  value={valorConfig.value}
                  readOnly
                  className="h-14 w-full bg-white rounded-lg border border-[#a8acb8] px-4 text-3xl text-[#2a2d35]"
                />
              </div>
            </div>
          </div>

          <div className={`mt-5 rounded-xl border-4 ${isEdge ? "border-[#6943a2]" : "border-[#1f2340]"} bg-[#c6cede] h-[120px] flex items-center justify-center`}>
            <div className={`w-16 h-16 rounded-full border-4 ${isEdge ? "border-white/90 text-white/90" : "border-white text-white"} flex items-center justify-center`}>
              <Plus className="w-8 h-8" />
            </div>
          </div>

          <Button
            className={`mt-5 w-full h-16 text-3xl font-semibold ${isEdge ? "bg-[#6943a2] hover:opacity-95" : "bg-[#202553] hover:opacity-95"} text-white`}
            onClick={() => setShowNotConnectedModal(true)}
          >
            <Save className="w-6 h-6" />
            Guardar Configuracion
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

export type { EventoLiquidacionRef, TipoLiquidacionEventoData, TipoLiquidacionEscenario };

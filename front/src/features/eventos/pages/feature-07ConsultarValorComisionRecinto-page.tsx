import { useState } from "react";
import { CheckCircle2, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { BackendNotConnectedModal } from "@/shared/ui/backend-not-connected-modal";

interface RecintoRelacionado {
  id: string;
  nombre: string;
  tipo: string;
  comision: string;
}

interface ConsultarComisionRecintoData {
  recintoId: string;
  nombreRecinto: string;
  tipoRecinto: string;
  tipoComision: string;
  valorComision: string;
  estadoConfiguracion: string;
  descripcionValor: string;
  otrosRecintos: RecintoRelacionado[];
}

interface EventoConsultarComisionRef {
  id: string;
  nombre: string;
}

interface Feature07ConsultarValorComisionRecintoPageProps {
  onBack: () => void;
  evento: EventoConsultarComisionRef;
  consulta: ConsultarComisionRecintoData;
}

export function Feature07ConsultarValorComisionRecintoPage({
  onBack,
  evento,
  consulta,
}: Feature07ConsultarValorComisionRecintoPageProps) {
  const [showNotConnectedModal, setShowNotConnectedModal] = useState(false);

  return (
    <div className="pb-12 [zoom:0.72] bg-[#efefea] text-[#191a1f] min-h-screen">
      <section className="bg-[#4b437c] px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#9aa2b0]" />
            <h1 className="text-5xl text-[#adb1c2] font-semibold">Ticket Seller</h1>
          </div>
          <div className="flex items-center gap-4 text-[#adb1c2]">
            <span className="text-3xl">Administrador de Recinto</span>
            <div className="w-14 h-14 rounded-full border border-[#a9afbf] flex items-center justify-center text-3xl">◯</div>
          </div>
        </div>
      </section>

      <section className="bg-[#b8c1cf] px-8 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.7fr_auto] gap-4 items-end">
          <label className="h-14 flex items-center rounded-full bg-[#cad1dc] border border-[#8c95a3] px-5 gap-3 text-[#2a2f38]">
            <Search className="w-6 h-6" />
            <input className="w-full bg-transparent text-2xl placeholder:text-[#2a2f38]/80 outline-none" placeholder="Buscar recinto por ID o nombre..." />
          </label>
          <div>
            <p className="text-xl text-[#2a2f38] mb-2">Tipo de Recinto</p>
            <button className="w-full h-14 rounded-xl bg-[#d7dde7] border border-[#8c95a3] px-4 text-2xl text-left text-[#22252c]">
              Todos los tipos
            </button>
          </div>
          <Button className="h-14 px-8 rounded-xl bg-[#24244f] text-white text-2xl font-semibold" onClick={() => setShowNotConnectedModal(true)}>
            <SlidersHorizontal className="w-5 h-5" />
            Configurar Nueva Comisión
          </Button>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto bg-[#f1f1eb] px-10 py-10 border-x border-[#d4d4ca]">
        <div className="mb-4">
          <Button onClick={onBack} variant="ghost" className="text-[#4f4474] hover:bg-[#d8d2e8] text-lg">Volver al indice</Button>
        </div>
        <p className="text-3xl font-semibold text-[#767772] uppercase">Detalle de recinto - ID {consulta.recintoId}</p>
        <div className="mt-2 flex items-center justify-between gap-4 border-b border-[#d7d7cb] pb-5">
          <div>
            <h2 className="text-7xl font-semibold">{consulta.nombreRecinto}</h2>
            <p className="mt-3 text-2xl text-[#666862]">Evento: {evento.nombre} · ID Evento: #{evento.id}</p>
          </div>
          <span className="h-14 px-7 rounded-full border border-[#4a5076] text-[#2f3559] bg-[#c8cfdd] text-3xl font-semibold inline-flex items-center">
            Tipo: {consulta.tipoRecinto}
          </span>
        </div>

        <div className="mt-8 rounded-xl bg-[#d7deec] border border-[#bec7da] p-7">
          <h3 className="text-5xl font-semibold">Condiciones Económicas del Recinto</h3>
          <div className="mt-4 border-t border-[#bcc5d8] pt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div>
              <p className="text-xl text-[#5f6673] uppercase font-semibold">Tipo de comisión configurada</p>
              <p className="text-5xl font-semibold mt-2">{consulta.tipoComision}</p>
            </div>
            <div>
              <p className="text-xl text-[#5f6673] uppercase font-semibold">Valor de la comisión</p>
              <p className="text-6xl font-semibold mt-2 text-[#2a2d55]">{consulta.valorComision}</p>
              <p className="text-xl text-[#5f6673] mt-2">{consulta.descripcionValor}</p>
            </div>
            <div>
              <p className="text-xl text-[#5f6673] uppercase font-semibold">Estado de configuración</p>
              <span className="mt-3 inline-flex h-12 items-center gap-2 rounded-full border border-[#48996a] bg-[#dcebdc] px-5 text-2xl font-semibold text-[#2f914a]">
                <CheckCircle2 className="w-5 h-5" />
                {consulta.estadoConfiguracion}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white border border-[#d7d7cb] p-5">
          <h4 className="text-4xl font-semibold">Otros Recintos del Sistema</h4>
          <table className="w-full mt-4">
            <thead className="bg-[#ece9f5] text-[#6f6990] text-xl">
              <tr className="text-left">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">RECINTO</th>
                <th className="px-4 py-3">TIPO</th>
                <th className="px-4 py-3 text-right">COMISIÓN</th>
              </tr>
            </thead>
            <tbody className="text-2xl">
              {consulta.otrosRecintos.map((row) => (
                <tr key={row.id} className="border-b border-[#ece7f4]">
                  <td className="px-4 py-4">{row.id}</td>
                  <td className="px-4 py-4">{row.nombre}</td>
                  <td className="px-4 py-4">{row.tipo}</td>
                  <td className="px-4 py-4 text-right font-semibold">{row.comision}</td>
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

export type { EventoConsultarComisionRef, ConsultarComisionRecintoData };

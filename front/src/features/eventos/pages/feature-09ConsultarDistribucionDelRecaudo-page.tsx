import { useState, type ReactNode } from "react";
import { Search, Wallet, Percent, Landmark, RefreshCcw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { BackendNotConnectedModal } from "@/shared/ui/backend-not-connected-modal";

interface DistribucionDetalleRow {
  concepto: string;
  descripcion: string;
  porcentaje?: string;
  valor: string;
  total?: boolean;
}

interface ConsultarDistribucionRecaudoData {
  distribucionId: string;
  estadoLiquidacion: string;
  totalBrutoRecaudado: string;
  totalComisiones: string;
  totalDistribuible: string;
  recintoAsociado: string;
  modeloComisionRecinto: string;
  comisionPlataforma: string;
  fechaCalculo: string;
  detalle: DistribucionDetalleRow[];
}

interface EventoConsultarDistribucionRef {
  id: string;
  nombre: string;
}

interface Feature09ConsultarDistribucionDelRecaudoPageProps {
  onBack: () => void;
  evento: EventoConsultarDistribucionRef;
  consulta: ConsultarDistribucionRecaudoData;
}

export function Feature09ConsultarDistribucionDelRecaudoPage({
  onBack,
  evento,
  consulta,
}: Feature09ConsultarDistribucionDelRecaudoPageProps) {
  const [showNotConnectedModal, setShowNotConnectedModal] = useState(false);

  return (
    <div className="pb-12 [zoom:0.72] bg-[#efefea] text-[#191a1f] min-h-screen">
      <section className="bg-[#4b437c] px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#9aa2b0]" />
            <button type="button" className="text-5xl text-[#d7dbe7] font-semibold" onClick={() => window.location.assign("/")}>
              Ticket Seller
            </button>
          </div>
          <div className="flex items-center gap-4 text-[#d7dbe7]">
            <span className="text-3xl">Administrador Financiero</span>
            <div className="w-14 h-14 rounded-full border border-[#a9afbf] flex items-center justify-center text-3xl">◯</div>
          </div>
        </div>
      </section>

      <section className="bg-[#b8c1cf] px-8 py-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.7fr_auto] gap-4 items-end">
          <label className="h-14 flex items-center rounded-full bg-[#cad1dc] border border-[#8c95a3] px-5 gap-3 text-[#2a2f38]">
            <Search className="w-6 h-6" />
            <input className="w-full bg-transparent text-2xl placeholder:text-[#2a2f38]/80 outline-none" placeholder="Buscar evento por ID o nombre..." />
          </label>
          <div>
            <p className="text-xl text-[#2a2f38] mb-2">Estado Liquidacion</p>
            <button className="w-full h-14 rounded-xl bg-[#d7dde7] border border-[#8c95a3] px-4 text-2xl text-left text-[#22252c]">
              {consulta.estadoLiquidacion}
            </button>
          </div>
          <Button className="h-14 px-8 rounded-xl bg-[#24244f] text-white text-2xl font-semibold" onClick={() => setShowNotConnectedModal(true)}>
            <RefreshCcw className="w-5 h-5" />
            Recalcular Distribucion
          </Button>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto bg-[#f1f1eb] px-10 py-10 border-x border-[#d4d4ca]">
        <div className="mb-4">
          <Button onClick={onBack} variant="ghost" className="text-[#4f4474] hover:bg-[#d8d2e8] text-lg">Volver al indice</Button>
        </div>

        <p className="text-3xl font-semibold text-[#767772] uppercase">Distribucion de recaudo - Evento #{consulta.distribucionId}</p>
        <div className="mt-2 flex items-center justify-between gap-4 border-b border-[#d7d7cb] pb-5">
          <h2 className="text-7xl font-semibold">{evento.nombre}</h2>
          <span className="h-14 px-7 rounded-full border border-[#4a5076] text-[#2f3559] bg-[#c8cfdd] text-3xl font-semibold inline-flex items-center">
            Estado: {consulta.estadoLiquidacion}
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <MetricCard icon={<Wallet className="w-8 h-8" />} title="Total Bruto Recaudado" value={consulta.totalBrutoRecaudado} />
          <MetricCard icon={<Percent className="w-8 h-8" />} title="Total Comisiones" value={consulta.totalComisiones} />
          <MetricCard icon={<Landmark className="w-8 h-8" />} title="Total Distribuible" value={consulta.totalDistribuible} highlighted />
        </div>

        <div className="mt-8 rounded-xl bg-[#d7deec] border border-[#bec7da] p-7">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 text-[#1f1a37]">
            <InfoBlock label="Recinto Asociado" value={consulta.recintoAsociado} />
            <InfoBlock label="Modelo Comision Recinto" value={consulta.modeloComisionRecinto} />
            <InfoBlock label="Comision Plataforma" value={consulta.comisionPlataforma} />
            <InfoBlock label="Fecha de Calculo" value={consulta.fechaCalculo} />
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white border border-[#d7d7cb] p-5">
          <h4 className="text-4xl font-semibold">Detalle de Distribucion</h4>
          <table className="w-full mt-4">
            <thead className="bg-[#ece9f5] text-[#6f6990] text-xl">
              <tr className="text-left">
                <th className="px-4 py-3">CONCEPTO</th>
                <th className="px-4 py-3">DESCRIPCION</th>
                <th className="px-4 py-3 text-right">PORCENTAJE</th>
                <th className="px-4 py-3 text-right">VALOR</th>
              </tr>
            </thead>
            <tbody className="text-2xl">
              {consulta.detalle.map((row, idx) => (
                <tr key={`${row.concepto}-${idx}`} className="border-b border-[#ece7f4]">
                  <td className={`px-4 py-4 ${row.total ? "font-semibold" : ""}`}>{row.concepto}</td>
                  <td className={`px-4 py-4 ${row.total ? "font-semibold" : ""}`}>{row.descripcion}</td>
                  <td className={`px-4 py-4 text-right ${row.total ? "font-semibold" : ""}`}>{row.porcentaje ?? "-"}</td>
                  <td className={`px-4 py-4 text-right font-semibold ${row.total ? "text-[#2a2d55]" : ""}`}>{row.valor}</td>
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

interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  highlighted?: boolean;
}

function MetricCard({ icon, title, value, highlighted = false }: MetricCardProps) {
  if (highlighted) {
    return (
      <div className="rounded-xl border border-[#2a2d55] bg-[#24244f] p-7 text-[#e6e9f4]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#39406b] flex items-center justify-center">{icon}</div>
          <div>
            <p className="text-3xl text-[#b6bdd7]">{title}</p>
            <p className="text-6xl font-semibold mt-2">{value}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#d7d7cb] bg-white p-7">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#d8deea] text-[#323652] flex items-center justify-center">{icon}</div>
        <div>
          <p className="text-3xl text-[#5f6673]">{title}</p>
          <p className="text-6xl font-semibold mt-2">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface InfoBlockProps {
  label: string;
  value: string;
}

function InfoBlock({ label, value }: InfoBlockProps) {
  return (
    <div>
      <p className="text-xl text-[#5f6673] uppercase font-semibold">{label}</p>
      <p className="text-4xl font-semibold mt-2">{value}</p>
    </div>
  );
}

export type { EventoConsultarDistribucionRef, ConsultarDistribucionRecaudoData };


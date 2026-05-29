import { useState } from "react";
import type { ReactNode } from "react";
import { Ban, CheckCircle2, Gift, Ticket, UserRoundX } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { BackendNotConnectedModal } from "@/shared/ui/backend-not-connected-modal";

interface IngresosTicketsMetricas {
  vendidos: string;
  validados: string;
  noAsistio: string;
  cortesias: string;
  cancelados: string;
}

interface IngresosTicketsEventoData {
  resumenId: string;
  estadoEvento: string;
  estadoLiquidacion: string;
  metricas: IngresosTicketsMetricas;
  recaudoBruto: string;
}

interface EventoIngresosTicketsRef {
  id: string;
  nombre: string;
}

interface Feature04ConsultarIngresosTicketsPageProps {
  onBack: () => void;
  evento: EventoIngresosTicketsRef;
  ingresos: IngresosTicketsEventoData;
}

export function Feature04ConsultarIngresosTicketsPage({
  onBack,
  evento,
  ingresos,
}: Feature04ConsultarIngresosTicketsPageProps) {
  const [showNotConnectedModal, setShowNotConnectedModal] = useState(false);

  return (
    <div className="pb-12 [zoom:0.72] bg-[#efefea] text-[#191a1f] min-h-screen">
      <section className="max-w-[1280px] mx-auto bg-[#f1f1eb] px-10 py-10 border-x border-[#d4d4ca]">
        <div className="mb-4">
          <Button onClick={onBack} variant="ghost" className="text-[#4f4474] hover:bg-[#d8d2e8] text-lg">Volver al indice</Button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4 border-b border-[#d7d7cb] pb-5">
          <div>
            <p className="text-3xl font-semibold text-[#767772] uppercase">Ingresos de tickets</p>
            <h2 className="text-7xl font-semibold mt-2">{evento.nombre}</h2>
            <p className="mt-3 text-2xl text-[#666862]">ID Evento: {evento.id}</p>
          </div>
          <span className="h-14 px-7 rounded-full border border-[#4a5076] text-[#2f3559] bg-[#c8cfdd] text-3xl font-semibold inline-flex items-center">
            {ingresos.estadoLiquidacion}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-8">
          <KpiCard icon={<Ticket className="w-8 h-8" />} label="Total Tickets Vendidos" value={ingresos.metricas.vendidos} />
          <KpiCard icon={<CheckCircle2 className="w-8 h-8" />} label="Tickets Validados" value={ingresos.metricas.validados} />
          <KpiCard icon={<UserRoundX className="w-8 h-8" />} label="No Asistio" value={ingresos.metricas.noAsistio} />
          <KpiCard icon={<Gift className="w-8 h-8" />} label="Cortesias" value={ingresos.metricas.cortesias} />
          <KpiCard icon={<Ban className="w-8 h-8" />} label="Cancelados" value={ingresos.metricas.cancelados} />
        </div>

        <div className="mt-8 rounded-xl bg-[#24244f] text-white p-7">
          <p className="text-xl uppercase text-white/80">Recaudo bruto generado</p>
          <p className="text-6xl font-semibold mt-3">{ingresos.recaudoBruto}</p>
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

function KpiCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#f7f7fa] border border-[#cbccd1] px-6 py-7 min-h-[160px] flex items-center gap-5">
      <div className="w-20 h-20 rounded-full bg-[#bcc3d1] text-[#2d3354] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-3xl text-[#43454b]">{label}</p>
        <p className="text-6xl font-semibold mt-2">{value}</p>
      </div>
    </div>
  );
}

export type { EventoIngresosTicketsRef, IngresosTicketsEventoData };

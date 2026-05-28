import { useEffect, useState, type FormEvent } from "react";
import { ErrorBoundary } from "@/core/errors/error-boundary";
import { AppLayout } from "@/shared/layout/AppLayout";
import { Feature01ConsultarResumenDeVentasPage } from "@/features/eventos/pages/feature-01ConsultarResumenDeVentas-page";
import type { ResumenEventoData } from "@/features/eventos/pages/feature-01ConsultarResumenDeVentas-page";
import { Feature02ConsultarEstadoIngresoPage } from "@/features/eventos/pages/feature-02ConsultarEstadoIngreso-page";
import { Feature04ConsultarIngresosTicketsPage } from "@/features/eventos/pages/feature-04ConsultarIngresosTickets-page";
import { useEventos, useResumenVentas, useEstadoIngreso, useIngresosTickets } from "@/features/eventos/api/eventos.api";
import type { EventoListItem } from "@/features/eventos/api/eventos.api";
import type { ResumenVentasResponse, EstadoIngresoResponse, IngresosResponse } from "@/features/eventos/models/eventos.types";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

type Screen =
  | "index"
  | "eventoAcciones"
  | "consultarResumenDeVentas"
  | "consultarEstadoIngreso"
  | "informarTipoRecinto"
  | "consultarIngresosTickets"
  | "determinarTipoLiquidacionFinal"
  | "registrarValorComisionRecinto"
  | "consultarValorComisionRecinto"
  | "calcularDistribucionDelRecaudo"
  | "consultarDistribucionDelRecaudo";

interface NavigationState {
  screen: Screen;
  eventoId: number | null;
  eventoUuid: string | null;
  eventoNombre: string | null;
}

function mapApiResumenToUI(data: ResumenVentasResponse, eventoId: number): ResumenEventoData {
  const tix = data.ticketsPorCondicion ?? {};
  const rec = data.recaudoPorCondicion ?? {};
  const totalRec = data.totalRecaudoBruto ?? 0;
  const vendidos = tix["VENDIDO"] ?? 0;
  const validados = tix["VALIDADO"] ?? 0;
  const cancelados = tix["CANCELADO"] ?? 0;
  const cortesias = tix["CORTESIA"] ?? 0;

  const fmt = (n: number) => `$ ${n.toLocaleString("es-CO")}`;
  const cancelValor = rec["CANCELADO"] ?? 0;

  return {
    snapshotId: `API-${eventoId}`,
    fechaEvento: new Date().toLocaleDateString("es-CO"),
    estadoEvento: data.estadoEvento ?? "N/A",
    metricas: {
      vendidos: String(vendidos),
      validados: String(validados),
      cancelados: String(cancelados),
      cortesias: String(cortesias),
      totalRecaudado: fmt(totalRec),
    },
    rows: [
      { condicion: "Vendidos", descripcion: "Tickets emitidos con valor bruto asociado", tickets: String(vendidos), valor: fmt(rec["VENDIDO"] ?? 0) },
      { condicion: "Validados", descripcion: "Tickets usados como referencia de asistencia y conciliacion", tickets: String(validados), valor: fmt(rec["VALIDADO"] ?? 0) },
      { condicion: "Cancelados", descripcion: "Boletas reversadas y descontadas del consolidado", tickets: String(cancelados), valor: `- $ ${Math.abs(cancelValor).toLocaleString("es-CO")}`, danger: true },
      { condicion: "Cortesias", descripcion: "Tickets sin recaudo monetario", tickets: String(cortesias), valor: "$ 0" },
      { condicion: "Total usado para liquidacion", descripcion: "Base consolidada para distribucion del recaudo", tickets: String(data.totalTicketsVendidos ?? 0), valor: fmt(totalRec), total: true },
    ],
  };
}

interface TicketEstadoIngreso {
  idTicket: number;
  codigoTicket: string;
  estadoIngreso: string;
  tipoAcceso: string;
}

function mapApiEstadoIngresoToUI(data: EstadoIngresoResponse, eventoId: number) {
  const ticketsList = (data as unknown as { tickets?: TicketEstadoIngreso[] }).tickets ?? [];
  const totalTickets = (data as unknown as { totalTickets?: number }).totalTickets ?? 0;
  const totalCheckeados = (data as unknown as { totalCheckeados?: number }).totalCheckeados ?? 0;
  const totalNoAsistieron = (data as unknown as { totalNoAsistieron?: number }).totalNoAsistieron ?? 0;

  const checkedIn = ticketsList.filter((t: TicketEstadoIngreso) => t.estadoIngreso === "CHECKED_IN").length;
  const noCheckin = ticketsList.filter((t: TicketEstadoIngreso) => t.estadoIngreso === "NO_CHECKIN").length;
  const noInfo = ticketsList.filter((t: TicketEstadoIngreso) => t.estadoIngreso === "NO_INFO" || (!t.estadoIngreso)).length;

  return {
    controlId: `API-${eventoId}`,
    fechaEvento: new Date().toLocaleDateString("es-CO"),
    estadoEvento: "N/A",
    metricas: {
      vendidosConsultados: String(totalTickets),
      checkinRealizado: String(totalCheckeados),
      sinCheckin: String(totalNoAsistieron),
      sinInformacionIngreso: String(noInfo),
      coberturaConsulta: totalTickets > 0 ? "100%" : "0%",
      totalProcesado: String(totalTickets),
    },
    rows: [
      {
        estado: "Check-in realizado",
        descripcion: "Ticket con ingreso confirmado durante la operacion del evento",
        tickets: String(checkedIn),
        usoFinanciero: "Asistio",
        resultado: "Incluido en conciliacion",
        highlight: "success" as const,
      },
      {
        estado: "Sin check-in registrado",
        descripcion: "Ticket vendido sin evidencia de ingreso al recinto",
        tickets: String(noCheckin),
        usoFinanciero: "No asistio",
        resultado: "Clasificado como no asistido",
        highlight: "neutral" as const,
      },
      {
        estado: "Sin informacion de ingreso",
        descripcion: "No se recibio trazabilidad de acceso",
        tickets: String(noInfo),
        usoFinanciero: "Revision",
        resultado: "No asistido por regla de negocio",
        highlight: "warning" as const,
      },
      {
        estado: "Total procesado",
        descripcion: "Total de tickets con estado de ingreso valido para la liquidacion",
        tickets: String(totalTickets),
        usoFinanciero: "Listo para calculo",
        resultado: "100% cobertura",
        total: true,
      },
    ],
  };
}

function mapApiIngresosToUI(data: IngresosResponse, eventoId: number) {
  const vendidos = (data as unknown as { totalTicketsVendidos?: number }).totalTicketsVendidos ?? 0;
  const validados = (data as unknown as { totalTicketsValidados?: number }).totalTicketsValidados ?? 0;
  const cancelados = (data as unknown as { totalTicketsCancelados?: number }).totalTicketsCancelados ?? 0;
  const cortesias = (data as unknown as { totalCortesias?: number }).totalCortesias ?? 0;
  const noAsistio = (data as unknown as { totalNoAsistieron?: number }).totalNoAsistieron ?? 0;
  const recaudoBruto = (data as unknown as { totalRecaudoBruto?: number }).totalRecaudoBruto ?? 0;

  const fmt = (n: number) => `$ ${n.toLocaleString("es-CO")}`;

  return {
    resumenId: `API-${eventoId}`,
    estadoEvento: "N/A",
    estadoLiquidacion: "Pendiente",
    metricas: {
      vendidos: String(vendidos),
      validados: String(validados),
      noAsistio: String(noAsistio),
      cortesias: String(cortesias),
      cancelados: String(cancelados),
    },
    recaudoBruto: fmt(recaudoBruto),
  };
}

function getApiError(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof Error) return error.message;
  return "Error al consultar el servicio externo";
}

function formatUuid(uuid?: string | null): string {
  if (!uuid) return "Sin UUID externo";
  return uuid.length > 18 ? `${uuid.slice(0, 8)}...${uuid.slice(-4)}` : uuid;
}

function LoadingSpinner({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6351a0] mx-auto"></div>
        <p className="mt-4 text-lg text-[#6f6990]">{mensaje}</p>
      </div>
    </div>
  );
}

function ServiceUnavailable({ error, onBack }: { error: string | null; onBack: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-xl">
        <p className="text-2xl text-red-600 font-semibold">Servicio externo no disponible</p>
        <p className="mt-3 text-lg text-[#6f6990]">
          {error ?? "No se pudo conectar con el módulo externo de gestión de recintos. Verifique que el servicio esté disponible e intente nuevamente."}
        </p>
        <p className="mt-2 text-sm text-[#9a94b0]">
          Endpoint: <code className="bg-[#f0eef5] px-2 py-0.5 rounded text-[#6351a0]">{window.location.pathname}</code>
        </p>
        <button onClick={onBack} className="mt-6 text-[#6351a0] underline text-lg">Volver</button>
      </div>
    </div>
  );
}

function FeatureNotImplemented({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-xl">
        <p className="text-2xl text-[#6f6990] font-semibold">Funcionalidad en desarrollo</p>
        <p className="mt-3 text-lg text-[#9a94b0]">
          Esta funcionalidad se conectará al backend cuando esté disponible. Por ahora no hay datos mockeados.
        </p>
        <button onClick={onBack} className="mt-6 text-[#6351a0] underline text-lg">Volver</button>
      </div>
    </div>
  );
}

const initialState: NavigationState = { screen: "index", eventoId: null, eventoUuid: null, eventoNombre: null };

export default function App() {
  const [screen, setScreen] = useState<Screen>("index");
  const [eventoId, setEventoId] = useState<number | null>(null);
  const [eventoUuid, setEventoUuid] = useState<string | null>(null);
  const [eventoNombre, setEventoNombre] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: eventos, isLoading: eventosLoading, error: eventosError } = useEventos();

  const { data: apiResumen, isLoading: apiResumenLoading, error: apiResumenError } = useResumenVentas(
    screen === "consultarResumenDeVentas" ? eventoId ?? undefined : undefined,
  );
  const { data: apiEstadoIngreso, isLoading: estadoIngresoLoading, error: estadoIngresoError } = useEstadoIngreso(
    screen === "consultarEstadoIngreso" ? eventoId ?? undefined : undefined,
  );
  const { data: apiIngresos, isLoading: ingresosLoading, error: ingresosError } = useIngresosTickets(
    screen === "consultarIngresosTickets" ? eventoId ?? undefined : undefined,
  );

  const apiResumenErrorMsg = getApiError(apiResumenError);
  const apiEstadoIngresoErrorMsg = getApiError(estadoIngresoError);
  const apiIngresosErrorMsg = getApiError(ingresosError);

  const navigateTo = (nextScreen: Screen) => {
    const navState: NavigationState = {
      screen: nextScreen,
      eventoId,
      eventoUuid,
      eventoNombre,
    };
    setScreen(nextScreen);
    window.history.pushState(navState, "");
  };

  const handleBuscarEvento = (e: FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term || !eventos) return;
    const encontrado = eventos.find((ev) =>
      ev.nombre.toLowerCase().includes(term) ||
      ev.eventoIdExterno?.toLowerCase().includes(term)
    );
    if (!encontrado) return;
    setEventoId(encontrado.eventoIdLocal);
    setEventoUuid(encontrado.eventoIdExterno);
    setEventoNombre(encontrado.nombre);
    const navState: NavigationState = {
      screen: "eventoAcciones",
      eventoId: encontrado.eventoIdLocal,
      eventoUuid: encontrado.eventoIdExterno,
      eventoNombre: encontrado.nombre,
    };
    setScreen("eventoAcciones");
    window.history.pushState(navState, "");
  };

  const eventosFiltrados = eventos?.filter((ev) =>
    ev.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
    ev.eventoIdExterno?.toLowerCase().includes(searchTerm.trim().toLowerCase())
  ) ?? [];

  const handleSelectEventoFromList = (evento: EventoListItem) => {
    setEventoId(evento.eventoIdLocal);
    setEventoUuid(evento.eventoIdExterno);
    setEventoNombre(evento.nombre);
    const navState: NavigationState = {
      screen: "eventoAcciones",
      eventoId: evento.eventoIdLocal,
      eventoUuid: evento.eventoIdExterno,
      eventoNombre: evento.nombre,
    };
    setScreen("eventoAcciones");
    window.history.pushState(navState, "");
  };

  const applyNavigationState = (state: NavigationState) => {
    setScreen(state.screen);
    setEventoId(state.eventoId);
    setEventoUuid(state.eventoUuid);
    setEventoNombre(state.eventoNombre);
  };

  useEffect(() => {
    window.history.replaceState(initialState, "");

    const onPopState = (event: PopStateEvent) => {
      const state = event.state as NavigationState | null;
      if (!state || !state.screen) {
        applyNavigationState(initialState);
        return;
      }
      applyNavigationState(state);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <ErrorBoundary>
        <AppLayout>
          {screen === "index" && (
            <div className="px-8 md:px-12 py-10">
              <h1 className="text-4xl font-semibold text-[#1f1a37] mb-2">Módulo de Liquidación</h1>
              <p className="text-lg text-[#6f6990] mb-8">
                Los eventos se consultan desde el módulo externo de gestión de recintos.
              </p>

              {eventosLoading ? (
                <LoadingSpinner mensaje="Cargando eventos..." />
              ) : eventos && eventos.length > 0 ? (
                <>
                  <form onSubmit={handleBuscarEvento} className="mb-6 max-w-xl">
                    <label className="flex items-center h-14 rounded-xl border border-[#d7d1e9] bg-white px-5 gap-3 text-[#6f6990] focus-within:border-[#6351a0] transition-colors">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar evento por nombre..."
                        className="w-full bg-transparent text-lg placeholder:text-[#6f6990] outline-none text-[#1f1a37]"
                      />
                    </label>
                  </form>
                  <p className="text-lg text-[#6f6990] mb-4">
                    {eventosFiltrados.length === 1 ? "1 evento encontrado" :
                     eventosFiltrados.length > 1 ? `${eventosFiltrados.length} eventos encontrados` :
                     "Selecciona un evento:"}
                  </p>
                  {eventosFiltrados.length > 0 ? (
                    <div className="grid gap-4">
                      {eventosFiltrados.map((evento) => (
                        <Card key={evento.eventoIdLocal} className="p-5 border border-[#d7d1e9] bg-white cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSelectEventoFromList(evento)}>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h2 className="text-xl font-semibold text-[#1f1a37]">{evento.nombre}</h2>
                              <p className="text-sm text-[#6f6990] mt-1">ID: {evento.eventoIdLocal} · {evento.fechaInicio} · {evento.tipo}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#e5f6ea] text-[#166534]">{evento.estado}</span>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#4f4474]">
                            <p><strong>Inicio:</strong> {evento.fechaInicio}</p>
                            <p><strong>Fin:</strong> {evento.fechaFin}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : searchTerm.trim() ? (
                    <p className="text-center text-lg text-[#6f6990] py-8">No se encontraron eventos con ese nombre.</p>
                  ) : null}
                </>
              ) : (
                <div className="rounded-xl border border-[#e2dcee] bg-[#f5f3fa] p-8 text-center">
                  <div className="text-6xl mb-4 text-[#9a94b0]">📋</div>
                  <p className="text-2xl font-semibold text-[#4f4474]">
                    {eventosError ? "Servicio de eventos no disponible" : "Eventos no disponibles"}
                  </p>
                  <p className="mt-2 text-lg text-[#6f6990] max-w-lg mx-auto">
                    {eventosError
                      ? "No pudimos conectar con el módulo de gestión de recintos. Por favor, verifica que el servicio esté disponible e inténtalo de nuevo."
                      : "No se encontraron eventos registrados. Una vez que haya eventos disponibles, podrás consultarlos desde aquí."}
                  </p>
                </div>
              )}
            </div>
          )}

          {screen === "eventoAcciones" && eventoId && (
            <div className="px-8 md:px-12 py-10">
              <Button variant="ghost" className="mb-6 text-[#4f4474] hover:bg-[#d8d2e8]" onClick={() => { setScreen("index"); window.history.pushState(initialState, ""); }}>
                Volver al inicio
              </Button>

              <h1 className="text-3xl font-semibold text-[#1f1a37]">{eventoNombre ?? `Evento #${eventoId}`}</h1>
              <p className="text-[#6f6990] mt-2">ID: {eventoId}</p>

              <div className="mt-8">
                <p className="text-lg text-[#6f6990] mb-4">Selecciona una accion</p>
                <div className="max-w-3xl grid gap-3">
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("consultarResumenDeVentas")}>
                    Consultar resumen de ventas
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("consultarEstadoIngreso")}>
                    Estado de ingreso
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("informarTipoRecinto")}>
                    Informar tipo de recinto
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("consultarIngresosTickets")}>
                    Consultar ingresos tickets
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("determinarTipoLiquidacionFinal")}>
                    Determinar tipo liquidacion final
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("registrarValorComisionRecinto")}>
                    Registrar valor comision recinto
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("consultarValorComisionRecinto")}>
                    Consultar valor comision recinto
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("calcularDistribucionDelRecaudo")}>
                    Calcular distribución del recaudo
                  </Button>
                  <Button className="justify-start bg-[#6351a0] hover:opacity-95" onClick={() => navigateTo("consultarDistribucionDelRecaudo")}>
                    Consultar distribucion del recaudo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {screen === "consultarResumenDeVentas" && eventoId && (
            apiResumenLoading ? (
              <LoadingSpinner mensaje="Consultando resumen de ventas..." />
            ) : apiResumen ? (
              <Feature01ConsultarResumenDeVentasPage
                onBack={() => navigateTo("eventoAcciones")}
                evento={{ id: String(eventoId), nombre: eventoNombre ?? `Evento #${eventoId}` }}
                resumen={mapApiResumenToUI(apiResumen, eventoId)}
              />
            ) : (
              <ServiceUnavailable
                error={apiResumenErrorMsg}
                onBack={() => navigateTo("eventoAcciones")}
              />
            )
          )}

          {screen === "consultarEstadoIngreso" && eventoId && (
            estadoIngresoLoading ? (
              <LoadingSpinner mensaje="Consultando estado de ingreso..." />
            ) : apiEstadoIngreso ? (
              <Feature02ConsultarEstadoIngresoPage
                onBack={() => navigateTo("eventoAcciones")}
                evento={{ id: String(eventoId), nombre: eventoNombre ?? `Evento #${eventoId}` }}
                estadoIngreso={mapApiEstadoIngresoToUI(apiEstadoIngreso, eventoId)}
              />
            ) : (
              <ServiceUnavailable
                error={apiEstadoIngresoErrorMsg}
                onBack={() => navigateTo("eventoAcciones")}
              />
            )
          )}

          {screen === "consultarIngresosTickets" && eventoId && (
            ingresosLoading ? (
              <LoadingSpinner mensaje="Consultando ingresos de tickets..." />
            ) : apiIngresos ? (
              <Feature04ConsultarIngresosTicketsPage
                onBack={() => navigateTo("eventoAcciones")}
                evento={{ id: String(eventoId), nombre: eventoNombre ?? `Evento #${eventoId}` }}
                ingresos={mapApiIngresosToUI(apiIngresos, eventoId)}
              />
            ) : (
              <ServiceUnavailable
                error={apiIngresosErrorMsg}
                onBack={() => navigateTo("eventoAcciones")}
              />
            )
          )}

          {screen === "informarTipoRecinto" && eventoId && (
            <FeatureNotImplemented onBack={() => navigateTo("eventoAcciones")} />
          )}

          {screen === "determinarTipoLiquidacionFinal" && eventoId && (
            <FeatureNotImplemented onBack={() => navigateTo("eventoAcciones")} />
          )}

          {screen === "registrarValorComisionRecinto" && eventoId && (
            <FeatureNotImplemented onBack={() => navigateTo("eventoAcciones")} />
          )}

          {screen === "consultarValorComisionRecinto" && eventoId && (
            <FeatureNotImplemented onBack={() => navigateTo("eventoAcciones")} />
          )}

          {screen === "calcularDistribucionDelRecaudo" && eventoId && (
            <FeatureNotImplemented onBack={() => navigateTo("eventoAcciones")} />
          )}

          {screen === "consultarDistribucionDelRecaudo" && eventoId && (
            <FeatureNotImplemented onBack={() => navigateTo("eventoAcciones")} />
          )}
        </AppLayout>
      </ErrorBoundary>
  );
}

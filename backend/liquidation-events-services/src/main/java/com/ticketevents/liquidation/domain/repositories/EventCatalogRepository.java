package com.ticketevents.liquidation.domain.repositories;

import com.ticketevents.liquidation.domain.entities.EventoFinalizado;
import java.util.List;

public interface EventCatalogRepository {
    List<EventoFinalizado> findEventosFinalizados();
}

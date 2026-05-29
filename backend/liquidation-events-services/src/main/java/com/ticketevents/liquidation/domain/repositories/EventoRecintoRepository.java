package com.ticketevents.liquidation.domain.repositories;

import com.ticketevents.liquidation.domain.entities.RecintoEvento;

public interface EventoRecintoRepository {
    RecintoEvento findByEventoId(Long eventoId);
}

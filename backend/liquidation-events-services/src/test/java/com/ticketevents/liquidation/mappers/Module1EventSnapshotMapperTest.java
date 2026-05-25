package com.ticketevents.liquidation.mappers;

import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.CondicionDto;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.Module1EventSnapshotDto;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.TicketDto;
import com.ticketevents.liquidation.infrastructure.mappers.Module1EventSnapshotMapper;
import com.ticketevents.liquidation.domain.entities.CondicionLiquidacion;
import com.ticketevents.liquidation.domain.entities.ResumenVentasEvento;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

public class Module1EventSnapshotMapperTest {

    @Test
    public void mapsConditionsAndTotals() {
        Module1EventSnapshotDto dto = new Module1EventSnapshotDto();
        CondicionDto c1 = new CondicionDto();
        c1.setCondicion("VENDIDO_SIN_ASISTENCIA");
        c1.setCantidad(3);
        c1.setValorTotal(new BigDecimal("60000.00"));
        TicketDto t1 = new TicketDto(); t1.setTicketId("f335e0a6-1f12-4ba2-89b1-45e1aad4beef"); t1.setPrecio(new BigDecimal("20000.00"));
        TicketDto t2 = new TicketDto(); t2.setTicketId("e45bc630-e01e-4a74-ba5d-92123bca7625"); t2.setPrecio(new BigDecimal("20000.00"));
        TicketDto t3 = new TicketDto(); t3.setTicketId("b483bdd8-8683-410e-8f82-1eafca99bea0"); t3.setPrecio(new BigDecimal("20000.00"));
        c1.setTickets(Arrays.asList(t1,t2,t3));

        CondicionDto c2 = new CondicionDto();
        c2.setCondicion("CORTESIA");
        c2.setCantidad(1);
        c2.setValorTotal(new BigDecimal("0.00"));
        TicketDto t4 = new TicketDto(); t4.setTicketId("e3b970da-2d8e-49af-9ee4-e660d92849d6"); t4.setPrecio(new BigDecimal("0.00"));
        c2.setTickets(Arrays.asList(t4));

        dto.setCondiciones(Arrays.asList(c1,c2));
        dto.setNombreEvento("Clase Ingenieria de Software");

        Module1EventSnapshotMapper mapper = new Module1EventSnapshotMapper();
        ResumenVentasEvento resumen = mapper.map(dto, 123L);

        assertEquals(123L, resumen.getIdEvento());
        assertEquals("Clase Ingenieria de Software", resumen.getNombreEvento());
        assertEquals(3, resumen.getTicketsPorCondicion().get(CondicionLiquidacion.VENDIDO).intValue());
        assertEquals(new BigDecimal("60000.00"), resumen.getRecaudoPorCondicion().get(CondicionLiquidacion.VENDIDO));
        assertEquals(1, resumen.getTicketsPorCondicion().get(CondicionLiquidacion.CORTESIA).intValue());
        assertEquals(new BigDecimal("0.00"), resumen.getRecaudoPorCondicion().get(CondicionLiquidacion.CORTESIA));
        assertEquals(new BigDecimal("60000.00"), resumen.getTotalRecaudoBruto());
    }
}

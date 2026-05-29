package com.ticketevents.liquidation.infrastructure.interfaces.api;

import com.ticketevents.liquidation.application.usecase.ConsultarEstadoIngresoUseCase;
import com.ticketevents.liquidation.infrastructure.adapter.input.rest.response.ConsultarEstadoIngresoResponse;
import com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.EstadoIngresoDto;
import com.ticketevents.liquidation.infrastructure.mappers.EstadoIngresoMapper;
import com.ticketevents.liquidation.shared.errors.BusinessException;
import com.ticketevents.liquidation.shared.errors.ErrorCode;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EstadoIngresoController.class)
@Import(GlobalExceptionHandler.class)
class EstadoIngresoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ConsultarEstadoIngresoUseCase consultarEstadoIngresoUseCase;

    @MockitoBean
    private EstadoIngresoMapper mapper;

    @Test
    void consultarEstadoIngreso_conEventoExistente_retorna200() throws Exception {
        Long eventoId = 1L;
        EstadoIngresoDto dto = new EstadoIngresoDto(eventoId, "Concierto Rock 2026",
                List.of(new EstadoIngresoDto.RegistroIngresoDTO("1", eventoId, "2026-05-07T10:00:00", "CHECKED_IN", "INGRESO")));
        ConsultarEstadoIngresoResponse response = new ConsultarEstadoIngresoResponse();
        response.setEventoId(eventoId);
        response.setNombreEvento("Concierto Rock 2026");
        response.setTotalTickets(1);
        response.setTotalCheckeados(1);

        when(consultarEstadoIngresoUseCase.execute(eventoId)).thenReturn(dto);
        when(mapper.toResponse(dto)).thenReturn(response);

        mockMvc.perform(get("/api/v1/eventos/{id}/estado-ingreso", eventoId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eventoId").value(eventoId))
                .andExpect(jsonPath("$.totalTickets").value(1))
                .andExpect(jsonPath("$.totalCheckeados").value(1));
    }

    @Test
    void consultarEstadoIngreso_conEventoNoExistente_retorna404() throws Exception {
        Long eventoId = 999L;

        when(consultarEstadoIngresoUseCase.execute(eventoId))
                .thenThrow(new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        mockMvc.perform(get("/api/v1/eventos/{id}/estado-ingreso", eventoId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("EVENT_NOT_FOUND"));
    }

    @Test
    void consultarEstadoIngreso_conErrorServicioExterno_retorna502() throws Exception {
        Long eventoId = 1L;

        when(consultarEstadoIngresoUseCase.execute(eventoId))
                .thenThrow(new TechnicalException(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE,
                        new RuntimeException("Connection refused")));

        mockMvc.perform(get("/api/v1/eventos/{id}/estado-ingreso", eventoId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.code").value("EXTERNAL_SERVICE_UNAVAILABLE"));
    }
}

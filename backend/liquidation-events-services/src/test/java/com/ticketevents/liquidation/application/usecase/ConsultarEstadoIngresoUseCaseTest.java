package com.ticketevents.liquidation.application.usecase;

import com.ticketevents.liquidation.infrastructure.adapter.input.rest.response.ConsultarEstadoIngresoResponse;
import com.ticketevents.liquidation.domain.entities.EstadoIngreso;
import com.ticketevents.liquidation.domain.entities.RegistroIngreso;
import com.ticketevents.liquidation.domain.repositories.AccessControlRepository;
import com.ticketevents.liquidation.infrastructure.mappers.EstadoIngresoMapper;
import com.ticketevents.liquidation.shared.errors.BusinessException;
import com.ticketevents.liquidation.shared.errors.ErrorCode;
import com.ticketevents.liquidation.shared.errors.TechnicalException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConsultarEstadoIngresoUseCaseTest {

    @Mock
    private AccessControlRepository accessControlRepository;

    @Mock
    private EstadoIngresoMapper mapper;

    @InjectMocks
    private ConsultarEstadoIngresoUseCase useCase;

    private List<RegistroIngreso> crearRegistros(int checkeados, int noAsistieron) {
        List<RegistroIngreso> registros = new ArrayList<>();
        
        for (int i = 1; i <= checkeados; i++) {
            registros.add(new RegistroIngreso(
                String.valueOf(i),
                1L,
                LocalDateTime.now(),
                EstadoIngreso.CHECKED_IN,
                "INGRESO"
            ));
        }
        
        for (int i = checkeados + 1; i <= checkeados + noAsistieron; i++) {
            registros.add(new RegistroIngreso(
                String.valueOf(i),
                1L,
                null,
                EstadoIngreso.NOT_ATTENDED,
                null
            ));
        }
        
        return registros;
    }

    @Test
    void execute_conEventoCerrado_retornaResumenCorrectamente() {
        Long eventoId = 1L;
        List<RegistroIngreso> registros = crearRegistros(100, 30);
        
        com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.EstadoIngresoDto outputMock =
            new com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.EstadoIngresoDto();
        outputMock.setEventoId(eventoId);
        outputMock.setNombreEvento("Concierto Rock 2026");

        when(accessControlRepository.getIngresosByEvento(eventoId)).thenReturn(registros);
        when(mapper.toOutput(eq(eventoId), anyString(), eq(registros))).thenReturn(outputMock);

        com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.EstadoIngresoDto response = useCase.execute(eventoId);

        assertNotNull(response);
        assertEquals(eventoId, response.getEventoId());

        verify(accessControlRepository).getIngresosByEvento(eventoId);
    }

    @Test
    void execute_sinRegistros_retornaEstadoVacio() {
        Long eventoId = 999L;
        
        when(accessControlRepository.getIngresosByEvento(eventoId)).thenReturn(new ArrayList<>());
        when(mapper.toOutput(eq(eventoId), anyString(), eq(new ArrayList<>()))).thenReturn(
            new com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.EstadoIngresoDto(
                eventoId,
                "Evento #999",
                new ArrayList<>()
            )
        );

        com.ticketevents.liquidation.infrastructure.adapter.output.external.dto.EstadoIngresoDto response = useCase.execute(eventoId);

        assertNotNull(response);
        assertEquals(eventoId, response.getEventoId());
    }

    @Test
    void execute_conEventoIdNulo_lanzaExcepcion() {
        BusinessException exception = assertThrows(BusinessException.class, 
            () -> useCase.execute(null));
        
        assertEquals(ErrorCode.INVALID_REQUEST, exception.getErrorCode());
    }

    @Test
    void execute_conErrorDeServicioExterno_lanzaTechnicalException() {
        Long eventoId = 1L;
        
        when(accessControlRepository.getIngresosByEvento(eventoId))
            .thenThrow(new RuntimeException("Connection refused"));
        
        TechnicalException exception = assertThrows(TechnicalException.class, 
            () -> useCase.execute(eventoId));
        
        assertEquals(ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE, exception.getErrorCode());
    }

    @Test
    void execute_conRegistroNulo_lanzaExcepcion() {
        Long eventoId = 1L;
        List<RegistroIngreso> registros = crearRegistros(5, 5);
        registros.add(null);
        
        when(accessControlRepository.getIngresosByEvento(eventoId)).thenReturn(registros);
        
        TechnicalException exception = assertThrows(TechnicalException.class, 
            () -> useCase.execute(eventoId));
        
        assertEquals(ErrorCode.INVALID_REQUEST, exception.getErrorCode());
    }
}

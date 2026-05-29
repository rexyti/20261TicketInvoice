package com.ticketevents.liquidation.infrastructure.external;

import com.ticketevents.liquidation.domain.entities.RecintoEvento;
import com.ticketevents.liquidation.domain.repositories.EventoRecintoRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class JpaEventoRecintoRepositoryAdapter implements EventoRecintoRepository {
    private final EntityManager entityManager;

    public JpaEventoRecintoRepositoryAdapter(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public RecintoEvento findByEventoId(Long eventoId) {
        ensureMetadataColumns();
        Object[] row = (Object[]) entityManager.createNativeQuery("""
                SELECT e.id,
                       ee.evento_externo_id,
                       ee.recinto_externo_id,
                       ee.nombre_recinto,
                       ee.tipo_recinto,
                       COALESCE(ee.estado_externo, e.estado) AS estado
                FROM eventos e
                LEFT JOIN eventos_externos ee ON ee.evento_local_id = e.id
                WHERE e.id = :eventoId
                """)
                .setParameter("eventoId", eventoId)
                .getResultStream()
                .findFirst()
                .orElse(null);

        if (row == null) {
            return null;
        }

        RecintoEvento recinto = new RecintoEvento();
        recinto.setEventoIdLocal(((Number) row[0]).longValue());
        recinto.setEventoIdExterno(toStringOrNull(row[1]));
        recinto.setRecintoIdExterno(toStringOrNull(row[2]));
        recinto.setNombreRecinto(toStringOrNull(row[3]));
        recinto.setTipoRecinto(toStringOrNull(row[4]));
        recinto.setEstado(toStringOrNull(row[5]));
        return recinto;
    }

    private void ensureMetadataColumns() {
        entityManager.createNativeQuery("""
                ALTER TABLE eventos_externos
                ADD COLUMN IF NOT EXISTS tipo_recinto VARCHAR(64)
                """).executeUpdate();
        entityManager.createNativeQuery("""
                ALTER TABLE eventos_externos
                ADD COLUMN IF NOT EXISTS nombre_recinto VARCHAR(255)
                """).executeUpdate();
    }

    private String toStringOrNull(Object value) {
        return value == null ? null : String.valueOf(value);
    }
}

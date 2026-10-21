package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.ProgresoMisionEntity;
import com.conectaco.conectaco.enums.EstadoMision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProgresoMisionRepository extends JpaRepository<ProgresoMisionEntity, Integer> {
    List<ProgresoMisionEntity> findByIdTurista(Integer idTurista);
    Optional<ProgresoMisionEntity> findByIdTuristaAndIdMision(Integer idTurista, Integer idMision);

    @Query("select count(p) from ProgresoMisionEntity p, MisionEntity m " +
            "where p.idMision = m.idMision and m.idLugar = :idLugar and p.estado = :estado " +
            "and p.fechaCompletado >= :desde and p.fechaCompletado < :hasta")
    long contarCompletadasEnLugar(Integer idLugar, EstadoMision estado, LocalDateTime desde, LocalDateTime hasta);
}

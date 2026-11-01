package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.VisitaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface VisitaRepository extends JpaRepository<VisitaEntity, Integer> {
    long countByIdLugar(Integer idLugar);

    // Visitas de un lugar entre dos fechas
    long countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(Integer idLugar, LocalDateTime desde, LocalDateTime hasta);

    @Query("select count(distinct v.idLugar) from VisitaEntity v where v.idTurista = :idTurista")
    long contarLugaresVisitados(Integer idTurista);
}

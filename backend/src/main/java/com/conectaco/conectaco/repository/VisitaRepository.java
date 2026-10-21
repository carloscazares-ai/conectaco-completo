package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.VisitaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VisitaRepository extends JpaRepository<VisitaEntity, Integer> {
    long countByIdLugar(Integer idLugar);
    long countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(Integer idLugar, LocalDateTime desde, LocalDateTime hasta);
    List<VisitaEntity> findByIdLugarAndFechaGreaterThanEqual(Integer idLugar, LocalDateTime desde);

    @Query("select count(distinct v.idLugar) from VisitaEntity v where v.idTurista = :idTurista")
    long contarLugaresVisitados(Integer idTurista);
}

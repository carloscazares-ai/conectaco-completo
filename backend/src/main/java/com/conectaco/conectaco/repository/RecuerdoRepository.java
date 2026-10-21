package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.RecuerdoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecuerdoRepository extends JpaRepository<RecuerdoEntity, Integer> {
    List<RecuerdoEntity> findByIdTuristaOrderByFechaDescIdRecuerdoDesc(Integer idTurista);
    List<RecuerdoEntity> findByIdLugarOrderByFechaDescIdRecuerdoDesc(Integer idLugar);
    long countByIdTurista(Integer idTurista);

    @Query("select avg(r.calificacion) from RecuerdoEntity r where r.idLugar = :idLugar and r.calificacion is not null")
    Double promedioCalificacion(Integer idLugar);
}

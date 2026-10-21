package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.PromocionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PromocionRepository extends JpaRepository<PromocionEntity, Integer> {
    List<PromocionEntity> findByIdNegocioOrderByFechaFinAsc(Integer idNegocio);
    List<PromocionEntity> findByActivaTrueAndFechaFinGreaterThanEqualOrderByFechaFinAsc(LocalDate hoy);
}

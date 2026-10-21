package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.FavoritoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<FavoritoEntity, Integer> {
    List<FavoritoEntity> findByIdTurista(Integer idTurista);
    Optional<FavoritoEntity> findByIdTuristaAndIdLugar(Integer idTurista, Integer idLugar);
    long countByIdLugar(Integer idLugar);
    long countByIdLugarAndFechaGreaterThanEqualAndFechaLessThan(Integer idLugar, LocalDateTime desde, LocalDateTime hasta);
}

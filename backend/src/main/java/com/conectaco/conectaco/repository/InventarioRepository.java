package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.InventarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventarioRepository extends JpaRepository<InventarioEntity, Integer> {
    List<InventarioEntity> findByIdTurista(Integer idTurista);
    boolean existsByIdTuristaAndIdRecompensa(Integer idTurista, Integer idRecompensa);
}

package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.MascotaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MascotaRepository extends JpaRepository<MascotaEntity, Integer> {
    Optional<MascotaEntity> findByIdTurista(Integer idTurista);
}

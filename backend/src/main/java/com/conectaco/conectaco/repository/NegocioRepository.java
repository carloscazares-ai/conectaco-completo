package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.NegocioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NegocioRepository extends JpaRepository<NegocioEntity, Integer> {
    Optional<NegocioEntity> findByIdUsuario(Integer idUsuario);
}

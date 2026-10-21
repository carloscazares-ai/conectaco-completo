package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.TuristaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TuristaRepository extends JpaRepository<TuristaEntity, Integer> {
    Optional<TuristaEntity> findByIdUsuario(Integer idUsuario);
}

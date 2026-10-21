package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.LugarEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LugarRepository extends JpaRepository<LugarEntity, Integer> {
    List<LugarEntity> findAllByOrderByCalificacionPromedioDesc();
    List<LugarEntity> findByIdCategoriaOrderByCalificacionPromedioDesc(Integer idCategoria);
    Optional<LugarEntity> findFirstByIdNegocio(Integer idNegocio);
}

package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.LugarEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LugarRepository extends JpaRepository<LugarEntity, Integer> {
    List<LugarEntity> findAllByOrderByCalificacionPromedioDesc();
    Optional<LugarEntity> findFirstByIdNegocio(Integer idNegocio);

    // Busca por categoria y por texto. Si un filtro viene null, no se toma en cuenta.
    @Query("select l from LugarEntity l " +
            "where (:idCategoria is null or l.idCategoria = :idCategoria) " +
            "and (:texto is null or l.nombre like concat('%', :texto, '%') " +
            "     or l.direccion like concat('%', :texto, '%') " +
            "     or l.descripcion like concat('%', :texto, '%')) " +
            "order by l.calificacionPromedio desc")
    List<LugarEntity> buscar(Integer idCategoria, String texto);
}

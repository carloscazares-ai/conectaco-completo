package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.MisionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MisionRepository extends JpaRepository<MisionEntity, Integer> {
    List<MisionEntity> findByActivaTrue();
    List<MisionEntity> findByIdLugar(Integer idLugar);
    List<MisionEntity> findByIdLugarAndActivaTrue(Integer idLugar);
    long countByIdLugarAndActivaTrue(Integer idLugar);
}

package com.conectaco.conectaco.repository;

import com.conectaco.conectaco.entity.RecompensaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecompensaRepository extends JpaRepository<RecompensaEntity, Integer> {
    List<RecompensaEntity> findAllByOrderByRequisitoXpAsc();
}

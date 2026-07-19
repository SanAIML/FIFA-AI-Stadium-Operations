package com.fifa.backend.repository;

import com.fifa.backend.entity.OperationalMemory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperationalMemoryRepository extends JpaRepository<OperationalMemory,Long>{
}
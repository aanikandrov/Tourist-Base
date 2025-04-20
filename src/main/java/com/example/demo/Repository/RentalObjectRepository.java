package com.example.demo.Repository;

import com.example.demo.Entities.RentalObjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalObjectRepository extends JpaRepository<RentalObjectEntity, Long> {

    List<RentalObjectEntity> findAll();

    RentalObjectEntity findByObjectID(Long objectID);

    @Query("SELECT COALESCE(MAX(r.objectID), 0) FROM RentalObjectEntity r")
    Integer findMaxId();

    List<RentalObjectEntity> findByObjectType(String objectType);
}

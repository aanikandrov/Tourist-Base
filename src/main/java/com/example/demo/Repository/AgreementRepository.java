package com.example.demo.Repository;


import com.example.demo.Entities.AgreementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AgreementRepository extends JpaRepository<AgreementEntity, Long> {

    List<AgreementEntity> findAll();

    List<AgreementEntity> findByUserID(Long userID);

    @Query("SELECT a FROM AgreementEntity a LEFT JOIN FETCH a.rentalObject WHERE a.userID = :userId")
    List<AgreementEntity> findByUserIDWithRentalObject(@Param("userId") Long userId);

    @Query("SELECT a FROM AgreementEntity a LEFT JOIN FETCH a.rentalObject")
    List<AgreementEntity> findAllWithDetails();

}

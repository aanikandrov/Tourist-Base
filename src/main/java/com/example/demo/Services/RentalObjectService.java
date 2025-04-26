package com.example.demo.Services;

import com.example.demo.Controllers.DTO.RentalObjectDTO;
import com.example.demo.Entities.AgreementEntity;
import com.example.demo.Entities.ObjectImageEntity;
import com.example.demo.Entities.RentalObjectEntity;
import com.example.demo.Repository.AgreementRepository;
import com.example.demo.Repository.RentalObjectRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RentalObjectService {

    @Autowired
    private RentalObjectRepository rentalObjectRepository;
    @Autowired
    private AgreementRepository agreementRepository;
    private ObjectImageEntity objectImageEntity;


    public RentalObjectEntity updateRentalObject(Long id, RentalObjectDTO dto) {
        RentalObjectEntity entity = rentalObjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Объект не найден"));

        if (dto.getObjectName() != null) {
            entity.setObjectName(dto.getObjectName());
        }
        if (dto.getPrice() != null) {
            entity.setPrice(dto.getPrice());
        }
        if (dto.getObjectInfo() != null) {
            entity.setObjectInfo(dto.getObjectInfo());
        }

        return rentalObjectRepository.save(entity);
    }

    @PersistenceContext
    private EntityManager entityManager;

    public List<String> getAllObjectNames() {
        List<RentalObjectEntity> users = rentalObjectRepository.findAll();
        return users.stream()
                .map(RentalObjectEntity::getObjectName)
                .toList();
    }

    public List<RentalObjectEntity> findByObjectType(String type) {
        return rentalObjectRepository.findByObjectType(type);
    }

    public List<RentalObjectDTO> getAllRentalObjects() {
        return rentalObjectRepository.findAll().stream()
                .map(rental -> {
                    RentalObjectDTO dto = new RentalObjectDTO();
                    dto.setObjectID(rental.getObjectID());
                    dto.setObjectName(rental.getObjectName());
                    dto.setPrice(rental.getPrice());

                    dto.setImagePaths(
                            rental.getImages().stream()
                                    .map(ObjectImageEntity::getImagePath)
                                    .collect(Collectors.toList())
                    );
                    return dto;
                })
                .collect(Collectors.toList());
    }


    public RentalObjectEntity addRentalObject(RentalObjectEntity rentalObject) {
        rentalObject.setObjectType("Item");
        return rentalObjectRepository.save(rentalObject);
    }

    public Integer getMaxRentalObjectId() {
        return rentalObjectRepository.findMaxId();
    }

    public List<RentalObjectEntity> getRentalObjectsByUserId(Long userID) {
        List<RentalObjectEntity> rentalObjects = new ArrayList<>();
        List<AgreementEntity> agreements = agreementRepository.findByUserID(userID);

        for (AgreementEntity agreement : agreements) {
            RentalObjectEntity rentalObject = entityManager.find(RentalObjectEntity.class, agreement.getObjectID());
            if (rentalObject != null) {
                rentalObjects.add(rentalObject);
            }
        }

        return rentalObjects;
    }

    public boolean updateObjectName(Long id, String newName) {
        RentalObjectEntity rentalObject = rentalObjectRepository.findById(id).orElse(null);
        if (rentalObject != null) {
            rentalObject.setObjectName(newName);
            rentalObjectRepository.save(rentalObject);
            return true;
        }
        return false;
    }

    public List<RentalObjectDTO> findByObjectTypeDTO(String type) {
        return rentalObjectRepository.findByObjectType(type).stream()
                .map(rental -> {
                    RentalObjectDTO dto = new RentalObjectDTO();
                    dto.setObjectID(rental.getObjectID());
                    dto.setObjectName(rental.getObjectName());
                    dto.setPrice(rental.getPrice());
                    dto.setObjectInfo(rental.getObjectInfo());
                    dto.setImagePaths(
                            rental.getImages().stream()
                                    .map(ObjectImageEntity::getImagePath)
                                    .collect(Collectors.toList())
                    );
                    return dto;
                })
                .collect(Collectors.toList());
    }

}

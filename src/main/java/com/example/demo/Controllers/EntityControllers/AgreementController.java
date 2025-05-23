package com.example.demo.Controllers.EntityControllers;

import com.example.demo.Controllers.DTO.AgreementDTO;
import com.example.demo.Controllers.DTO.RentalObjectDTO;
import com.example.demo.Entities.AgreementEntity;
import com.example.demo.Entities.RentalObjectEntity;
import com.example.demo.Entities.UserEntity;
import com.example.demo.Repository.AgreementRepository;
import com.example.demo.Repository.RentalObjectRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Services.AgreementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/agreement")
public class AgreementController {
    private final AgreementService agreementService;
    private final AgreementRepository agreementRepository;
    private final RentalObjectRepository rentalObjectRepository;
    private final UserRepository userRepository;

    @Autowired
    public AgreementController(AgreementService agreementService, AgreementRepository agreementRepository, RentalObjectRepository rentalObjectRepository, UserRepository userRepository) {
        this.agreementService = agreementService;
        this.agreementRepository = agreementRepository;
        this.rentalObjectRepository = rentalObjectRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/all")
    public List<AgreementEntity> getAllAgreements() {
        return agreementService.getAllAgreements();
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AgreementDTO> getAllAgreementsForAdmin() {
        return agreementRepository.findAllWithDetails().stream()
                .map(agreement -> {
                    AgreementDTO dto = new AgreementDTO();
                    dto.setAgreementID(agreement.getAgreementID());
                    dto.setUserID(agreement.getUserID());
                    dto.setObjectID(agreement.getObjectID());
                    dto.setTimeBegin(agreement.getTimeBegin());
                    dto.setTimeEnd(agreement.getTimeEnd());
                    dto.setAgreementInfo(agreement.getAgreementInfo());
                    return dto;
                }).collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AgreementDTO>> getAgreementsByUserId(@PathVariable("userId") Long userId) {
        List<AgreementEntity> agreements = agreementRepository.findByUserIDWithRentalObject(userId);

        List<AgreementDTO> dtos = agreements.stream().map(agreement -> {
            AgreementDTO dto = new AgreementDTO();
            dto.setObjectID(agreement.getObjectID());
            dto.setObjectName(agreement.getRentalObject().getObjectName());
            dto.setAgreementID(agreement.getAgreementID());
            dto.setAgreementInfo(agreement.getAgreementInfo());
            dto.setTimeBegin(agreement.getTimeBegin());
            dto.setTimeEnd(agreement.getTimeEnd());
            dto.setSumPrice(agreement.getSumPrice());

            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{agreementId}")
    public ResponseEntity<?> deleteAgreement(@PathVariable("agreementId") Long agreementId) {
        agreementRepository.deleteById(agreementId);
        return ResponseEntity.ok("Договор успешно удален");
    }

    @PostMapping
    public ResponseEntity<?> createAgreement(@RequestBody AgreementDTO agreementDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = (UserEntity) authentication.getPrincipal();

        UserEntity userCurrent = userRepository.findByUserName(user.getUserName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        RentalObjectEntity rentalObject = rentalObjectRepository.findById(agreementDTO.getObjectID())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Объект не найден"));

        if (rentalObject.getPrice() == null) {
            return ResponseEntity.badRequest().body("Цена объекта не указана");
        }

        long startTime = agreementDTO.getTimeBegin().getTime();
        long endTime = agreementDTO.getTimeEnd().getTime();
        long diff = endTime - startTime;
        long days = (diff / 86400000) + 1;
        int sumPrice = rentalObject.getPrice() * (int) days;

        if (agreementDTO.getTimeBegin() == null || agreementDTO.getTimeEnd() == null
                || (agreementDTO.getTimeBegin().after(agreementDTO.getTimeEnd())))
            return ResponseEntity.badRequest().body("Invalid dates");

        if (!agreementService.isObjectAvailable(
                agreementDTO.getObjectID(),
                agreementDTO.getTimeBegin(),
                agreementDTO.getTimeEnd()
        )) {
            return ResponseEntity.badRequest().body("Кончился!");
        }

        AgreementEntity agreement = new AgreementEntity();
        agreement.setUserID(userCurrent.getUserID());
        agreement.setObjectID(agreementDTO.getObjectID());
        agreement.setTimeBegin(agreementDTO.getTimeBegin());
        agreement.setTimeEnd(agreementDTO.getTimeEnd());
        agreement.setAgreementInfo(agreementDTO.getAgreementInfo());
        agreement.setSumPrice(sumPrice);

        agreementRepository.save(agreement);

        return ResponseEntity.ok(Map.of(
                "message", "Agreement created successfully",
                "agreementId", agreement.getAgreementID()
        ));
    }

    @GetMapping("/availability/{objectId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getAvailability(
            @PathVariable Long objectId) {

        Map<String, Object> availability = agreementService.getDailyAvailability(objectId);
        return ResponseEntity.ok(availability);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAgreement(
            @PathVariable Long id,
            @RequestBody AgreementDTO agreementDTO) {

        try {
            AgreementEntity updatedAgreement = agreementService.updateAgreement(id, agreementDTO);

            AgreementDTO responseDTO = new AgreementDTO();

            responseDTO.setAgreementID(updatedAgreement.getAgreementID());
            responseDTO.setTimeBegin(updatedAgreement.getTimeBegin());
            responseDTO.setTimeEnd(updatedAgreement.getTimeEnd());
            responseDTO.setAgreementInfo(updatedAgreement.getAgreementInfo());
            responseDTO.setSumPrice(updatedAgreement.getSumPrice());
            responseDTO.setUserID(updatedAgreement.getUserID());

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}


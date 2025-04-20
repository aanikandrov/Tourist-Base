package com.example.demo.Services;

import com.example.demo.Controllers.DTO.AgreementDTO;
import com.example.demo.Controllers.DTO.RentalObjectDTO;
import com.example.demo.Entities.AgreementEntity;
import com.example.demo.Entities.RentalObjectEntity;
import com.example.demo.Repository.AgreementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class AgreementService {

    private final AgreementRepository agreementRepository;

    @Autowired
    public AgreementService(AgreementRepository agreementRepository) {
        this.agreementRepository = agreementRepository;
    }

    public List<AgreementEntity> getAllAgreements() {
        List<AgreementEntity> agreements = agreementRepository.findAll();
        return agreements;
    }

    public AgreementEntity updateAgreement(Long id, AgreementDTO dto) {
        AgreementEntity entity = agreementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Договор не найден"));

        if (dto.getTimeBegin() != null) {
            entity.setTimeBegin(dto.getTimeBegin());
        }
        if (dto.getTimeEnd() != null) {
            entity.setTimeEnd(dto.getTimeEnd());
        }
        if (dto.getAgreementInfo() != null) {
            entity.setAgreementInfo(dto.getAgreementInfo());
        }
        if (dto.getSumPrice() != null) {
            entity.setSumPrice(dto.getSumPrice());
        }

        return agreementRepository.save(entity);
    }
}
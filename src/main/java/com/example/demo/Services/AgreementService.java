package com.example.demo.Services;

import com.example.demo.Controllers.DTO.AgreementDTO;
import com.example.demo.Entities.AgreementEntity;
import com.example.demo.Entities.RentalObjectEntity;
import com.example.demo.Repository.AgreementRepository;
import com.example.demo.Repository.RentalObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class AgreementService {

    private final AgreementRepository agreementRepository;
    private final RentalObjectRepository rentalObjectRepository;

    @Autowired
    public AgreementService(AgreementRepository agreementRepository, RentalObjectRepository rentalObjectRepository) {
        this.agreementRepository = agreementRepository;
        this.rentalObjectRepository = rentalObjectRepository;
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

    public boolean isObjectAvailable(Long objectId, Date timeBegin, Date timeEnd) {
        RentalObjectEntity rentalObject = rentalObjectRepository.findById(objectId)
                .orElseThrow(() -> new RuntimeException("Объект не найден"));

        int count = agreementRepository.countConflictingAgreements(objectId, timeBegin, timeEnd);
        return count < rentalObject.getMaxCount();
    }

    public Map<String, Object> getDailyAvailability(Long objectId) {
        RentalObjectEntity rentalObject = rentalObjectRepository.findById(objectId)
                .orElseThrow(() -> new RuntimeException("Объект не найден"));

        Date startDate = new Date();
        Date endDate = Date.from(LocalDate.now().plusMonths(1).atStartOfDay(ZoneId.systemDefault()).toInstant());

        List<AgreementEntity> conflicts = agreementRepository.findByObjectIDAndDateRange(
                objectId,
                startDate,
                endDate
        );

        Map<String, Integer> dailyCount = new HashMap<>();
        for (AgreementEntity agreement : conflicts) {
            List<Date> dates = getDatesBetween(agreement.getTimeBegin(), agreement.getTimeEnd());
            for (Date date : dates) {
                String dateStr = new SimpleDateFormat("yyyy-MM-dd").format(date);
                dailyCount.put(dateStr, dailyCount.getOrDefault(dateStr, 0) + 1);
            }
        }

        Map<String, Object> result = new HashMap<>();
        List<Date> allDates = getDatesBetween(startDate, endDate);
        for (Date date : allDates) {
            String dateStr = new SimpleDateFormat("yyyy-MM-dd").format(date);
            int count = dailyCount.getOrDefault(dateStr, 0);
            result.put(dateStr, Map.of(
                    "available", count < rentalObject.getMaxCount(),
                    "count", count
            ));
        }

        return result;
    }

    private List<Date> getDatesBetween(Date startDate, Date endDate) {
        List<Date> dates = new ArrayList<>();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);

        while (calendar.getTime().before(endDate) || calendar.getTime().equals(endDate)) {
            dates.add(calendar.getTime());
            calendar.add(Calendar.DATE, 1);
        }
        return dates;
    }
}
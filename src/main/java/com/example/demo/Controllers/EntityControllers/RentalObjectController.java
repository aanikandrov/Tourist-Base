package com.example.demo.Controllers.EntityControllers;

import com.example.demo.Controllers.DTO.RentalObjectDTO;
import com.example.demo.Entities.ObjectImageEntity;
import com.example.demo.Entities.RentalObjectEntity;
import com.example.demo.Repository.RentalObjectRepository;
import com.example.demo.Services.RentalObjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rental")
public class RentalObjectController {

    private final RentalObjectService rentalObjectService;

    @Autowired
    private RentalObjectRepository rentalObjectRepository;

    @Autowired
    public RentalObjectController(RentalObjectService rentalObjectService) {
        this.rentalObjectService = rentalObjectService;
    }

    @GetMapping("/allnames")
    public List<String> getAllUserNames() {
        return rentalObjectService.getAllObjectNames();
    }

    @GetMapping("/items")
    public ResponseEntity<List<RentalObjectDTO>> getItems() {
        List<RentalObjectDTO> items = rentalObjectService.findByObjectTypeDTO("Item");
        return ResponseEntity.ok(items);
    }

    @GetMapping("/habitations")
    public ResponseEntity<List<RentalObjectDTO>> getHabitations() {
        List<RentalObjectDTO> habitations = rentalObjectService.findByObjectTypeDTO("Habitation");
        return ResponseEntity.ok(habitations);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RentalObjectDTO>> getAllRentalObjects() {
        List<RentalObjectDTO> rentals = rentalObjectService.getAllRentalObjects();
        return ResponseEntity.ok(rentals);
    }

    @GetMapping("/user/{userID}")
    public List<RentalObjectEntity> getRentalObjects(@PathVariable Long userID) {
        return rentalObjectService.getRentalObjectsByUserId(userID);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRentalObject(@PathVariable("id") Long id) {
        try {
            rentalObjectRepository.deleteById(id);
            return ResponseEntity.ok("Объект удален");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка удаления");
        }
    }

    @PostMapping("/items")
    public ResponseEntity<RentalObjectEntity> createRentalObject(
            @RequestBody RentalObjectEntity rentalObject
    ) {
        rentalObject.setObjectID(null);

        if (rentalObject.getObjectType() == null) {
            rentalObject.setObjectType("Item");
        }

        if (rentalObject.getMaxCount() == null) {
            rentalObject.setMaxCount(1);
        }

        RentalObjectEntity created = rentalObjectService.addRentalObject(rentalObject);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}/{newName}")
    public ResponseEntity<String> updateObjectName(
            @PathVariable Long id,
            @PathVariable String newName) {

        boolean isUpdated = rentalObjectService.updateObjectName(id, newName);

        if (isUpdated) {
            return ResponseEntity.ok("Имя объекта успешно изменено на: " + newName);
        } else {
            return ResponseEntity.badRequest().body("Не удалось изменить имя объекта: объект не найден.");
        }
    }

    @PostMapping("/{objectID}/images")
    public ResponseEntity<?> uploadImages(
            @PathVariable Long objectID,
            @RequestBody List<String> imagePaths
    ) {
        RentalObjectEntity object = rentalObjectRepository.findById(objectID)
                .orElseThrow(() -> new RuntimeException("Object not found"));

        imagePaths.forEach(path -> {
            ObjectImageEntity image = new ObjectImageEntity();
            image.setImagePath(path);
            image.setRentalObject(object);
            object.getImages().add(image);
        });

        rentalObjectRepository.save(object);
        return ResponseEntity.ok("Изображения добавлены");
    }

    @PostMapping("/{objectName}/{objectType}")
    public ResponseEntity<RentalObjectEntity> addObjectByNameAndType(
            @PathVariable String objectName,
            @PathVariable String objectType) {

        RentalObjectEntity rentalObject = new RentalObjectEntity(objectName, objectType);
        RentalObjectEntity createdRentalObject = rentalObjectService.addRentalObject(rentalObject);

        return new ResponseEntity<>(createdRentalObject, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRentalObject(
            @PathVariable Long id,
            @RequestBody RentalObjectDTO rentalObjectDTO) {

        try {
            RentalObjectEntity updatedObject = rentalObjectService.updateRentalObject(id, rentalObjectDTO);
            return ResponseEntity.ok(updatedObject);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }




}


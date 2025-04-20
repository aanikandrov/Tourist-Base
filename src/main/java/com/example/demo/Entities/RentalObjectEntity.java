package com.example.demo.Entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Rental_Object_Table")
public class RentalObjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Object_ID")
    private Integer objectID;

    @Column(name = "Object_Name", nullable = false, length = 200)
    private String objectName;

    @Column(name = "Object_Type", nullable = false, length = 10)
    private String objectType;

    @Column(name = "Object_Info")
    private String objectInfo;

    @Column(name = "Price")
    private Integer price;

    @OneToMany(mappedBy = "rentalObject", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ObjectImageEntity> images = new ArrayList<>();

    public RentalObjectEntity() {
    }

    public RentalObjectEntity(Integer objectID, String objectName, String objectType, String objectInfo, Integer price) {
        this.objectID = objectID;
        this.objectName = objectName;
        this.objectType = objectType;
        this.objectInfo = objectInfo;
        this.price = price;
    }

    public RentalObjectEntity(Integer objectID, String objectName, String objectType, String objectInfo, String imagePath, Integer price) {
        this.objectID = objectID;
        this.objectName = objectName;
        this.objectType = objectType;
        this.objectInfo = objectInfo;
        //this.imagePath = imagePath;
        this.price = price;
    }

    public RentalObjectEntity(String objectName, String objectType) {
        this.objectName = objectName;
        this.objectType = objectType;
    }

    public RentalObjectEntity(Integer objectID, String objectName, String objectType) {
        this.objectID = objectID;
        this.objectName = objectName;
        this.objectType = objectType;
    }

    public Integer getObjectID() {
        return objectID;
    }

    public void setObjectID(Integer objectID) {
        this.objectID = objectID;
    }

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public String getObjectType() {
        return objectType;
    }

    public void setObjectType(String objectType) {
        this.objectType = objectType;
    }

    public List<ObjectImageEntity> getImages() {
        return images;
    }

    public void setImages(List<ObjectImageEntity> images) {
        this.images = images;
    }


    public String getObjectInfo() {
        return objectInfo;
    }

    public void setObjectInfo(String objectInfo) {
        this.objectInfo = objectInfo;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }
}
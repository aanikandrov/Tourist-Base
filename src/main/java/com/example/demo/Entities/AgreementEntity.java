package com.example.demo.Entities;

import jakarta.persistence.*;

import java.util.Date;


@Entity
@Table(name = "Agreement_Table")
public class AgreementEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Agreement_ID")
    private Long agreementID;

    @Column(name = "User_ID")
    private Long userID;

    @Column(name = "Object_ID")
    private Integer objectID;

    @Column(name = "Agreement_Info")
    private String agreementInfo;

    @Column(name = "Time_Begin")
    @Temporal(TemporalType.DATE)
    private Date timeBegin;

    @Column(name = "Time_End")
    @Temporal(TemporalType.DATE)
    private Date timeEnd;

    @Column(name = "Sum_Price")
    private Integer sumPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "object_id", insertable = false, updatable = false)
    private RentalObjectEntity rentalObject;

    public RentalObjectEntity getRentalObject() {
        return rentalObject;
    }

    public void setRentalObject(RentalObjectEntity rentalObject) {
        this.rentalObject = rentalObject;
    }


    public AgreementEntity() {
    }

    public AgreementEntity(Long agreementID, Long userID, Integer objectID, String eventName, String eventInfo, Date timeBegin, Date timeEnd, Integer sumPrice) {
        this.agreementID = agreementID;
        this.userID = userID;
        this.objectID = objectID;
        this.agreementInfo = eventInfo;
        this.timeBegin = timeBegin;
        this.timeEnd = timeEnd;
        this.sumPrice = sumPrice;
    }

    public Long getAgreementID() {
        return agreementID;
    }

    public void setAgreementID(Long agreementID) {
        this.agreementID = agreementID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public Integer getObjectID() {
        return objectID;
    }

    public void setObjectID(Integer objectID) {
        this.objectID = objectID;
    }

    public String getAgreementInfo() {
        return agreementInfo;
    }

    public void setAgreementInfo(String eventInfo) {
        this.agreementInfo = eventInfo;
    }

    public Date getTimeBegin() {
        return timeBegin;
    }

    public void setTimeBegin(Date timeBegin) {
        this.timeBegin = timeBegin;
    }

    public Date getTimeEnd() {
        return timeEnd;
    }

    public void setTimeEnd(Date timeEnd) {
        this.timeEnd = timeEnd;
    }

    public Integer getSumPrice() {
        return sumPrice;
    }

    public void setSumPrice(Integer sumPrice) {
        this.sumPrice = sumPrice;
    }
}
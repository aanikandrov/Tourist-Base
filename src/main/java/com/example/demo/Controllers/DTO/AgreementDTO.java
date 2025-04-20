package com.example.demo.Controllers.DTO;

import java.util.Date;

public class AgreementDTO {

    private Long agreementID;
    private String agreementInfo;
    private Date timeBegin;
    private Date timeEnd;
    private Integer objectID;
    private String objectName;
    private Integer sumPrice;




    public Integer getObjectID() {
        return objectID;
    }

    public void setObjectID(Integer objectID) {
        this.objectID = objectID;
    }

    public Long getAgreementID() {
        return agreementID;
    }

    public void setAgreementID(Long agreementID) {
        this.agreementID = agreementID;
    }


    public Integer getSumPrice() {
        return sumPrice;
    }

    public void setSumPrice(Integer sumPrice) {
        this.sumPrice = sumPrice;
    }

    public String getObjectName() {
        return objectName;
    }


    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public String getAgreementInfo() {
        return agreementInfo;
    }

    public void setAgreementInfo(String agreementInfo) {
        this.agreementInfo = agreementInfo;
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


}

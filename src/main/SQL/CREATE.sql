CREATE TABLE User_Table (
    User_ID BIGSERIAL UNIQUE PRIMARY KEY,
    User_Name VARCHAR(200) NOT NULL,
    User_Password VARCHAR(68),
    User_Role VARCHAR(50),
    Phone VARCHAR(11) UNIQUE CHECK (Phone ~ '^\d{11}$'),
    Birth_Date DATE
);

CREATE TABLE Rental_Object_Table (
    Object_ID BIGSERIAL UNIQUE PRIMARY KEY,
    Object_Name VARCHAR(200) NOT NULL,
    Object_Type VARCHAR(10) NOT NULL,
    Object_Info TEXT,
    Price INT, -- rent price in rubles (for day)
    Max_Count INT,
    Image_Path VARCHAR(255)
);

CREATE TABLE Object_Images (
   Image_ID BIGSERIAL PRIMARY KEY,
   Object_ID BIGINT REFERENCES Rental_Object_Table(Object_ID),
   Image_Path VARCHAR(255) NOT NULL
);

CREATE TABLE Agreement_Table (
    Agreement_ID BIGSERIAL PRIMARY KEY,
    User_ID INTEGER /*REFERENCES User_Table (User_ID)*/,
    Object_ID INTEGER /*REFERENCES Rental_Object_Table (Object_ID)*/,
    Agreement_Info TEXT,
    Time_Begin DATE,
    Time_End DATE,
    Sum_Price INT -- sum price in rubles
);

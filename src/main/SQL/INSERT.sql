INSERT INTO Rental_Object_Table (Object_Name, Object_Type, Object_Info, Price, Max_Count) VALUES
('Рюкзак (50л)', 'Item', 'Просторный и прочный для длительных походов', 350, 3),
('Рюкзак (60л)', 'Item', 'Удобный и вместительный', 400, 2),
('Альпинистская кирка', 'Item', 'Разработана для крутых ледяных восхождений', 250, 4),
('Шлем для скалолазания', 'Item', 'Легкая защита для вашей головы', 150, 1),
('Термопокрывало', 'Item', 'Теплая экстренная защита', 100, 2),

('Двухместная палатка', 'Habitation', 'Просторная для двоих', 800, 2),
('Гостевой дом', 'Habitation', 'Уютно с удобствами', 2500, 2),
('Коттедж для отдыха', 'Habitation', 'На природе с барбекю', 4000, 2),

('Горный тур', 'Event', 'Экскурсия на выходные с гидом', 2000, 2),
('Восхождение на вершину', 'Event', 'Профессиональный гид по восхождению', 5000, 2),
('Каякинг по реке', 'Event', 'Сценический каякинг-тур', 3000, 2),
('Поход по лесу', 'Event', 'Экскурсия по природе с гидом', 1500, 2);

INSERT INTO Object_Images(object_id, image_path) VALUES
(1, 'items/item1_1.jpg'),
(1, 'items/item1_2.jpg'),
(3, 'items/item2_1.jpg'),
(4, 'items/item3_1.jpg'),
(2, 'items/item5_1.png'),
(2, 'items/item5_2.png'),
(7, 'habitations/home1_1.jpg'),
(7, 'habitations/home1_2.jpg'),
(7, 'habitations/home1_3.jpg'),
(8, 'habitations/home2_1.jpg'),
(8, 'habitations/home2_2.jpg'),
(8, 'habitations/home2_3.jpg');

INSERT INTO Agreement_Table (User_ID, Object_ID, Time_Begin, Time_End, Sum_Price) VALUES
(1, 1, '2023-06-01', '2023-06-03', 1000),
(1, 3, '2023-08-05', '2023-08-08', 1200),
(2, 2, '2023-07-10', '2023-07-13', 900),
(2, 5, '2023-09-15', '2023-09-17', 400);



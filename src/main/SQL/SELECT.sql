SELECT * FROM user_table;

SELECT * FROM rental_object_table;

SELECT * FROM agreement_table;

SELECT * FROM object_images;

SELECT u.user_id, a.agreement_id
    FROM user_table u
JOIN agreement_table a
    ON a.user_id = u.user_id;

UPDATE user_table
SET user_role = 'USER'
WHERE user_role != 'ADMIN';

UPDATE user_table
SET user_role = 'ADMIN'
WHERE user_table.user_name = 'admin';

ALTER SEQUENCE rental_object_table_object_id_seq RESTART WITH 1;
SELECT setval('rental_object_table_object_id_seq', (SELECT MAX(object_id) FROM rental_object_table));

TRUNCATE TABLE rental_object_table RESTART IDENTITY CASCADE;
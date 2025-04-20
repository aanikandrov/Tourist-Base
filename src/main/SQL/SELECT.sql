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
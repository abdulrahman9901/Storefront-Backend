/* Replace with your SQL commands */

CREATE Table Orders (
    id SERIAL PRIMARY KEY, 
    user_id  integer not null, 
    status varchar(50) NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES  Users(id)
    );
-- Users Table
CREATE TABLE Users(
    user_id SERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    gender VARCHAR(10) NOT NULL,
    address VARCHAR NOT NULL,
    jobrole VARCHAR NOT NULL,
    department_id INT NOT NULL REFERENCES Departments,
    isadmin BOOLEAN NOT NULL
);

CREATE TABLE Departments(
    department_id SERIAL NOT NULL PRIMARY KEY,
    name NOT NULL VARCHAR,
);

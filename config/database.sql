-- Users Table
CREATE TABLE Users(
    user_id SERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    gender VARCHAR(10) NOT NULL,
    address VARCHAR,
    jobrole VARCHAR NOT NULL,
    department_id INT NOT NULL REFERENCES Departments,
    isadmin BOOLEAN DEFAULT false NOT NULL,
    profile_pic VARCHAR,
    created_at TIMESTAMP
);

CREATE TABLE Departments(
    department_id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR NOT NULL,
);

-- Insert rows in the departments table
INSERT INTO departments (name)
VALUES ('Finance'), ('Logistics'), ('Lab'), ('Engineering'), ('Brewing'), ('Packaging'), ('Human Resources');

-- Posts Table
CREATE TABLE posts(
    post_id SERIAL NOT NULL PRIMARY KEY,
    article TEXT,
    gif_link VARCHAR,
    created_by INT NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    in_department INT NOT NULL,
    CONSTRAINT posts_departments_fkey
        FOREIGN KEY (in_department)
            REFERENCES departments(department_id)
)

-- Comments Table
CREATE TABLE comments(
    comment_id SERIAL NOT NULL PRIMARY KEY,
    content VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    in_department INT NOT NULL,
    created_by INT NOT NULL,
    post_id INT NOT NULL REFERENCES posts(post_id),
    constraint comments_departments_fkey
        FOREIGN KEY(in_department)
            REFERENCES departments(department_id),
    constraint comments_users_fkey
        FOREIGN KEY(created_by)
            REFERENCES users(user_id)
)
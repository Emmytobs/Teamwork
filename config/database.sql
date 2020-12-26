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
    name NOT NULL VARCHAR,
);

-- Articles Table
CREATE TABLE articles(
    article_id SERIAL NOT NULL PRIMARY KEY,
    content TEXT NOT NULL,
    created_by INT NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    in_department INT NOT NULL,
    CONSTRAINT articles_departments_fkey
        FOREIGN KEY (in_department)
            REFERENCES departments(department_id)
);

-- Gifs Table
CREATE TABLE gifs(
    gif_id SERIAL NOT NULL PRIMARY KEY,
    git_link VARCHAR NOT NULL,
    created_by INT NOT NULL REFERENCES users(user_id),
    in_department INT NOT NULL,
    CONSTRAINT gifs_departments_fkey
        FOREIGN KEY (in_department)
            REFERENCES departments(department_id)
);
CREATE TABLE person
( id SERIAL PRIMARY KEY,
  email text not null unique,
  password text not null,
  isActivated BOOLEAN default false,
  activationLink VARCHAR(255),
  secret2fa VARCHAR(255)
);

CREATE TABLE password(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    login VARCHAR(255),
    password VARCHAR(255),
    iv VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
);

-- CREATE TABLE password(
--     user_id INTEGER,
--     FOREIGN KEY (user_id) REFERENCES person (id),
--     refreshToken VARCHAR(255)
-- ); 
DROP TABLE IF EXISTS favMovies; 

CREATE TABLE IF NOT EXISTS favMovies(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date VARCHAR(255),
    vote_count INTEGER,
    poster_path VARCHAR(10000),
    overview VARCHAR(10000),
    comments VARCHAR(255)
);
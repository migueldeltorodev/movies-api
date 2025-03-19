CREATE TABLE genres (
    movieId UUID REFERENCES movies (id),
    name TEXT NOT NULL );
CREATE TABLE IF NOT EXISTS genres (
    movieId UUID REFERENCES movies (id),
    name TEXT NOT NULL );
CREATE UNIQUE INDEX concurrently IF NOT EXISTS movies_slug_idx
    ON movies
    USING btree(slug);
-- Required Postgres extensions.
create extension if not exists "pgcrypto"; -- gen_random_uuid()
create extension if not exists "pg_trgm";  -- trigram search (names/emails/questions)

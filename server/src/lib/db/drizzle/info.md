-- This SQL script will delete all tables in the public schema of a PostgreSQL database.

DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP 
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE;'; 
    END LOOP; 
END $$;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT n.nspname AS schema_name, t.typname AS enum_name
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public'
        GROUP BY schema_name, enum_name
    LOOP
        EXECUTE format('DROP TYPE IF EXISTS %I.%I CASCADE;', r.schema_name, r.enum_name);
    END LOOP;
END $$;

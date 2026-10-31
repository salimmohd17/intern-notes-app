# Supabase PostgreSQL Setup

## Create the Supabase database

1. Create a Supabase project.
2. In the project SQL editor, create the database schema by running the contents of
   `backend/database/migrations/001_create_notes.sql`, or use the migration command below.
3. Open **Project Settings > Database > Connection string** and copy the PostgreSQL URI for your
   environment.

## Configure the backend locally

From `backend`, create `.env`:

```env
DATABASE_URL=postgresql://postgres:<password>@<host>:5432/postgres
PORT=5000
NODE_ENV=development
DATABASE_SSL_REJECT_UNAUTHORIZED=true
```

Use the connection URI supplied by Supabase. Do not commit `.env`. URL-encode special characters in
the password, or prefer the Supabase-provided URI. For Supabase transaction pooler connections,
use the URI supplied by Supabase rather than changing host or port manually.

`DATABASE_SSL_REJECT_UNAUTHORIZED=false` may be used only when your provider or environment cannot
validate its certificate. TLS remains enabled either way.

## Run migrations

```bash
cd backend
npm install
npm run migrate
npm run db:test
```

The backend also runs pending migrations automatically during controlled startup. Migrations are
tracked in `schema_migrations`, skipped when already applied, and wrapped in a transaction.

## Configure Render

1. Set the Render service root directory to `backend`.
2. Keep the start command as `npm start`.
3. Add these environment variables:
   - `DATABASE_URL`: the Supabase PostgreSQL connection URI.
   - `NODE_ENV`: `production`
   - `PORT`: Render supplies this automatically; it does not normally need to be set.
   - `DATABASE_SSL_REJECT_UNAUTHORIZED`: `true`, unless certificate validation requires an
     intentional override.

Render restarts the service after environment changes.

## Verify the deployment

```bash
npm --prefix backend run db:test
curl https://<backend-service>.onrender.com/api/health
```

The health endpoint should return `"database":"connected"` and HTTP 200.

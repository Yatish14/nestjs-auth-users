// Builds the Postgres connection string from DB_* env vars.
// A full DATABASE_URL, if set, takes precedence (e.g. a hosted provider's URL with ?sslmode=require).
export function getDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  if (env.DATABASE_URL) {
    return env.DATABASE_URL;
  }

  const { DB_HOST = 'localhost', DB_PORT = '5432', DB_USER, DB_PASSWORD, DB_NAME } = env;

  const missing = Object.entries({ DB_USER, DB_PASSWORD, DB_NAME })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing database env vars: ${missing.join(', ')} (or set DATABASE_URL)`);
  }

  const user = encodeURIComponent(DB_USER!);
  const password = encodeURIComponent(DB_PASSWORD!);

  return `postgresql://${user}:${password}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

export type EnvSnapshot = {
  DATABASE_URL?: string;
  DATABASE_AUTH_TOKEN?: string;
  VERCEL?: string;
  VERCEL_ENV?: string;
  NODE_ENV?: string;
  DIAG_TOKEN?: string;
};

export function getEnvSnapshot(): EnvSnapshot {
  return {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN ? '***set***' : undefined,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NODE_ENV: process.env.NODE_ENV,
    DIAG_TOKEN: process.env.DIAG_TOKEN ? '***set***' : undefined,
  };
}

export function maskUrl(url?: string) {
  if (!url) return '(not set)';
  try {
    const u = new URL(url);
    // mask query params
    u.search = u.search ? '?***' : '';
    return u.toString();
  } catch {
    return url.includes('libsql://') ? 'libsql://***' : url;
  }
}


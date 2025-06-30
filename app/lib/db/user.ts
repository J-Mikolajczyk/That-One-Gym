import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getUserByEmail(email: string) {
    const query = `
        SELECT * FROM users
        WHERE email = $1
        LIMIT 1;
    `;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
}

export async function linkAccount(userId: string, account: {
  provider: string;
  providerAccountId: string;
  type: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  id_token?: string;
  token_type?: string;
  scope?: string;
}) {
  const query = `
    INSERT INTO "accounts" (
        "userId", "provider", "providerAccountId", "type",
        "access_token", "refresh_token", "expires_at", "id_token",
        "token_type", "scope"
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT DO NOTHING;
  `;

  const values = [
    userId,
    account.provider,
    account.providerAccountId,
    account.type,
    account.access_token || null,
    account.refresh_token || null,
    account.expires_at || null,
    account.id_token || null,
    account.token_type || null,
    account.scope || null,
  ];

  await pool.query(query, values);
}

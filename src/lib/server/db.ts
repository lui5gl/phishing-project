// ------------------------------------------------------------------
// Conexión a Neon PostgreSQL (serverless)
// ------------------------------------------------------------------
// Usa @neondatabase/serverless que está optimizado para entornos
// serverless (Vercel, Netlify, Cloudflare) con conexiones vía WebSocket.
// ------------------------------------------------------------------

import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';

/** Cliente SQL listo para usar. Ejecutás consultas con `sql\`query\`` */
const sql = neon(env.DATABASE_URL!);

export default sql;

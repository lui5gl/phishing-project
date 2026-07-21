// ------------------------------------------------------------------
// Conexión a Neon PostgreSQL (serverless)
// ------------------------------------------------------------------
// Usa @neondatabase/serverless que está optimizado para entornos
// serverless (Vercel, Netlify, Cloudflare) con conexiones vía WebSocket.
// ------------------------------------------------------------------

import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';

/** Cliente SQL listo para usar. Ejecutás consultas con `sql\`query\`` */
const sql = neon(DATABASE_URL);

export default sql;

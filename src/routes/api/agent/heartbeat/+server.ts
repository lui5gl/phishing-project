// ------------------------------------------------------------------
// API — Heartbeat del agente Rust
// ------------------------------------------------------------------
// El agente envía un POST periódicamente (cada 5 min) reportando:
//   - session_id (UUID único que el agente genera al arrancar)
//   - hostname, username, ip_address, os_version
// Crea o actualiza la sesión en la BD.
// ------------------------------------------------------------------

import type { RequestHandler } from './$types';
import sql from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { session_id, hostname, username, ip_address, os_version } = body;

	if (!session_id) {
		return new Response(JSON.stringify({ error: 'session_id required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		await sql`
			INSERT INTO sessions (id, hostname, username, ip_address, os_version)
			VALUES (${session_id}, ${hostname ?? ''}, ${username ?? ''}, ${ip_address ?? ''}, ${os_version ?? ''})
			ON CONFLICT (id) DO UPDATE SET
				last_seen = NOW(),
				hostname = EXCLUDED.hostname,
				ip_address = EXCLUDED.ip_address
		`;

		return new Response(JSON.stringify({ ok: true }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		console.error('Error en heartbeat:', err);
		return new Response(JSON.stringify({ error: 'DB error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};

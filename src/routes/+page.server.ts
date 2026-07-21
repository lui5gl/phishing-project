// ------------------------------------------------------------------
// FORM ACTION — Página principal (clon UDV)
// ------------------------------------------------------------------
// Ya no se usa para login real — el formulario apunta a /api/login.
// Se deja mínima por si acaso, solo retorna un objeto serializable.
// ------------------------------------------------------------------

export const actions = {
	default: async () => {
		return { success: true };
	},
};

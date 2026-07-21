<script lang="ts">
	// ------------------------------------------------------------------
	// Login — el formulario apunta a /api/login (endpoint independiente)
	// que captura las credenciales, obtiene un token fresco del Moodle
	// real y auto-envía un POST para que el usuario quede autenticado.
	// ------------------------------------------------------------------
</script>

<main class="relative flex min-h-screen items-center justify-around bg-gray-100">
	<!-- Background -->
	<img
		src="/udv/background.png"
		alt="Background"
		class="fixed inset-0 h-full w-full object-cover"
	/>

	<section class="relative z-10 rounded-md bg-white p-8 shadow-md">
		<img
			src="/udv/logo.png"
			alt="Universidad Da Vinci de Guatemala"
			width="350"
			height="150"
			class="m-auto"
		/>

		<!-- ---- Formulario de login (postea a /api/login) ---- -->
		<form method="POST" action="/api/login">
			<input
				name="username"
				type="text"
				placeholder="Nombre de usuario"
				class="mt-4 w-full rounded-[0.6rem] border border-[#8f959e] px-3 py-2 focus:outline-none"
			/>
			<input
				name="password"
				type="password"
				placeholder="Contraseña"
				class="mt-4 w-full rounded-[0.6rem] border border-[#8f959e] px-3 py-2 focus:outline-none"
			/>
			<input
				type="submit"
				value="Acceder"
				class="mt-4 w-full cursor-pointer rounded bg-[#011946] py-2 text-white focus:outline-none"
			/>
		</form>

		<hr class="my-4 border-t border-[#dee2e6]" />
		<div class="flex flex-col items-center justify-center gap-2">
			<a href="https://www.udv.edu.gt/" target="_blank" class=" text-[#011946] hover:underline">
				¿Olvidó su contraseña?
			</a>
		</div>
		<hr class="my-4 border-t border-[#dee2e6]" />
		<div class="flex items-center justify-center gap-2">
			<div class="mr-5 flex border-r border-[#dee2e6] pr-5">
				<select
					class="w-full rounded-[0.6rem] border-[#8f959e] px-3 py-2 text-[#011946] focus:outline-none"
				>
					<option value="en">English (en)</option>
					<option value="es" selected>Español - Internacional (es)</option>
				</select>
			</div>
			<button
				class="rounded-md bg-[#d5dae0] px-4 py-2 text-nowrap text-[#011946] hover:bg-[#c5cbd2]"
			>
				Aviso de Cookies
			</button>
		</div>
	</section>
</main>

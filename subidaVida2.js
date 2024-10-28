import { login } from './login.js'

const actualizarPokemon = async (vidapok, nombre, accessToken) => {
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'User-Agent': 'insomnia/10.1.0',
			apikey:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZG5jZWdnbHdlYWZvZmlwa3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MDMwNDEsImV4cCI6MjA0NDA3OTA0MX0.usSaU9Ff74UTnPVjExUs0t68TN1T98O97IcbrBLDQKw',
			Authorization: `Bearer ${accessToken}`,
			Prefer: 'return=minimal',
		},
		body: JSON.stringify({ vida: vidapok * 1.2 }),
	}

	try {
		const response = await fetch(
			`https://zudncegglweafofipksu.supabase.co/rest/v1/pokemon?nombre=eq.${nombre}`,
			options,
		)
		console.log('Pokemon updated successfully:', response)
	} catch (err) {
		console.error('Error updating Pokemon:', err)
	}
}

const token = login.token
actualizarPokemon(100, 'Pikachu', token)
// Export the update function for use in other files

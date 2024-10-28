async function login(email, password) {
	const options = {
		method: 'POST',
		headers: {
			'User-Agent': 'insomnia/10.1.0',
			apikey:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZG5jZWdnbHdlYWZvZmlwa3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MDMwNDEsImV4cCI6MjA0NDA3OTA0MX0.usSaU9Ff74UTnPVjExUs0t68TN1T98O97IcbrBLDQKw',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	}

	try {
		const response = await fetch(
			'https://zudncegglweafofipksu.supabase.co/auth/v1/token?grant_type=password',
			options,
		)
		const data = await response.json()
		return data // Return the response to be used later
	} catch (err) {
		console.error('Error logging in:', err)
	}
}

async function updatePokemon(vida, nombre, accessToken) {
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'User-Agent': 'insomnia/10.1.0',
			apikey:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZG5jZWdnbHdlYWZvZmlwa3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MDMwNDEsImV4cCI6MjA0NDA3OTA0MX0.usSaU9Ff74UTnPVjExUs0t68TN1T98O97IcbrBLDQKw',
			Authorization: `Bearer ${accessToken}`, // Use the access token from login
			Prefer: 'return=minimal',
		},
		body: JSON.stringify({ vida: vida * 1.2 }),
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

async function main() {
	const mail = 'ldanicp1998@gmail.com'
	const pass = '123456789'
	const loginData = await login(mail, pass) // Await the login and get the tokens

	if (loginData && loginData.access_token) {
		const vida = 190
		const nombre = 'Pikachu'
		await updatePokemon(vida, nombre, loginData.access_token) // Use the access token to update the Pokemon
	} else {
		console.error('Login failed.')
	}
}

main() // Run the main function

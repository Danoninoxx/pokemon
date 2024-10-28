// main.js

const login = require('./login') // Import the login function
const actualizarPokemon = require('./subidaVida2') // Import the update function

const main = async () => {
	const mail = 'ldanicp1998@gmail.com'
	const pass = '123456789'
	const loginData = await login(mail, pass) // Call the login function

	if (loginData && loginData.access_token) {
		const vida = 170
		const nombre = 'Pikachu'
		await actualizarPokemon(vida, nombre, loginData.access_token) // Use the access token to update the Pokémon
	} else {
		console.error('Login failed.')
	}
}

main() // Run the main function

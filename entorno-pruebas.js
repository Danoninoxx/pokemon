// Definimos variables para los jugadores
let player1 = []
let player2 = []
let copiaP1 = []
let copiaP2 = []

// Opciones para la petición Fetch
const options = {
	method: 'GET',
	headers: {
		'User-Agent': 'insomnia/10.0.0',
		apikey:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZG5jZWdnbHdlYWZvZmlwa3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MDMwNDEsImV4cCI6MjA0NDA3OTA0MX0.usSaU9Ff74UTnPVjExUs0t68TN1T98O97IcbrBLDQKw',
		Authorization:
			'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZG5jZWdnbHdlYWZvZmlwa3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MDMwNDEsImV4cCI6MjA0NDA3OTA0MX0.usSaU9Ff74UTnPVjExUs0t68TN1T98O97IcbrBLDQKw',
	},
}

// Función para cargar los datos de Pokémon
async function cargar() {
	console.log('INICIO')
	const response = await fetch(
		'https://zudncegglweafofipksu.supabase.co/rest/v1/pokemon?select=*',
		options,
	)
	const data = await response.json()

	// Filtrar los Pokémon por jugador
	player1 = data.filter((e) => e.player === 1)
	player2 = data.filter((e) => e.player === 2)

	// Crear copias de los Pokémon con vida actual
	copiaP1 = player1.map((e) => ({ ...e, vidaActual: e.vida }))
	copiaP2 = player2.map((e) => ({ ...e, vidaActual: e.vida }))

	// Inicializar la visualización de los Pokémon
	renderPokemon(copiaP1, 'pokemon-list-player1')
	renderPokemon(copiaP2, 'pokemon-list-player2')
	console.log('FIN')
}

// Generar los Pokémon en el HTML
function renderPokemon(playerData, containerId) {
	const container = document.getElementById(containerId)
	container.innerHTML = ''

	playerData.forEach((pokemon, index) => {
		container.innerHTML += `
            <div class="pokemon-item">
                <img id="img-${containerId}-${index}" src="${pokemon.imagen}" alt="${pokemon.nombre}" onclick="selectPokemon(${containerId === 'pokemon-list-player1' ? 1 : 2}, ${index})">
                <p>${pokemon.nombre}</p>
                <p class="pokemon-life" id="vida-${containerId}-${index}">Vida: ${pokemon.vidaActual}</p>
            </div>
        `
	})
}

let activePokemonP1 = null // Pokémon seleccionado por Jugador 1
let activePokemonP2 = null // Pokémon seleccionado por Jugador 2

// Inicializar la visualización de los Pokémon
renderPokemon(copiaP1, 'pokemon-list-player1')
renderPokemon(copiaP2, 'pokemon-list-player2')

// Seleccionar Pokémon y mostrarlos activos
function selectPokemon(player, pokemonIndex) {
	const pokemonData =
		player === 1 ? copiaP1[pokemonIndex] : copiaP2[pokemonIndex]

	if (player === 1) {
		activePokemonP1 = pokemonData
		document.getElementById('active-pokemon1').innerHTML = `
            <img src="${pokemonData.imagen}" alt="${pokemonData.nombre}">
            <p><strong>${pokemonData.nombre}</strong> (${pokemonData.tipo})</p>
            <p>Fuerza: ${pokemonData.fuerza}</p>
            <p>Vida Actual: ${pokemonData.vidaActual}/${pokemonData.vida}</p>
        `
	} else {
		activePokemonP2 = pokemonData
		document.getElementById('active-pokemon2').innerHTML = `
            <img src="${pokemonData.imagen}" alt="${pokemonData.nombre}">
            <p><strong>${pokemonData.nombre}</strong> (${pokemonData.tipo})</p>
            <p>Fuerza: ${pokemonData.fuerza}</p>
            <p>Vida Actual: ${pokemonData.vidaActual}/${pokemonData.vida}</p>
        `
	}

	document.getElementById('log').innerHTML +=
		`<p>Jugador ${player} ha seleccionado a ${pokemonData.nombre}.</p>`
}

// Función para iniciar combate
function combat() {
	if (activePokemonP1 && activePokemonP2) {
		// Verificar si ambos Pokémon pueden pelear
		if (activePokemonP1.vidaActual <= 0 || activePokemonP2.vidaActual <= 0) {
			document.getElementById('log').value +=
				`\nUno de los Pokémon no puede combatir. Elige otros Pokémon.`
			return
		}

		// Jugador 1 ataca a Jugador 2
		const ataqueP1 = Math.floor(Math.random() * activePokemonP1.fuerza)
		activePokemonP2.vidaActual = Math.max(
			0,
			activePokemonP2.vidaActual - ataqueP1,
		)

		// Jugador 2 ataca a Jugador 1
		const ataqueP2 = Math.floor(Math.random() * activePokemonP2.fuerza)
		activePokemonP1.vidaActual = Math.max(
			0,
			activePokemonP1.vidaActual - ataqueP2,
		)

		// Log del combate
		document.getElementById('log').value +=
			`\n${activePokemonP1.nombre} ataca con ${ataqueP1} puntos de daño.`
		document.getElementById('log').value +=
			`\n${activePokemonP2.nombre} ataca con ${ataqueP2} puntos de daño.`

		// Actualizamos la vida mostrada
		updateVida()

		// Verificar si algún Pokémon ha sido derrotado y aplicar clase 'dead-pokemon'
		if (activePokemonP1.vidaActual <= 0) {
			document.getElementById('log').value +=
				`\n${activePokemonP1.nombre} ha sido derrotado.`
			// Añadir clase 'dead-pokemon' para el Pokémon de Jugador 1
			const indexP1 = copiaP1.findIndex(
				(p) => p.nombre === activePokemonP1.nombre,
			)
			if (indexP1 !== -1) {
				document
					.getElementById(`img-pokemon-list-player1-${indexP1}`)
					.classList.add('dead-pokemon')
			}
		}

		if (activePokemonP2.vidaActual <= 0) {
			document.getElementById('log').value +=
				`\n${activePokemonP2.nombre} ha sido derrotado.`
			// Añadir clase 'dead-pokemon' para el Pokémon de Jugador 2
			const indexP2 = copiaP2.findIndex(
				(p) => p.nombre === activePokemonP2.nombre,
			)
			if (indexP2 !== -1) {
				document
					.getElementById(`img-pokemon-list-player2-${indexP2}`)
					.classList.add('dead-pokemon')
			}
		}

		// Verificar si los jugadores tienen Pokémon disponibles
		checkDefeat()
	} else {
		document.getElementById('log').value +=
			`\nAmbos jugadores deben seleccionar un Pokémon para combatir.`
	}
}

// Función para actualizar la vida en pantalla
function updateVida() {
	if (activePokemonP1) {
		// Encontrar el índice del Pokémon de Jugador 1
		const indexP1 = copiaP1.findIndex(
			(p) => p.nombre === activePokemonP1.nombre,
		)
		if (indexP1 !== -1) {
			// Actualizar la vida en la lista de Pokémon del Jugador 1
			document.getElementById(
				`vida-pokemon-list-player1-${indexP1}`,
			).innerHTML =
				`Vida: ${activePokemonP1.vidaActual}/${activePokemonP1.vida}`

			// Actualizar la vida en la vista ampliada del Pokémon activo de Jugador 1
			document.getElementById('active-pokemon1').innerHTML = `
                <img src="${activePokemonP1.imagen}" alt="${activePokemonP1.nombre}">
                <p><strong>${activePokemonP1.nombre}</strong> (${activePokemonP1.tipo})</p>
                <p>Fuerza: ${activePokemonP1.fuerza}</p>
                <p>Vida Actual: ${activePokemonP1.vidaActual}/${activePokemonP1.vida}</p>
            `
		}
	}

	if (activePokemonP2) {
		// Encontrar el índice del Pokémon de Jugador 2
		const indexP2 = copiaP2.findIndex(
			(p) => p.nombre === activePokemonP2.nombre,
		)
		if (indexP2 !== -1) {
			// Actualizar la vida en la lista de Pokémon del Jugador 2
			document.getElementById(
				`vida-pokemon-list-player2-${indexP2}`,
			).innerHTML =
				`Vida: ${activePokemonP2.vidaActual}/${activePokemonP2.vida}`

			// Actualizar la vida en la vista ampliada del Pokémon activo de Jugador 2
			document.getElementById('active-pokemon2').innerHTML = `
                <img src="${activePokemonP2.imagen}" alt="${activePokemonP2.nombre}">
                <p><strong>${activePokemonP2.nombre}</strong> (${activePokemonP2.tipo})</p>
                <p>Fuerza: ${activePokemonP2.fuerza}</p>
                <p>Vida Actual: ${activePokemonP2.vidaActual}/${activePokemonP2.vida}</p>
            `
		}
	}
}

function checkDefeat() {
	const allPokemonDeadP1 = copiaP1.every((pokemon) => pokemon.vidaActual <= 0)
	const allPokemonDeadP2 = copiaP2.every((pokemon) => pokemon.vidaActual <= 0)
	const login = async (email, password) => {
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

			// Check if login was successful (modify according to your API's response)
			if (response.ok) {
				if (data.access_token) {
					return {
						success: true,
						message: 'Login successful!',
						token: data.access_token,
					}
				} else {
					return { success: false, message: 'Invalid credentials.' }
				}
			} else {
				// Handle different types of errors
				return {
					success: false,
					message: data.error_description || 'Error logging in.',
				}
			}
		} catch (err) {
			console.error('Error logging in:', err)
			return {
				success: false,
				message: 'An error occurred. Please try again later.',
			}
		}
	}
	const datos = login('ldanicp1998@gmail.com', '123456789')
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

	if (allPokemonDeadP1) {
		document.getElementById('log').value += `\n¡Jugador 2 ha ganado el combate!`
		disableCombatButtons()
		displayVictoryDefeat(2) // Jugador 2 gana
		copiaP2.forEach((pokemon) => {
			actualizarPokemon(pokemon.vidaActual, pokemon.nombre, datos.token)
		})
	}

	if (allPokemonDeadP2) {
		document.getElementById('log').value += `\n¡Jugador 1 ha ganado el combate!`
		disableCombatButtons()
		displayVictoryDefeat(1) // Jugador 1 gana
		copiaP1.forEach((pokemon) => {
			actualizarPokemon(pokemon.vidaActual, pokemon.nombre, datos.token)
		})
	}
}

// Función para deshabilitar los botones de combate cuando alguien gana
function disableCombatButtons() {
	document.querySelector(".buttons button[onclick='combat()']").disabled = true
}

// Función para mostrar imágenes de victoria/derrota
function displayVictoryDefeat(winner) {
	if (winner === 1) {
		// Jugador 1 gana, Jugador 2 pierde
		document.getElementById('active-pokemon1').innerHTML = `
            <img src="./img/victoria.gif" alt="Jugador 1 ha ganado">
            <p><strong>¡Victoria!</strong></p>
        `
		document.getElementById('active-pokemon2').innerHTML = `
            <img src="./img/derrota.gif" alt="Jugador 2 ha perdido">
            <p><strong>Derrota</strong></p>
        `
	} else {
		// Jugador 2 gana, Jugador 1 pierde
		document.getElementById('active-pokemon1').innerHTML = `
            <img src="./img/derrota.gif" alt="Jugador 1 ha perdido">
            <p><strong>Derrota</strong></p>
        `
		document.getElementById('active-pokemon2').innerHTML = `
            <img src="./img/victoria.gif" alt="Jugador 2 ha ganado">
            <p><strong>¡Victoria!</strong></p>
        `
	}
}

// Función para deshabilitar los botones de combate cuando alguien gana
function disableCombatButtons() {
	document.querySelector(".buttons button[onclick='combat()']").disabled = true
}

// Función para reiniciar la partida, activando los botones nuevamente
function reset() {
	document.getElementById('log').value = 'Log de combate:\n'
	document.getElementById('active-pokemon1').innerHTML = ''
	document.getElementById('active-pokemon2').innerHTML = ''
	copiaP1.forEach((pokemon) => (pokemon.vidaActual = pokemon.vida))
	copiaP2.forEach((pokemon) => (pokemon.vidaActual = pokemon.vida))
	renderPokemon(copiaP1, 'pokemon-list-player1')
	renderPokemon(copiaP2, 'pokemon-list-player2')
	activePokemonP1 = null
	activePokemonP2 = null
	document.querySelector(".buttons button[onclick='combat()']").disabled = false
}
cargar()

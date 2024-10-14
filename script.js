// Jugadores
const player1 = [
	{
		nombre: 'Pikachu',
		tipo: 'Eléctrico',
		fuerza: 30,
		vida: 100,
		imagen: './img/pika.jpg',
	},
	{
		nombre: 'Charizard',
		tipo: ['Fuego', 'Volador'],
		fuerza: 80,
		vida: 160,
		imagen: './img/chari.png',
	},
	{
		nombre: 'Blastoise',
		tipo: 'Agua',
		fuerza: 80,
		vida: 200,
		imagen: './img/blas.png',
	},
]
const copiaP1 = player1.map((e) => ({ ...e, vidaActual: e.vida }))

const player2 = [
	{
		nombre: 'Knegro',
		tipo: 'Siniestro',
		fuerza: 120,
		vida: 200,
		imagen: './img/knegro.jpeg',
	},
	{
		nombre: 'Metapod',
		tipo: 'Bicho',
		fuerza: 5,
		vida: 900,
		imagen: './img/meta.png',
	},
	{
		nombre: 'Magikarp',
		tipo: 'Agua',
		fuerza: 1,
		vida: 50,
		imagen: './img/magi.png',
	},
]
const copiaP2 = player2.map((e) => ({ ...e, vidaActual: e.vida }))

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
            <p>Vida Actual: ${pokemonData.vidaActual}</p>
        `
	} else {
		activePokemonP2 = pokemonData
		document.getElementById('active-pokemon2').innerHTML = `
            <img src="${pokemonData.imagen}" alt="${pokemonData.nombre}">
            <p><strong>${pokemonData.nombre}</strong> (${pokemonData.tipo})</p>
            <p>Fuerza: ${pokemonData.fuerza}</p>
            <p>Vida Actual: ${pokemonData.vidaActual}</p>
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
			).innerHTML = `Vida: ${activePokemonP1.vidaActual}`

			// Actualizar la vida en la vista ampliada del Pokémon activo de Jugador 1
			document.getElementById('active-pokemon1').innerHTML = `
                <img src="${activePokemonP1.imagen}" alt="${activePokemonP1.nombre}">
                <p><strong>${activePokemonP1.nombre}</strong> (${activePokemonP1.tipo})</p>
                <p>Fuerza: ${activePokemonP1.fuerza}</p>
                <p>Vida Actual: ${activePokemonP1.vidaActual}</p>
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
			).innerHTML = `Vida: ${activePokemonP2.vidaActual}`

			// Actualizar la vida en la vista ampliada del Pokémon activo de Jugador 2
			document.getElementById('active-pokemon2').innerHTML = `
                <img src="${activePokemonP2.imagen}" alt="${activePokemonP2.nombre}">
                <p><strong>${activePokemonP2.nombre}</strong> (${activePokemonP2.tipo})</p>
                <p>Fuerza: ${activePokemonP2.fuerza}</p>
                <p>Vida Actual: ${activePokemonP2.vidaActual}</p>
            `
		}
	}
}

function checkDefeat() {
	const allPokemonDeadP1 = copiaP1.every((pokemon) => pokemon.vidaActual <= 0)
	const allPokemonDeadP2 = copiaP2.every((pokemon) => pokemon.vidaActual <= 0)

	if (allPokemonDeadP1) {
		document.getElementById('log').value += `\n¡Jugador 2 ha ganado el combate!`
		disableCombatButtons()
		displayVictoryDefeat(2) // Jugador 2 gana
	}

	if (allPokemonDeadP2) {
		document.getElementById('log').value += `\n¡Jugador 1 ha ganado el combate!`
		disableCombatButtons()
		displayVictoryDefeat(1) // Jugador 1 gana
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

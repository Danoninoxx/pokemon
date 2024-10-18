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

async function cargar(num) {
	console.log('INICIO')
	const response = await fetch(
		'https://zudncegglweafofipksu.supabase.co/rest/v1/pokemon?select=*',
		options,
	)
	const data = await response.json()
	data.filter((e) => e.player === num).forEach((e) => console.log(e))

	console.log('FIN')
}

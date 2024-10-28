// login.js

// Function to log in
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

// Form submission handling
document
	.getElementById('loginForm')
	.addEventListener('submit', async (event) => {
		event.preventDefault() // Prevent the form from submitting the default way

		const email = document.getElementById('username').value
		const password = document.getElementById('password').value
		const messageElement = document.getElementById('message')

		// Clear any previous messages
		messageElement.textContent = ''

		// Call the login function
		const result = await login(email, password)

		// Show a message based on the result
		if (result.success) {
			messageElement.style.color = 'green'
			messageElement.textContent = result.message

			// Redirect to index.html after 1 second
			setTimeout(() => {
				window.location.href = 'index.html'
			}, 1000) // Redirect after 1 second to give feedback
		} else {
			messageElement.style.color = 'red'
			messageElement.textContent = result.message
		}
	})

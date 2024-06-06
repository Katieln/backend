


document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginResp = document.querySelector('.loginResp');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                loginResp.innerHTML = `<p>${result.message}</p>`;
            } else {
                loginResp.innerHTML = `<p>${result.error}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            loginResp.innerHTML = `<p>Error al conectar con el servidor</p>`;
        }
    });
});

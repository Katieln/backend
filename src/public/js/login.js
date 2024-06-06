document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessageElement = document.getElementById('error-message');

  try {
      const response = await fetch('/api/user/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      if (response.ok) {
          const userData = await response.json();
          // Limpiar cualquier mensaje de error previo
          errorMessageElement.textContent = '';
          // Redireccionar a la misma página para actualizar la vista
          window.location.reload();
      } else {
          const errorData = await response.json();
          errorMessageElement.textContent = `Error: ${errorData.error}`;
      }
  } catch (error) {
      console.error('Error:', error);
      errorMessageElement.textContent = 'Error al iniciar sesión';
  }
});

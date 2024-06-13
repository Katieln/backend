
  ///******* autenticacion *********///

  async function checkAuthentication() {
    try {
      const response = await fetch('/api/auth/check-auth');
      const data = await response.json();
      return data.isAuthenticated;
    } catch {
      return false;
    }
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
      const messageContainer = document.getElementById('messageContainer');
      messageContainer.textContent = 'No estas conectado! debes ingresar para agregar productos al cart';
      return;
    }
    addBuyButtonListeners();
  });

  // ******* mostrar usuario ****** //


  document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
  
    logoutButton.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'GET',
          credentials: 'include' // Incluye cookies con la solicitud
        });
  
        if (response.ok) {
          // Recarga la página actual
          window.location.reload();
        } else {
          console.error('Error during logout');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    });
  });
  

  document.addEventListener('DOMContentLoaded', () => {
    const githubButton = document.getElementById('githubButton');
  
    githubButton.addEventListener('click', () => {
      // Redirige al usuario a la URL de autenticación de GitHub
      window.location.href = '/api/auth/github';
    });
  });
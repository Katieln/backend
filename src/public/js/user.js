
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


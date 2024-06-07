
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
      messageContainer.textContent = 'Debe estar autenticado para agregar productos al carrito';
      return;
    }
    addBuyButtonListeners();
  });
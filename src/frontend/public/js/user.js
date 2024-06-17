
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/user/profile', {
      method: 'GET',
      credentials: 'include' // Incluye cookies con la solicitud
  })
  .then(response => {
      if (!response.ok) {
          const profileContainer = document.getElementById('profile');
      profileContainer.innerHTML =
      `<div class="userConnected"> 
         <h6> Usuario No conectado </h6>
      </div>`;
      }
      return response.json();
  })
  .then(data => {

      cartId = data.cart.id;
      // Renderizar los datos del perfil del usuario
      const profileContainer = document.getElementById('profile');
      profileContainer.innerHTML = `
      <div class="userConnected"> 
         <h6>* Username: ${data.profile.username} _ ${data.profile.role} _ ${data.profile.method}  </h6>
         <h6> * Email: ${data.profile.email} </h6>

      </div>`;})})
 
 
 
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

  // ******* mostrar usuario no conectado logout ****** //


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
  
  // ******* mostrar usuario conectado github ****** //

  document.addEventListener('DOMContentLoaded', () => {
    const githubButton = document.getElementById('githubButton');
  
    githubButton.addEventListener('click', () => {
      // Redirige al usuario a la URL de autenticación de GitHub
      window.location.href = '/api/auth/github';
    });
  });
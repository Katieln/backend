
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

  // Obtener el footer
const footer = document.getElementById('footer');

// Función para obtener el email del usuario conectado

// function getUserEmail() {
//   fetch('/api/auth/user')
//     .then(response => response.json())
//     .then(data => {
//       if (data.user) {
//         const userEmail = data.user.email;
//         // Mostrar el email en el footer
//         footer.textContent = `Usuario conectado: ${userEmail}`;
//       } else {
//         footer.textContent = 'Usuario no conectado';
//       }
//     })
//     .catch(error => {
//       console.error('Error al obtener el usuario conectado:', error);
//       footer.textContent = 'Error al obtener el usuario conectado';
//     });
// }

// // Llamar a la función al cargar la página
// getUserEmail();

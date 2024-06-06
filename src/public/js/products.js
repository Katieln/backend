///************************* Mostrar productos pantalla *************************///

document.addEventListener('DOMContentLoaded', function() {
    const boxprods = document.getElementById('misprods');
  
    async function fetchProducts() {
      try {
        const response = await fetch('/api/prods/allPr');
        const data = await response.json();
        showprods(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  
    function showprods(listProds) {
      listProds.forEach(prod => {
        boxprods.innerHTML += `
          <div class="card col-md-4" style="width: 15rem; margin: 10px;">
            <img src="${prod.image}" class="card-img-top" alt="${prod.title}" />
            <div class="card-body">
              <h5 class="card-title text-center">${prod.title.toUpperCase()}</h5>
              <p class="card-text">${prod.description}</p>
              <p class="card-text">Price: $${prod.price}</p>
              <p class="card-text">Category: ${prod.category}</p>
              <button data-product-id="${prod._id}" class="btn btn-primary comprar">Comprar</button>
            </div>
          </div>
        `;
      });
  
      addBuyButtonListeners();
    }
  
///************************* autenticacion *************************///

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
    
///************************* Boton comprar *************************///

    function addBuyButtonListeners() {
      document.querySelectorAll('.comprar').forEach(button => {
        button.addEventListener('click', async () => {
          const productId = button.getAttribute('data-product-id');
    
          try {
            const response = await fetch('/api/cart/add-to-cart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ productId })
            });
    
            const messageContainer = document.getElementById('messageContainer');
            if (response.ok) {
              messageContainer.textContent = 'Producto agregado correctamente al carrito';
            } else {
              const errorData = await response.json();
              messageContainer.textContent = `Error: ${errorData.error}`;
            }
          } catch (error) {
            console.error('Error:', error);
            messageContainer.textContent = 'Error al agregar el producto al carrito';
          }
        });
      });
    }
    
  
    // function addBuyButtonListeners() {
    //   document.querySelectorAll('.comprar').forEach(button => {
    //     button.addEventListener('click', async () => {
    //       const productId = button.getAttribute('data-product-id');
    
    //       try {
    //         const response = await fetch('/api/cart/add-to-cart', {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json'
    //           },
    //           body: JSON.stringify({ productId })
    //         });
    
    //         const messageContainer = document.getElementById('messageContainer');
    //         if (response.ok) {
    //           messageContainer.textContent = 'Producto agregado correctamente al carrito';
    //         } else {
    //           const errorData = await response.json();
    //           messageContainer.textContent = `Error: ${errorData.error}`;
    //         }
    //       } catch (error) {
    //         console.error('Error:', error);
    //         messageContainer.textContent = 'Error al agregar el producto al carrito';
    //       }
    //     });
    //   });
    // }
    
    //********************************************//

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
          errorMessageElement.textContent = '';
          document.getElementById('userId').value = userData.user._id;
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
  

  
    // Mostrar datos del usuario si está almacenado en el almacenamiento local
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      const userContainer = document.createElement('div');
      userContainer.classList.add('mt-4');
      userContainer.innerHTML = `
        <h2>Usuario Conectado</h2>
        <p><strong>Email:</strong> ${storedUser.email}</p>
      `;
      document.querySelector('.UserConnect').appendChild(userContainer);
    }
  
    fetchProducts();
  });
  
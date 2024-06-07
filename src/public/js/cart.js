document.addEventListener('DOMContentLoaded', () => {
  // Supongamos que obtienes el userId de alguna manera, por ejemplo, de una variable global
  const userId = req.user._id; // Reemplaza esto con la forma en que obtienes el userId en tu aplicación

  // La URL base a la que quieres añadir el userId
  const baseUrl = 'http://localhost:8080/api/cart/';

  // El enlace en el que quieres añadir el userId
  const dynamicLink = document.getElementById('dynamicLink');

  // Modifica el href del enlace para incluir el userId
  dynamicLink.href = `${baseUrl}/${userId}`;
});

//******** renderizar products del cart *********//

document.addEventListener('DOMContentLoaded', function() {
  const boxprods = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');
  const userId = '66610197992f66dd423a1a8e' ; // Reemplaza esto con la forma en que obtienes el userId en tu aplicación

  async function fetchCart() {
      try {
          const response = await fetch(`/api/cart/ByUser/${userId}`);
          const data = await response.json();
          showCart(data);
      } catch (error) {
          console.error('Error fetching cart:', error);
      }
  }

  function showCart(cartData) {
      boxprods.innerHTML = '';
      cartData.products.forEach(prod => {
          boxprods.innerHTML += `
              <div class="card col-md-4" style="width: 15rem; margin: 10px;">
                  <img src="${prod.image} class="card-img-top" alt="${prod.product}" />
                  <div class="card-body">
                      <h5 class="card-title text-center">${prod.product.toUpperCase()}</h5>
                      <p class="card-text">Cantidad: ${prod.quantity}</p>
                      <p class="card-text">Precio unitario: $${prod.price}</p>
                      <p class="card-text">Precio total: $${prod.totalPrice}</p>
                  </div>
              </div>
          `;
      });

      cartTotalElement.textContent = cartData.total.toFixed(2);
  }

  fetchCart();
});

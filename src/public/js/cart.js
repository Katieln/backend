document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/user/data', {
        method: 'GET',
        credentials: 'include' // Incluye cookies con la solicitud
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('User Profile:', data.profile);
        console.log('User Cart:', data.cart);
        // Aquí puedes actualizar la UI con la información del perfil y el carrito
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});


//******** renderizar products del cart *********//

document.addEventListener('DOMContentLoaded', function() {
  const boxprods = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');
  const userId = req.user.id;

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

// public/js/cart.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include' // Incluye cookies con la solicitud
    })
    .then(response => response.json())
    .then(data => {
        // Renderizar los datos del perfil del usuario
        const profileContainer = document.getElementById('profile');
        profileContainer.innerHTML = `
        <div class="userConnected"> 
           <p> * Username: ${data.profile.username} // ${data.profile.method} </p>
            <p> * Email: ${data.profile.email} </p>
        </div>`;

         // Renderizar los productos del carrito
         const prodscartContainer = document.getElementById('prodscart');
         prodscartContainer.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas tarjetas
 
        data.cart.items.forEach(item => {
            const productCard = document.createElement('div');
            productCard.classList.add('cart-card');
            productCard.innerHTML = `

            <div class=" cart-card">
              <div> 
                 <img src="${item.product.image}" class="card-img-top" alt="${item.product.title}" />
              </div>
                 <div class= "body-card-cart">
                    <h5 class="card-title">${item.product.title}</h5>
                    <p class="card-text">Cantidad: ${item.quantity}</p>
                    <p class="card-text">Precio Unidad: $ ${item.price}</p>

                    <h6 class="card-text">Precio Total: $ ${item.price * item.quantity}</h6>
                     </div>
                     <div class="botones">

                     <button class="btn add" data-product-id="${item.product._id}">+</button>

                     <button class="btn delete" data-product-id="${item.product._id}">-</button>
                     </div>
                </div>
            `;
            prodscartContainer.appendChild(productCard);
        });

        // Añadir eventos a los botones
        document.querySelectorAll('.btn-increase').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-product-id');
                updateCartQuantity(productId, 1);
            });
        });

        document.querySelectorAll('.btn-decrease').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-product-id');
                updateCartQuantity(productId, -1);
            });
        });
    })
    .catch(error => console.error('Error al obtener los datos del perfil:', error));
});

function updateCartQuantity(productId, change) {
    fetch('/api/cart/update-quantity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, change }),
        credentials: 'include' // Incluye cookies con la solicitud
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload(); // Recargar la página para ver los cambios
        } else {
            console.error('Error al actualizar la cantidad:', data.error);
        }
    })
    .catch(error => console.error('Error al actualizar la cantidad:', error));
}
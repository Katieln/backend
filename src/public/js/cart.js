// public/js/cart.js

// *** Obtener datos y cart del usuario autenticado *** //

// public/js/cart.js

// *** Obtener datos y cart del usuario autenticado *** //

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
           <h6>* Username: ${data.profile.username} // ${data.profile.method} </h6>
           <h6> * Email: ${data.profile.email} </h6>
        </div>`;

        // Renderizar los productos del carrito
        const prodscartContainer = document.getElementById('prodscart');
        prodscartContainer.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas tarjetas

        data.cart.items.forEach(item => {
            const productCard = document.createElement('div');
            productCard.classList.add('cart-card');
            productCard.innerHTML = `
                <div class="cart-card">
                    <div> 
                        <img src="${item.product.image}" class="card-img-top" alt="${item.product.title}" />
                    </div>
                    <div class="body-card-cart">
                        <h5 class="card-title">${item.product.title}</h5>
                        <p class="card-text">Cantidad: ${item.quantity}</p>
                        <p class="card-text">Precio Unidad: $ ${item.price}</p>
                        <h6 class="card-text">Precio Total: $ ${item.price * item.quantity}</h6>
                    </div>
                    <div class="botones">
                        <button class="btn btn-increase" data-product-id="${item.product._id}">+</button>
                        <button class="btn btn-decrease" data-product-id="${item.product._id}">-</button>
                    </div>
                </div>
            `;
            prodscartContainer.appendChild(productCard);
        });

        // Añadir eventos a los botones
        addQuantityButtonListeners();
    })
    .catch(error => console.error('Error al obtener los datos del perfil:', error));
});

function addQuantityButtonListeners() {
    document.querySelectorAll('.btn-increase').forEach(button => {
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
                window.location.reload(); // Recargar la página para ver los cambios
            } catch (error) {
                console.error('Error:', error);
                messageContainer.textContent = 'Error al agregar el producto al carrito';
            }
        });
    });

    document.querySelectorAll('.btn-decrease').forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-product-id');
            try {
                const response = await fetch('/api/cart/remove-from-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                });
                const messageContainer = document.getElementById('messageContainer');
                if (response.ok) {
                    messageContainer.textContent = 'Producto eliminado correctamente del carrito';
                } else {
                    const errorData = await response.json();
                    messageContainer.textContent = `Error: ${errorData.error}`;
                }
                window.location.reload(); // Recargar la página para ver los cambios
            } catch (error) {
                console.error('Error:', error);
                messageContainer.textContent = 'Error al eliminar el producto del carrito';
            }
        });
    });
}

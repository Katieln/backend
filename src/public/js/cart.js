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
            <p>Username: ${data.profile.username}</p>
            <p>Email: ${data.profile.email}</p>
            <p>Metodo de registro: ${data.profile.method}</p>
        `;

        // Renderizar los productos del carrito
        const prodscartContainer = document.getElementById('prodscart');
        data.cart.items.forEach(item => {
            const productCard = document.createElement('div');
            productCard.classList.add('card');
            productCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${item.product.title}</h5>
                    <p class="card-text">Quantity: ${item.quantity}</p>
                    <p class="card-text">Price: ${item.price}</p>
                    <p class="card-text">Total Price: ${item.price * item.quantity}</p>
                </div>
            `;
            prodscartContainer.appendChild(productCard);
        });
    })
    .catch(error => console.error('Error al obtener los datos del perfil:', error));
});

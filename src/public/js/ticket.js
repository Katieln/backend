// *** Obtener datos y cart del usuario autenticado *** //

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
        <div class="buyer"> 
           <h6>Username: ${data.profile.username} </h6>
           <h6>Email: ${data.profile.email} </h6>
        </div>`;
    


        // Renderizar los productos del ticket
        const prodscartContainer = document.getElementById('prodscart');
        prodscartContainer.innerHTML = ''; // 

        data.cart.items.forEach(item => {
            const productCard = document.createElement('div');
            productCard.classList.add('ticket-all');
            productCard.innerHTML = `
       
                    <div class="ticket">
                      <div> 
                        <h6 class="title-ticket">${item.quantity} - ${item.product.title}</h6>
                        </div>
                        <div> 
                        <p class="ticket-text">Precio ud: $ ${item.price}</p>
                        <p class="ticket-text">Stock total producto: $ ${item.product.stock}</p>
                         </div>
                      <div> 
                        <h6 class="ticket-text">Precio x ${item.quantity} unidades: $ ${item.price * item.quantity}</h6>
                        <h5> ${item.product.stock} = ${item.product.stock - item.quantity}  </h5>
                      </div>
                    </div>

                </div>
            `;
            prodscartContainer.appendChild(productCard);
        });
        const totalPrice = document.getElementById('totalPrice');
        totalPrice.innerHTML = ` <h4> Precio total: $${data.cart.total} </h4>`;})
    })

    document.addEventListener('DOMContentLoaded', function() {
        fetch('/api/ticket/get-address')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('addressContainer').innerText = `Tu producto será enviado a la siguiente dirección: ${data.address}`;
            } else {
                document.getElementById('addressContainer').innerText = 'Error al obtener la dirección.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('addressContainer').innerText = 'Error al obtener la dirección.';
        });
    })

//*******************************************************************************//


//*******************************************************************************//


//*******************************************************************************//


document.addEventListener('DOMContentLoaded', () => {
    // Crear el botón "Reducir Stock"
    const reducirStockButton = document.createElement('button');
    reducirStockButton.textContent = 'Reducir Stock';
    reducirStockButton.addEventListener('click', reducirStock);
    document.getElementById('reducirStock').appendChild(reducirStockButton);

    // Obtener los datos del perfil del usuario
    fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include' // Incluye cookies con la solicitud
    })
    .then(response => response.json())
    .then(data => {
        // Renderizar los datos del perfil del usuario
        const profileContainer = document.getElementById('profile');
        profileContainer.innerHTML = `
        <div class="buyer"> 
            <h6>Username: ${data.profile.username}</h6>
            <h6>Email: ${data.profile.email}</h6>
        </div>`;

        // Renderizar los productos del ticket
        const prodscartContainer = document.getElementById('prodscart');
        prodscartContainer.innerHTML = '';

        data.cart.items.forEach(item => {
            const productCard = document.createElement('div');
            productCard.classList.add('ticket-all');
            productCard.innerHTML = `
                <div class="ticket">
                    <div>
                        <h6 class="title-ticket">${item.quantity} - ${item.product.title}</h6>
                    </div>
                    <div>
                        <p class="ticket-text">Precio ud: $ ${item.price}</p>
                        <p class="ticket-text">Stock total producto: $ ${item.product.stock}</p>
                    </div>
                    <div>
                        <h6 class="ticket-text">Precio x ${item.quantity} unidades: $ ${item.price * item.quantity}</h6>
                        <h5 id="newStock-${item.product._id}"></h5>
                    </div>
                </div>
            `;
            prodscartContainer.appendChild(productCard);
        });

        const totalPrice = document.getElementById('totalPrice');
        totalPrice.innerHTML = `<h4>Precio total: $${data.cart.total}</h4>`;
    })
    .catch(error => console.error('Error al obtener los datos del perfil del usuario:', error));
});

function reducirStock() {
    // Obtener los datos del perfil del usuario
    fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include' // Incluye cookies con la solicitud
    })
    .then(response => response.json())
    .then(data => {
        // Crear una lista de actualizaciones para los productos
        const updates = data.cart.items.map(item => {
            const newStock = item.product.stock - item.quantity;
            return {
                productId: item.product._id,
                newStock: Math.max(newStock, 0) // Asegurarse de que el nuevo stock no sea menor que 0
            };
        });


        // Enviar la solicitud para actualizar el stock de los productos
        fetch('/api/stock', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ updates }) // Enviar las actualizaciones al servidor
        })
        .then(response => {
            if (response.ok) {
                console.log('Stock de los productos actualizado correctamente');
                // Recargar la página para mostrar los cambios en el stock
                window.location.reload();
            } else {
                console.error('Error al actualizar el stock de los productos');
            }
        })
        .catch(error => console.error('Error al actualizar el stock de los productos:', error));
    })
    .catch(error => console.error('Error al obtener los datos del perfil del usuario:', error));
}

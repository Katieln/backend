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
        
        // Crear el objeto de productos para el ticket
        const products = data.cart.items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
            total: item.price
        }));

        // Calcular el precio total del ticket
        const totalPrice = data.cart.total;

        // Crear un nuevo documento de Ticket
        const newTicket = new Ticket({
            userId: data.profile._id,
            products: products,
            totalPrice: totalPrice
        });

        // Guardar el ticket en la base de datos
        newTicket.save()
            .then(ticket => {
                console.log('Ticket guardado correctamente:', ticket);

                // Mostrar los datos del ticket en el DOM
                const ticketPrContainer = document.getElementById('ticketPr');
                ticketPrContainer.innerHTML = `
                    <div class="ticket">
                        <h4>Ticket</h4>
                        <p>Usuario: ${data.profile.username}</p>
                        <p>Email: ${data.profile.email}</p>
                        <ul>
                            ${data.cart.items.map(item => `
                                <li>
                                    <p>${item.quantity} x ${item.product.title}</p>
                                    <p>Precio: $${item.product.price}</p>
                                    <p>Total: $${item.price}</p>
                                </li>
                            `).join('')}
                        </ul>
                        <p>Total: $${data.cart.total}</p>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Error al guardar el ticket:', error);
            });
    })
    .catch(error => {
        console.error('Error al obtener la información del usuario:', error);
    });
});


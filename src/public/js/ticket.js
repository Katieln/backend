
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/ticket/show', {
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

        // Renderizar los tickets
        const ticketsContainer = document.getElementById('tickets');
        ticketsContainer.innerHTML = '';
        if (data.tickets && data.tickets.length > 0) {
            data.tickets.forEach(ticket => {
                const ticketHtml = `
                    <div class="ticket">
                        <h6>Ticket ID: ${ticket.ticketID}</h6>
                        <ul>
                            ${ticket.products.map(product => `
                                <li>
                                    <p>Producto: ${product.title}</p>
                                    <p>Cantidad: ${product.quantity}</p>
                                    <p>Precio: ${product.price}</p>
                                </li>
                            `).join('')}
                        </ul>
                        <p>Total: ${ticket.totalPrice}</p>
                    </div>
                `;
                ticketsContainer.innerHTML += ticketHtml;
            });
        } else {
            ticketsContainer.innerHTML = '<p>No se encontraron tickets.</p>';
        }
    })
    .catch(error => {
        console.error('Error al obtener los tickets:', error);
        alert('Error al obtener los tickets');
    });
});

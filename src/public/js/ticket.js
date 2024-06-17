document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/ticket/show', {
        method: 'GET',
        credentials: 'include' // Incluye cookies con la solicitud
    })
    .then(response => response.json())
    .then(data => {
        // Verifica si se encontraron tickets para el usuario
        if (data.ticket.length === 0) {
            const ticketContainer = document.getElementById('ticketContainer');
            ticketContainer.innerHTML = '<p>No se encontraron tickets para este usuario</p>';
        } else {
            // Renderiza los tickets en el DOM
            const ticketContainer = document.getElementById('ticketContainer');
            data.ticket.forEach(ticket => {
                const ticketElement = document.createElement('div');
                ticketElement.classList.add('ticket');

                const createdAt = new Date(ticket.createdAt).toLocaleString();

                // Construye el contenido del ticket
                const ticketInfo = `
                <div class="ticket">
                    <div class="ticketid">
                        <p>Created At: ${createdAt}</p>
                    <h3>Ticket ID: ${ticket._id}</h3>
                    <div class="ticketprods">
                    <ul >
                        ${ticket.products.map(product => `
                            <div class="infoprodsticket">
                            <li >
                                <div>
                                Product: ${product.productId.title}<br>
                                </div><div>
                                Quantity: ${product.quantity}<br>
                                </div><div>
                                Price: $${product.price}<br>
                                </div><div>
                                Total: $${product.total}
                                </div>
                 
                            </li>
                            </div>
                        `).join('')}
                    </ul>
                    <h5>Total Price: $${ticket.totalPrice}</h5>
                     <p>Email: ${ticket.email}</p>
                      <p>Dirección de envio: ${ticket.address}</p>
                  
                    </div>
                    
                    </div>
                `;

                ticketElement.innerHTML = ticketInfo;
                ticketContainer.appendChild(ticketElement);
            });
        }
    })
    .catch(error => {
        console.error('Error al obtener los tickets:', error);
     
    });
});

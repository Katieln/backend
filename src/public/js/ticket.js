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
                // Agrega el ID del ticket como un atributo de datos al contenedor del ticket
                ticketElement.dataset.ticketId = ticket._id;

                const createdAt = new Date(ticket.createdAt).toLocaleString();

                // Construye el contenido del ticket
                const ticketInfo = `
                    <div class="ticket">
                        <div class="ticketid">
                            <p>Created At: ${createdAt}</p>
                            <h3>Ticket ID: ${ticket._id}</h3>
                            <div class="ticketprods">
                                <ul>
                                    ${ticket.products.map(product => `
                                        <div class="infoprodsticket">
                                            <li>
                                                <div>
                                                    Product: ${product.productId.title}<br>
                                                </div>
                                                <div>
                                                    Quantity: ${product.quantity}<br>
                                                </div>
                                                <div>
                                                    Price: $${product.price}<br>
                                                </div>
                                                <div>
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
                    </div>
                `;
                
                ticketElement.innerHTML = ticketInfo;
                ticketContainer.appendChild(ticketElement);
            });

            // Agrega eventos a los botones "Enviar ticket email"
            document.querySelectorAll('.emailticket').forEach(button => {
                button.addEventListener('click', async () => {
                    try {
                        const ticketId = button.getAttribute('ticket-id');
                        const ticketEmail = document.querySelector(`[data-ticket-id="${ticketId}"] .ticketprods p:nth-of-type(6)`).textContent.split(':')[1].trim();
                        const emailUser = encodeURIComponent(ticketEmail);
                        
                        const result = await fetch(`/api/mail/sendTicket?emailUser=${emailUser}`, {
                            method: 'GET',
                            credentials: 'include' // Incluye cookies con la solicitud
                        });

                        if (!result.ok) {
                            throw new Error('Error al enviar el correo');
                        }

                        alert('Correo enviado con éxito');
                    } catch (error) {
                        console.error('Error al enviar el correo:', error);
                        alert('Error al enviar el correo');
                    }
                });
            });
        }
    })
    .catch(error => {
        console.error('Error al obtener los tickets:', error);
        alert('Error al obtener los tickets');
    });
});
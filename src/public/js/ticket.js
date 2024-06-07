// document.addEventListener('DOMContentLoaded', async () => {
//     const userId = 
//     try {
//         const response = await fetch(`/ticket/${userId}`);
//         const data = await response.json();

//         if (response.ok) {
//             const ticketContainer = document.getElementById('ticket');

//             const userInfo = `
//                 <div class="card mb-4">
//                     <div class="card-header">Información del Usuario</div>
//                     <div class="card-body">
//                         <p><strong>Nombre:</strong> ${data.user.name}</p>
//                         <p><strong>Email:</strong> ${data.user.email}</p>
//                     </div>
//                 </div>
//             `;
            
//             ticketContainer.innerHTML += userInfo;

//             data.products.forEach(product => {
//                 const productCard = `
//                     <div class="card mb-3">
//                         <div class="row no-gutters">
//                             <div class="col-md-4">
//                                 <img src="${product.image}" class="card-img" alt="${product.product}">
//                             </div>
//                             <div class="col-md-8">
//                                 <div class="card-body">
//                                     <h5 class="card-title">${product.product}</h5>
//                                     <p class="card-text"><strong>Precio:</strong> $${product.price}</p>
//                                     <p class="card-text"><strong>Cantidad:</strong> ${product.quantity}</p>
//                                     <p class="card-text"><strong>Total:</strong> $${product.totalPrice}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 `;
//                 ticketContainer.innerHTML += productCard;
//             });

//             const cartTotal = `
//                 <div class="card mt-4">
//                     <div class="card-body">
//                         <h5 class="card-title">Precio Total del Carrito</h5>
//                         <p class="card-text"><strong>Total:</strong> $${data.total}</p>
//                     </div>
//                 </div>
//             `;
            
//             ticketContainer.innerHTML += cartTotal;
//         } else {
//             ticketContainer.innerHTML = `<p>${data.msg}</p>`;
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });
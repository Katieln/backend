///************************* Mostrar productos pantalla *************************///

document.addEventListener('DOMContentLoaded', function() {
    const boxprods = document.getElementById('misprods');
  
    async function fetchProducts() {
      try {
        const response = await fetch('/api/prods/allPr');
        const data = await response.json();
        showprods(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  
    function showprods(listProds) {
      listProds.forEach(prod => {
        boxprods.innerHTML += `
          <div class="card col-md-4" style="width: 15rem; margin: 10px;">
            <img src="${prod.image}" class="card-img-top" alt="${prod.title}" />
            <div class="card-body">
              <h5 class="card-title text-center">${prod.title.toUpperCase()}</h5>
              <p class="card-text">${prod.description}</p>
              <p class="card-text">Price: $${prod.price}</p>
              <p class="card-text">Category: ${prod.category}</p>
              <button data-product-id="${prod._id}" class="btn btn-primary comprar">Comprar</button>
            </div>
          </div>
        `;
      });
  
      addBuyButtonListeners();
    }
  
    
///*********** Boton comprar ************///

    function addBuyButtonListeners() {
      document.querySelectorAll('.comprar').forEach(button => {
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
          } catch (error) {
            console.error('Error:', error);
            messageContainer.textContent = 'Error al agregar el producto al carrito';
          }
        });
      });
    }
    
  

  
    // // Mostrar datos del usuario en pantalla
    // const storedUser = JSON.parse(localStorage.getItem('user'));
    // if (storedUser) {
    //   const userContainer = document.createElement('div');
    //   userContainer.classList.add('mt-4');
    //   userContainer.innerHTML = `
    //     <h2>Usuario Conectado</h2>
    //     <p><strong>Email:</strong> ${storedUser.email}</p>
    //   `;
    //   document.querySelector('.UserConnect').appendChild(userContainer);
    // }
  
    fetchProducts();
  });
  
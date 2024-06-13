///********* Mostrar productos pantalla *********///

document.addEventListener('DOMContentLoaded', function() {
    const boxprods = document.getElementById('misprods');
    const categorySelect = document.getElementById('categorySelect');
    const messageContainer = document.getElementById('messageContainer');

    categorySelect.addEventListener('change', fetchProducts);
  
    async function fetchProducts() {

      const selectedCategory = categorySelect.value;
      let url = '/api/prods/allPr';
      
      if (selectedCategory) {
          url += `?category=${selectedCategory}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        showprods(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  
    function showprods(listProds) {
      boxprods.innerHTML = '',
      listProds.forEach(prod => {
        boxprods.innerHTML += `
          <div class="product-card col-md-4" style="width: 15rem; margin: 10px;">
            <img src="${prod.image}" class="card-img-top" alt="${prod.title}" />
            <h5 class="card-title text-center">${prod.title.toUpperCase()}</h5>
            <div class="product-card-body">
             <p class="product-card-text">${prod.description}</p>
              <p class="product-card-text">Price: $${prod.price}</p>
              <p class="product-card-text">Category: ${prod.category}</p>
              <p class="product-card-text">Stock: ${prod.stock}</p>
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
    
  
  
    fetchProducts();
  });
  
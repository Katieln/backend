document.addEventListener('DOMContentLoaded', function() {
    const boxprods = document.getElementById('misprods');
  
    async function fetchProducts() {
      try {
        const response = await fetch('/api/cart/');
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
    }
      fetchProducts();

})
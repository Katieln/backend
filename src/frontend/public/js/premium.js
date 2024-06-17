document.addEventListener("DOMContentLoaded", () => {
    const boxprods = document.getElementById('prodspremium');

    // Función para realizar la solicitud y obtener los productos
    async function fetchAndRenderProducts() {
        const url = '/api/prods/allPr'; // Ajusta esta ruta si es necesario
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            showprods(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            boxprods.innerHTML = '<p class="text-danger">Error loading products. Please try again later.</p>';
        }
    }

    // Función para renderizar los productos
    function showprods(listProds) {
        boxprods.innerHTML = '';
        listProds.forEach(prod => {
            // Calcular el precio con descuento del 20%
            const discountedPrice = prod.price * 0.8; // Descuento del 20%
    
            boxprods.innerHTML += `
        
                <div class="product-card col-md-4" >
                    <img src="${prod.image}" class="card-img-top" alt="${prod.title}" />
                    <h5 class="card-title text-center">${prod.title.toUpperCase()}</h5>
                    <div class="product-card-body">
                        <p class="product-card-text">Stock: ${prod.stock}</p>
                        <p class="product-card-text">Original Price: <span class="original-price">$${prod.price}</span></p>
                        <h6 class="product-card-text pricepremium">$${discountedPrice.toFixed(2)}
                        Price Premium (20% off)</h6>
                
                    </div>

             
            `;
        });
    }

    // Llamar a la función para obtener y renderizar los productos al cargar la página
    fetchAndRenderProducts();
});

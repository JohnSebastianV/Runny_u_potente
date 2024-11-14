const restaurants = [
    { id: 1, name: "Donde tavo", description: "La más barata" },
    { id: 2, name: "Sr.Gourmet", description: "Variedad de carta" },
    { id: 3, name: "Dogger", description: "Los perros de oro" },
    { id: 4, name: "Sato", description: "Típico y sabroso" },
    { id: 5, name: "Caffeto", description: "Café y postres artesanales" },

];

const menus = {
    1: [
        { id: 1, name: "Hamburguesa Clásica", price: 10000.0, image: "images/hamguesasimple.png" },
        { id: 2, name: "Badeja paisa", price: 15.000, image: "images/bandejapaisa.png" },
        { id: 3, name: "Carne asada", price: 19.000, image: "images/carneasada.png" },
    ],
    2: [
        { id: 4, name: "Papas paisas", price: 14.900, image: "images/papaspaisas.png" },
        { id: 5, name: "Lasaña", price: 15.990, image: "images/lasaña.png" },
        { id: 6, name: "Enchiladas", price: 13.99, image: "images/enchiladas.png" },
    ],
    3: [
        { id: 7, name: "Perro en combo", price: 18.99, image: "images/perroencombo.png" },
        { id: 8, name: "Brownie", price: 16.99, image: "images/brownie.png" },
        { id: 9, name: "Perro Callejero", price: 12.99, image: "images/perrocallegero.png" },
    ],
    4: [
        { id: 10, name: "Ramen", price: 14.99, image: "images/ramen.png" },
        { id: 11, name: "Sopa de verduras", price: 7.99, image: "images/sopadeverduras.png" },
        { id: 12, name: "Ajiaco", price: 2.99, image: "images/ajiaco.png" },
    ],
    5: [
        { id: 13, name: "Café Americano", price: 3.99, image: "images/cafe.png" },
        { id: 14, name: "Cheesecake", price: 5.99, image: "images/torta.png" },
        { id: 15, name: "Capuchino", price: 4.99, image: "images/capuchino.png" },
    ],
};

function initApp() {
    showSection("inicio");
    loadRestaurants();
    updateUI(JSON.parse(localStorage.getItem("loggedInUser")));
}

function showSection(sectionId) {
    console.log(`Intentando mostrar la sección: ${sectionId}`);
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });

    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = "block";
    } else {
        console.error(`No se encontró la sección con id: ${sectionId}`);
    }
}

function loadFullScreenImage(imageUrl) {
    // Cambiar a la sección fullscreen-image
    showSection('fullscreen-image');
    
    // Seleccionar el contenedor de la imagen en pantalla completa
    const imageContainer = document.getElementById('images/enconstruccion.png');
    
    // Limpiar cualquier imagen previa
    imageContainer.innerHTML = '';
    
    // Crear un elemento de imagen
    const fullScreenImage = document.createElement('images/enconstruccion.png');
    fullScreenImage.src = imageUrl;
    fullScreenImage.alt = 'Imagen a pantalla completa';
    fullScreenImage.style.width = '100%';  // Ajusta el tamaño de la imagen al 100% del contenedor
    fullScreenImage.style.height = '100vh';  // Hace que la imagen ocupe toda la altura de la ventana
    
    // Añadir la imagen al contenedor
    imageContainer.appendChild(fullScreenImage);
}


function loadRestaurants() {
    const restaurantList = document.getElementById("restaurant-list");
    restaurantList.innerHTML = "";
    restaurants.forEach(restaurant => {
        const restaurantElement = document.createElement("div");
        restaurantElement.innerHTML = `
            <h2>${restaurant.name}</h2>
            <p>${restaurant.description}</p>
            <button onclick="loadMenu(${restaurant.id})">Ver Menú</button>
        `;
        restaurantList.appendChild(restaurantElement);
    });
}

function loadMenu(restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const menuItems = menus[restaurantId];

    document.getElementById("restaurant-name").textContent = restaurant.name;

    const menuList = document.getElementById("menu-list");
    menuList.innerHTML = "";
    menuItems.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 150px; height: 150px; object-fit: cover;" />
            <h3>${item.name}</h3>
            <p>Precio: $${item.price.toFixed(2)}</p>
            <button onclick="addToCart(${restaurantId}, ${item.id}, '${item.name}', ${item.price})">
                Añadir al Carrito
            </button>
        `;
        menuList.appendChild(itemElement);
    });

    showSection("menu");
}


function addToCart(restaurantId, itemId, itemName, itemPrice) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("Debes iniciar sesión para añadir productos al carrito.");
        showSection("auth-section");
        return;
    }

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    const itemElement = document.createElement("div");
    itemElement.setAttribute("data-item-id", itemId);
    itemElement.classList.add("cart-item");
    itemElement.innerHTML = `
        <span>${itemName} - $${itemPrice.toFixed(2)}</span>
        <button onclick="removeFromCart(${itemId}, ${itemPrice})">Eliminar</button>
    `;
    cartItems.appendChild(itemElement);

    // Actualizar el total
    const currentTotal = parseFloat(cartTotal.textContent) || 0;
    cartTotal.textContent = (currentTotal + itemPrice).toFixed(2);

    // Actualizar el contador de carrito
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = parseInt(cartCount.textContent || "0") + 1;
}

function removeFromCart(itemId, itemPrice) {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    const itemElement = cartItems.querySelector(`[data-item-id="${itemId}"]`);
    if (itemElement) {
        cartItems.removeChild(itemElement);
    }

    const currentTotal = parseFloat(cartTotal.textContent) || 0;
    cartTotal.textContent = (currentTotal - itemPrice).toFixed(2);

    const currentCount = parseInt(cartCount.textContent || "0");
    cartCount.textContent = currentCount > 0 ? currentCount - 1 : 0;
}


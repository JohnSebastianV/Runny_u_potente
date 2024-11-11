const restaurants = [
    { id: 1, name: "Donde tavo", description: "La más barata" },
    { id: 2, name: "Sr.Gourmet", description: "Variedad de carta" },
    { id: 3, name: "Dogger", description: "Los perros de oro" },
    { id: 4, name: "Sato", description: "Típico y sabroso" },
    { id: 5, name: "Caffeto", description: "Café y postres artesanales" },

];

const menus = {
    1: [
        { id: 1, name: "Hamburguesa Clásica", price: 10000.0 },
        { id: 2, name: "Badeja paisa", price: 15.000 },
        { id: 3, name: "Carne asada", price: 19.000 },
    ],
    2: [
        { id: 4, name: "Papas paisas", price: 14.900 },
        { id: 5, name: "Lasaña", price: 15.990 },
        { id: 6, name: "Enchiladas", price: 13.99 },
    ],
    3: [
        { id: 7, name: "Perro en combo", price: 18.99 },
        { id: 8, name: "Brownie", price: 16.99 },
        { id: 9, name: "Perro Callejero", price: 12.99 },
    ],
    4: [
        { id: 10, name: "Ramen", price: 14.99 },
        { id: 11, name: "Sopa de verduras", price: 7.99 },
        { id: 12, name: "Ajiaco", price: 2.99 },
    ],
    5: [
        { id: 13, name: "Café Americano", price: 3.99 },
        { id: 14, name: "Cheesecake", price: 5.99 },
        { id: 15, name: "Capuchino", price: 4.99 },
    ],
};

function initApp() {
    showSection("inicio");
    loadRestaurants();
    updateUI(JSON.parse(localStorage.getItem("loggedInUser")));
}

function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
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


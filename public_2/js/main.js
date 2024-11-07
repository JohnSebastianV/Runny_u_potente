const restaurants = [
    { id: 1, name: "Donde tavo", description: "La más barata" },
    { id: 2, name: "Sr.Gourmet", description: "Variedad de carta" },
    { id: 3, name: "Dogger", description: "Los perros de oro" },
    { id: 4, name: "Sato", description: "Típico y sabroso" },
    { id: 5, name: "Caffeto", description: "Café y postres artesanales" },
    { id: 6, name: "Pimientos", description: "Las mejores pizzas" },
    { id: 7, name: "Donde juan", description: "Lo mejor para ti" },
    { id: 8, name: "Cafeteria coliseo", description: "Bocadillos rápidos y bebidas" },
    { id: 9, name: "Dary", description: "Todo rápido y delicioso" }
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
    6: [
        { id: 16, name: "Pizza mediterranea", price: 9.99 },
        { id: 17, name: "Pizza hawaiana", price: 18.99 },
        { id: 18, name: "Pizza de peperoni", price: 6.99 },
    ],
    7: [
        { id: 19, name: "Churrasco", price: 20.99 },
        { id: 20, name: "Tipico caleño", price: 3.99 },
        { id: 21, name: "Soncocho de pescado", price: 4.99 },
    ],
    8: [
        { id: 22, name: "Sándwich Mixto", price: 7.99 },
        { id: 23, name: "Jugos Naturales", price: 3.99 },
        { id: 24, name: "Galletas", price: 2.99 },
    ],
    9: [
        { id: 25, name: "Desyuno tipico", price: 5.99 },
        { id: 26, name: "Asado de carne o pollo", price: 4.99 },
        { id: 27, name: "Chuzo de Cerdo", price: 3.99 },
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


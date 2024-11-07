// cart.js
let cart = [];

function addToCart(item) {
    cart.push(item);
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <p>${item.name} - $${item.price.toFixed(2)}
            <button onclick="removeFromCart(${index})">Eliminar</button></p>
        `;
        cartItems.appendChild(itemElement);
        total += item.price;
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = total.toFixed(2);
}
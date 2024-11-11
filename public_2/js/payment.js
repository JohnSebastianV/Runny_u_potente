// Inicializa Stripe con tu clave pública
const stripe = Stripe('TU_CLAVE_PUBLICA_STRIPE');

document.getElementById('checkout-button').addEventListener('click', async () => {
    const cartTotal = document.getElementById('cart-total').innerText;
    const amount = parseFloat(cartTotal) * 100; // Convierte a centavos

    const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
    });

    const session = await response.json();

    // Redirecciona a Stripe para completar el pago
    const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
    });

    if (error) {
        console.error(error.message);
    }
});

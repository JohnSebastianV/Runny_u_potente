// payment.js
const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY');

document.getElementById('checkout-button').addEventListener('click', async () => {
    try {
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: cart }),
        });

        const session = await response.json();

        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            alert(result.error.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
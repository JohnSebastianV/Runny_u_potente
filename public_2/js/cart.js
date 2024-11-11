const express = require('express');
const Stripe = require('stripe');
const app = express();

// Clave secreta de Stripe
const stripe = Stripe('TU_CLAVE_SECRETA_DE_STRIPE');

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    const { items } = req.body;
    // Crea la sesión de pago con los datos del carrito
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name, // Aquí podrías reemplazarlo por el nombre del producto
                },
                unit_amount: item.price * 100, // El monto en centavos
            },
            quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: 'https://tusitio.com/success',
        cancel_url: 'https://tusitio.com/cancel',
    });

    res.json({ id: session.id });
});

app.listen(3000, () => console.log('Servidor en ejecución en el puerto 3000'));

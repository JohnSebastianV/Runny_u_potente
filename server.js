const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const stripe = require('stripe')('TU_CLAVE_SECRETA_STRIPE'); // Reemplaza con tu clave secreta de Stripe

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos (index.html, css, js, imágenes)
app.use(express.static(path.join(__dirname, 'public_2')));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public_2', 'index.html'));
});

// Ruta para obtener usuarios
app.get('/users.json', (req, res) => {
    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.json([]);
            }
            return res.status(500).send('Error al leer el archivo de usuarios');
        }
        res.json(JSON.parse(data || '[]'));
    });
});

// Ruta para guardar usuarios
app.post('/save', (req, res) => {
    const data = req.body;
    const emailPattern = /^[a-zA-Z0-9._-]+@soyudemedellin\.edu\.co$/;

    if (!emailPattern.test(data.email)) {
        return res.status(400).send('El correo debe ser de dominio @soyudemedellin.edu.co');
    }

    fs.readFile(USERS_FILE, 'utf8', (err, existingData) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Error al leer el archivo de usuarios');
        }

        const users = existingData ? JSON.parse(existingData) : [];
        const userExists = users.some(user => user.email === data.email);

        if (userExists) {
            return res.status(400).send('Este correo ya está registrado');
        }

        users.push(data);

        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error al guardar los datos');
            }
            res.send('Registro exitoso');
        });
    });
});

// Ruta para crear una sesión de pago de Stripe
app.post('/create-checkout-session', async (req, res) => {
    const { amount } = req.body; // Recibir el monto del cliente (en centavos)
    
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Compra en Runny U',
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/success.html`,
            cancel_url: `${req.headers.origin}/cancel.html`,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creando sesión de pago:', error);
        res.status(500).send('Error creando la sesión de pago');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

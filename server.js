const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos (index.html, css, js, imágenes)
app.use(express.static(path.join(__dirname, 'public_2')));

// Ruta para la página principal, ya que index.html está en /public
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public_2', 'index.html'));
});

// Obtener usuarios
app.get('/users.json', (req, res) => {
    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) {
            // Si el archivo no existe, se responde con un arreglo vacío
            if (err.code === 'ENOENT') {
                return res.json([]);
            }
            return res.status(500).send('Error al leer el archivo de usuarios');
        }
        res.json(JSON.parse(data || '[]'));
    });
});

// Guardar usuarios
app.post('/save', (req, res) => {
    const data = req.body;

    // Validar que el correo tiene el dominio @soyudemedellin.edu.co
    const emailPattern = /^[a-zA-Z0-9._-]+@soyudemedellin\.edu\.co$/;
    if (!emailPattern.test(data.email)) {
        return res.status(400).send('El correo debe ser de dominio @soyudemedellin.edu.co');
    }

    // Leer los usuarios actuales desde el archivo JSON
    fs.readFile(USERS_FILE, 'utf8', (err, existingData) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Error al leer el archivo de usuarios');
        }

        // Parsear los datos del archivo o inicializar un array vacío si no existe
        const users = existingData ? JSON.parse(existingData) : [];

        // Verificar si el usuario ya está registrado
        const userExists = users.some(user => user.email === data.email);
        if (userExists) {
            return res.status(400).send('Este correo ya está registrado');
        }

        // Agregar el nuevo usuario
        users.push(data);

        // Guardar los usuarios en el archivo
        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error al guardar los datos');
            }
            res.send('Registro exitoso');
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});





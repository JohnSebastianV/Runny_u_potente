// Función para manejar el registro
function handleRegister(event) {
    event.preventDefault();
    let email = document.getElementById('registerEmail').value.trim(); // Obtener correo sin modificar
    const name = document.getElementById('registerName').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const errorElement = document.getElementById('registerError');

    // Agregar el dominio automáticamente si no está presente
    if (!email.endsWith('@soyudemedellin.edu.co')) {
        email += '@soyudemedellin.edu.co';  // Agregar el dominio solo si no está presente
    }

    // Validación del correo
    const emailPattern = /^[a-zA-Z0-9._-]+@soyudemedellin\.edu\.co$/;
    if (!emailPattern.test(email)) {
        errorElement.textContent = 'El correo debe tener el dominio @soyudemedellin.edu.co.';
        return;
    }

    // Validación de que el correo no esté ya registrado
    getUsersFromServer().then(users => {
        if (users.some(user => user.email === email)) {
            errorElement.textContent = 'El correo ya está registrado.';
            return;
        }

        // Guardar el nuevo usuario
        const newUser = { email, name, phone, password };
        saveUserToServer(newUser); // Guardar el nuevo usuario en el servidor
    });
}

// Función para guardar un usuario en el servidor
function saveUserToServer(user) {
    fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'Registro exitoso') {
            alert('¡Registro exitoso!');
            switchToLogin(); // Cambia a la vista de inicio de sesión después del registro
        } else {
            alert(data);
        }
    })
    .catch(err => {
        console.error('Error al guardar el usuario en el servidor:', err);
    });
}

// Función para cambiar a la vista de inicio de sesión
function switchToLogin() {
    showSection('auth-section');  // Usamos showSection para cambiar a la sección de login
}

// Función para cambiar a la vista de registro
function switchToRegister() {
    showSection('register-section');  // Usamos showSection para cambiar a la sección de registro
}

// Función para mostrar una sección específica
function showSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar la sección correspondiente
    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    }
}




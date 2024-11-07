function handleLogin(event) {
    event.preventDefault();
    let email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const errorElement = document.getElementById("loginError");

    // Agregar el dominio por defecto
    email += "@soyudemedellin.edu.co";

    getUsersFromServer().then((users) => {
        // Buscar el usuario por el correo y la contraseña
        const user = users.find((u) => u.email === email && u.password === password);

        if (!user) {
            errorElement.textContent = "Correo o contraseña incorrectos.";
            return;
        }

        // Guardar el usuario en localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert(`Bienvenido, ${user.name}`);
        showSection("inicio");
        updateUI(user); // Actualizar la UI con el usuario logueado
    });
}

function switchToRegister() {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("register-section").style.display = "block";
}

function switchToLogin() {
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("register-section").style.display = "none";
}

function updateUI(user) {
    const loginButton = document.getElementById("loginButton");
    const switchToRegisterButton = document.getElementById("switchToRegister");

    if (user) {
        loginButton.textContent = "Cerrar Sesión";
        loginButton.onclick = handleLogout; // Configurar funcionalidad de cierre de sesión
        switchToRegisterButton.style.display = "none"; // Ocultar botón de registro
    } else {
        loginButton.textContent = "Iniciar Sesión";
        loginButton.onclick = () => showSection("auth-section"); // Configurar funcionalidad de inicio de sesión
        switchToRegisterButton.style.display = "block"; // Mostrar botón de registro
    }
}

function handleLogout() {
    // Eliminar el usuario logueado del localStorage
    localStorage.removeItem("loggedInUser");
    alert("Has cerrado sesión.");

    updateUI(null); // Actualizar la UI sin usuario
    showSection("auth-section"); // Redirigir al inicio de sesión
}

function initApp() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    updateUI(loggedInUser); // Actualizar la UI según el estado del usuario
}

function getUsersFromServer() {
    return fetch("/users.json")
        .then((response) => response.json())
        .catch((err) => {
            console.error("Error al obtener los usuarios:", err);
            return [];
        });
}







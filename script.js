document.addEventListener('DOMContentLoaded', function () {
    const usuarioActivo = sessionStorage.getItem('usuarioIniciado');
    const textoIniciadoHeader = document.getElementById('textoIniciadoHeader'); //Nombre del usuario en el Header

    //Si hay una sesion iniciada se cambia el texto del menu
    if (textoIniciadoHeader && usuarioActivo) {
        textoIniciadoHeader.textContent = usuarioActivo; //Cambia el texto Login por el nombre de usuario
    }

    //Para que funcione en login.html
    const botonRegistro = document.getElementById('botonRegistro'); 
    if (!botonRegistro) {
        return; //Si no estamos en login.html no va el script
    }
    
    const inputUsuario = document.getElementById('name');
    const inputPassword = document.getElementById('password');
    const mensajeError = document.getElementById('mensajeError');
    const errorPasswordList = document.getElementById('errorPassword');

    //Validacion en tiempo real
    inputPassword.addEventListener('input', function () {
        validarPassword(inputPassword.value); //Muestra los requisitos que cumple al momento
    });

    //Boton Login
    botonRegistro.addEventListener('click', function () {
        const usuario = inputUsuario.value.trim(); //Lee el nombre y quita espacios en los lados
        const password = inputPassword.value; //Lee la contraseña tal cual

        mensajeError.textContent = ''; //Quita los mensajes de error

        if (usuario === '') { //Si no hay nada enseña este mensaje de error
            mensajeError.textContent = 'Por favor, introduce tu nombre de usuario.';
            inputUsuario.focus(); //Pone el cursos en el campo
            return; 
        }

        //Comprueba la validacion de la contraseña
        const errorPassword = validarPassword(password);
        if (errorPassword) {
            return; //Si es mala la contraseña no inicia sesion
        }

        //Guarda la sesion
        sessionStorage.setItem('usuarioIniciado', usuario);

        if (textoIniciadoHeader) { //Actualiza el menu superior con el nombre del usuario
            textoIniciadoHeader.textContent = usuario;
        }

        mostrarSesionIniciada(); //Esconde el formulario del registro
    });

    //Esta es la funcion de validacion de la contraseña
    function validarPassword(password) {
        const errors = [];
        if (password.length < 6 || password.length > 12) { //Tamaño de la contraseña
            errors.push('Debe tener entre 6 y 12 caracteres.');
        }
        if (!/[A-Z]/.test(password)) { //Mayusculas
            errors.push('Debe tener al menos una letra mayúscula.');
        }
        if (!/[a-z]/.test(password)) { //Minusculas
            errors.push('Debe tener al menos una letra minúscula.');
        }
        if (!/[0-9]/.test(password)) { //Numeros
            errors.push('Debe tener al menos un número.');
        }

        errorPasswordList.innerHTML = ''; //Limpia errores
        errors.forEach(function (msg) { //Contiene los mensajes de los requisitos no cumplidos
            const li = document.createElement('li'); //Crea un nuevo elemento de lista <li>
            li.textContent = msg; //Asigna el texto del error al elemento
            errorPasswordList.appendChild(li); //Enseña el error
        });

        return errors.length > 0; //true si hay errores >0 y false si no los hay
    }

    //Seccion sesion iniciada
    function mostrarSesionIniciada() {
        const formulario = document.getElementById('formularioRegistro');
        const seccionSesionIniciada = document.getElementById('seccionSesionIniciada');
        const nombreSesionIniciada = document.getElementById('nombreSesionIniciada');

        formulario.style.display = 'none'; //Oculta el formulario
        seccionSesionIniciada.style.display = 'block'; //Enseña mensaje de que se ha iniciado sesion
        nombreSesionIniciada.textContent = sessionStorage.getItem('usuarioIniciado'); //Pone el nombre del usuario en el mensaje de bienvenida
    }

    //Boton cerrar sesion
    const botonCerrar = document.getElementById('botonCerrarSesion');
    if (botonCerrar) {
        botonCerrar.addEventListener('click', function () {
            sessionStorage.removeItem('usuarioIniciado'); //Borra los datos de la memoria
            location.reload(); //Recarga para resetear la interfaz
        });
    }

    if (usuarioActivo) { //Si al cargar la pagina hay una sesion, muestra la bienvenida
        mostrarSesionIniciada();
    }
});

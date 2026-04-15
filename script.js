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


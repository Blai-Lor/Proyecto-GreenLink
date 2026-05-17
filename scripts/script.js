document.addEventListener('DOMContentLoaded', function () {
    const usuariAConectado = sessionStorage.getItem('usuarioIniciado');
    const nomUsuariHeader = document.getElementById('nomUsuariHeader'); //Nom de usuari en el Header

    //Si hi ha una sesion iniciada es canvia el text del menu
    if (nomUsuariHeader && usuariAConectado) {
        nomUsuariHeader.textContent = usuariAConectado; //Cambia el texto Login por el nombre de usuario
    }

    //Per que funcione en login.html
    const botonRegistro = document.getElementById('botonRegistro'); 
    if (botonRegistro) {
        const usuari = document.getElementById('name');
        const contrasenya = document.getElementById('password');
        const mensajeError = document.getElementById('mensajeError');
        const errorContrasenya = document.getElementById('errorPassword');

        //Validacio en tiemps real
        contrasenya.addEventListener('input', function () {
            comprovaContraseya(contrasenya.value); //Muestra los requisitos que cumple al momento
        });

        //Boton Login
        botonRegistro.addEventListener('click', function () {
            const usuario = usuari.value.trim(); //Lee el nombre y quita espacios en los lados
            const password = contrasenya.value; //Lee la contraseña tal cual

            mensajeError.textContent = ''; //Quita los mensajes de error

            if (usuario === '') { //Si no hay nada enseña este mensaje de error
                mensajeError.textContent = 'Por favor, introduce tu nombre de usuario.';
                usuari.focus(); //Pone el cursor en el campo
                return; 
            }

            //Comprueba la validacion de la contraseña
            const errorPassword = comprovaContraseya(password);
            if (errorPassword) {
                return; //Si es mala la contraseña no inicia sesion
            }

            //Guarda la sesion
            sessionStorage.setItem('usuarioIniciado', usuario);
            if (nomUsuariHeader) { //Actualiza el menu superior con el nombre del usuario
                nomUsuariHeader.textContent = usuario;
            }
            mostrarSesionIniciada(); //Esconde el formulario del registro
        });

        //funcion de validacion de la contraseña
        function comprovaContraseya(password) {
            const errors = []; //Array que guardar els mistages de error
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

            errorContrasenya.innerHTML = ''; //Limpia errores
            errors.forEach(function (missatje) { //Contiene los mensajes de los requisitos no cumplidos
                const li = document.createElement('li'); //Crea un nuevo elemento de lista <li>
                li.textContent = missatje; //Asigna el texto del error al elemento
                errorContrasenya.appendChild(li); //Enseña el error
            });
            return errors.length > 0; //True si hay errores >0 y false si no los hay
        }
    }

    //Seccion sesion iniciada
    function mostrarSesionIniciada() {
        const formulario = document.getElementById('formularioRegistro');
        const seccionSesionIniciada = document.getElementById('seccionSesionIniciada');
        const nombreSesionIniciada = document.getElementById('nombreSesionIniciada');

        if (formulario && seccionSesionIniciada) {
            formulario.style.display = 'none'; //Oculta el formulario
            seccionSesionIniciada.style.display = 'block'; //Enseña mensaje de que se ha iniciado sesion
            nombreSesionIniciada.textContent = sessionStorage.getItem('usuarioIniciado'); //Pone el nombre del usuario en el mensaje de bienvenida
        }
    }

    //Boton cerrar sesion
    const botonCerrar = document.getElementById('botonCerrarSesion');
    if (botonCerrar) {
        botonCerrar.addEventListener('click', function () {
            sessionStorage.removeItem('usuarioIniciado'); //Borra los convierte de la memoria
            location.reload(); //Recarga para resetear la interfaz
        });
    }

    if (usuariAConectado) { //Si al cargar la pagina hay una sesion, muestra la bienvenida
        mostrarSesionIniciada();
    }

    //Pone/añade los productos al index.html
    async function cincoProductos() {
        const poneProductos = document.getElementById('productosAñade');
        if (!poneProductos) return; //Si no estamos en index.html no hace nada

        try { //Carga el JSON con los productos
            const leeFichero = await fetch('productos.json'); //Lee el JSON
            const convierte = await leeFichero.json(); //Convierte el JSON a un objeto de JavaScript
            let productos = convierte.productos; //Accede al array de productos dentro del objeto JSON

            //Filtro para index.html para que solo aparezcan 5 productos
            const estaEnIndex = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
            if (estaEnIndex) {
                productos = productos.slice(0, 5); //Minimo 0 y maximo 5
            }

            poneProductos.innerHTML = '';  //Limpia el poneProductos antes de añadir los productos
            productos.forEach(produc => { //Crea cada producto con su informacion y botones
                const article = document.createElement('article'); //Crea un nuevo elemento article para cada producto
                article.className = 'productosPorSeparado'; //Asigna una clase para estilos
                article.innerHTML = `
                    <img src="img/${produc.imagen.replace('img/', '')}" alt="${produc.nombre}">
                    <div class="infoProductos">
                        <span class="filtro">${produc.categoria}</span>
                        <h3>${produc.nombre}</h3>
                        <p class="agricultor">Agricultor: ${produc.agricultor}</p>
                        <p>${produc.lugar}</p>
                        <p class="valoracion">${produc.valoracion}</p>
                        <p class="precio">${produc.precio}</p>
                        <div class="botonCasilla">
                            <a href="informacion-producto.html?id=${produc.id}" class="botonDetalle">Ver detalles</a>
                        </div>
                    </div>
                `;
                poneProductos.appendChild(article);
            });
        } catch (error) { //Si hay error
            console.error("Error al cargar los productos", error);
        }
    }

    cincoProductos();

    //Pone/añade los productos al producto.html
    async function todosProductos() {
        const poneProductos = document.getElementById('contenedorProductosPagina');
        if (!poneProductos) return; //Si no estamos en producto.html no hace nada

        try { //Carga el JSON con los productos
            const leeFichero = await fetch('productos.json'); //Lee el JSON
            const convierte = await leeFichero.json(); //Convierte el JSON a un objeto de JavaScript
            const productos = convierte.productos; //Accede al array de productos dentro del objeto JSON

            poneProductos.innerHTML = ''; //Limpia el poneProductos antes de añadir los productos

            productos.forEach(produc => { //Crea cada producto con su informacion y botones
                const article = document.createElement('article'); //Crea un nuevo elemento article para cada producto
                article.className = 'productosPorSeparado'; //Asigna una clase para estilos
            
                article.innerHTML = `
                    <img src="img/${produc.imagen.replace('img/', '')}" alt="${produc.nombre}">
                    <div class="infoProductos">
                        <span class="filtro">${produc.categoria}</span>
                        <h3>${produc.nombre}</h3>
                        <p class="agricultor">Agricultor: ${produc.agricultor}</p>
                        <p>${produc.lugar}</p>
                        <p class="valoracion">${produc.valoracion}</p>
                        <p class="precio">${produc.precio}</p>
                        <div class="botonCasilla">
                            <a href="informacion-producto.html?id=${produc.id}" class="botonDetalle">Ver detalles</a>
                        </div>
                    </div>
                `;
                poneProductos.appendChild(article);
            });
        } catch (error) { //Si hay error
            console.error("Error al cargar los productos", error);
        }
    }

    todosProductos();

    //Carga la pagina de informacion de cada producto
    async function infoProductos() {
        const poneProductos = document.getElementById('detalleProductoContenido');
        if (!poneProductos) return; //Si no estamos en informacion-producto.html no hace nada

        const mira = new URLSearchParams(window.location.search); //Lee la URL para coger el id del producto que queremos
        const id = parseInt(mira.get('id')); //Lee el id del producto

        if (!id) {
            poneProductos.innerHTML = '<p>Producto no encontrado.</p>';
            return;
        }

        try {
            const leeFichero = await fetch('productos.json'); //Lee el JSON
            const convierte = await leeFichero.json(); //Convierte el JSON a un objeto de JavaScript
            const produc = convierte.productos.find(cadaProducto => cadaProducto.id === id); //Busca el producto por id

            //Actualiza el titulo de la pagina con el nombre del producto
            document.title = `GreenLink - ${produc.nombre}`;
            poneProductos.innerHTML = `
                <div class="infoCadaProducto">
                    <div class="imagenProd">
                        <img src="img/${produc.imagen.replace('img/', '')}" alt="${produc.nombre}">
                    </div>
                    <div class="col-info">
                        <span class="filtro">${produc.categoria}</span>
                        <h1>${produc.nombre}</h1>
                        <p class="agricultor">Agricultor: ${produc.agricultor}</p>
                        <p>${produc.lugar}</p>
                        <p class="valoracion">${produc.valoracion}</p>
                        <p>${produc.descripcion}</p>
                        <p class="precioConCantidad">${produc.precio}</p>
                        <button class="botonProductos" onclick="añadirAlCarrito('${produc.nombre}', '${produc.precio}', '${produc.imagen}')">🛒 Añadir a la cesta</button>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error("Error al cargar", error);
        }
    }

    infoProductos();

    //Muestra los productos del carrito en carrito.html
    function muestraCarrito() {
        const poneProductos = document.getElementById('cesta');
        if (!poneProductos) return; //Si no estamos en carrito.html, no hace nada

        //Mira el carrito en localStorage para mostrar los productos que hay pero si no hay nada pone un array vacio
        let carrito = localStorage.getItem('carrito'); //Lee el carrito guardado
            if (carrito) { //Si hay algo guardado
                carrito = JSON.parse(carrito);  //Lo convierte a array
            } else { //Si no hay nada
                carrito = []; //Crea un array vacio
            }

        if (carrito.length === 0) { //Si el carrito esta vacio
            poneProductos.innerHTML = '<p class="cestaVacia">La cesta esta vacia.</p>';
            document.getElementById('botonPagarCarrito').style.display = 'none';
            return;
        }

        poneProductos.innerHTML = ''; //Limpia el poneProductos
        carrito.forEach(function(product, index) { //Crea cada producto del carrito
            const productosCarrito = document.createElement('productosCarrito');
            productosCarrito.className = 'carrito-product';
            productosCarrito.innerHTML = `
                <span><strong>${product.nombre}</strong></span>
                <span>${product.precio}</span>
                <button class="botonProductos" onclick="eliminarDelCarrito(${index})">Eliminar</button>
            `;
            poneProductos.appendChild(productosCarrito);
        });
    }

    muestraCarrito();
});

//Lo hace fuera del DOMContentLoaded para que funcione desde cualquier html
let carritoGuardado = localStorage.getItem('carrito'); //Lee el carrito guardado
    if (carritoGuardado) { //Si hay algo guardado
        carrito = JSON.parse(carritoGuardado); //Lo convierte a array
    } else { //Si no hay nada
        carrito = []; //Crea un array vacio
    }

//Añade productos al carrito 
window.añadirAlCarrito = function(nombre, precio) {
    carrito.push({nombre, precio}); //Añade un nuevo producto con su nombre y precio
    localStorage.setItem('carrito', JSON.stringify(carrito)); //Lo guarda en localStorage
    alert(`${nombre} se ha añadido a tu cesta.`); //Mensaje de producto añadido
};

//Elimina un producto del carrito por su posicion
window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1); //Elimina el elemento en la posicion indicada
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload(); //Recarga para actualizar la vista
};
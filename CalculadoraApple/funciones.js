
const pantalla = document.getElementById("resultado");
const operacionPantalla = document.getElementById("operacion");
const botones = document.querySelector(".botones");

// Datos que la calculadora necesita recordar
let actual = "0";
let anterior = null;
let operador = null;
let esperandoNuevoNumero = false;
let mostrarOperacion = "";

// Mostrar el número en pantalla
function actualizarPantalla() {
    pantalla.textContent = actual.replace(".", ",");

    // Reducir el tamaño si el número es muy largo
    pantalla.style.fontSize =
        actual.length > 9 ? "42px" :
        actual.length > 7 ? "52px" : "65px";

    operacionPantalla.textContent = mostrarOperacion;
}

// Escribir un número
function escribirNumero(numero) {
    if (actual === "Error") {
        reiniciar();
    }

    if (esperandoNuevoNumero) {
        actual = numero;
        esperandoNuevoNumero = false;
    } else if (actual === "0") {
        actual = numero;
    } else if (actual.replace("-", "").replace(".", "").length < 12) {
        actual += numero;
    }

    actualizarPantalla();
}

// Añadir la coma decimal
function escribirDecimal() {
    if (actual === "Error") {
        reiniciar();
    }

    if (esperandoNuevoNumero) {
        actual = "0.";
        esperandoNuevoNumero = false;
    } else if (!actual.includes(".")) {
        actual += ".";
    }

    actualizarPantalla();
}

// Realizar una operación matemática
function calcular(a, b, signo) {
    switch (signo) {
        case "+":
            return a + b;

        case "-":
            return a - b;

        case "*":
            return a * b;

        case "/":
            return b === 0 ? null : a / b;

        default:
            return b;
    }
}

// Elegir una operación
function elegirOperador(nuevoOperador) {
    if (actual === "Error") return;

    const numero = Number(actual);

    if (operador !== null && !esperandoNuevoNumero) {
        const resultado = calcular(anterior, numero, operador);

        if (resultado === null) {
            mostrarError();
            return;
        }

        actual = String(resultado);
    }

    anterior = Number(actual);
    operador = nuevoOperador;
    esperandoNuevoNumero = true;

    mostrarOperacion =
        `${anterior} ${simboloVisible(operador)}`;

    actualizarPantalla();
}

// Mostrar los símbolos como en el iPhone
function simboloVisible(signo) {
    if (signo === "*") return "×";
    if (signo === "/") return "÷";
    if (signo === "-") return "−";
    return signo;
}

// Obtener el resultado final
function obtenerResultado() {
    if (operador === null || anterior === null) return;
    if (actual === "Error") return;

    const segundoNumero = Number(actual);
    const primerNumero = anterior;
    const signo = operador;

    const resultado = calcular(
        primerNumero,
        segundoNumero,
        signo
    );

    if (resultado === null || !Number.isFinite(resultado)) {
        mostrarError();
        return;
    }

    mostrarOperacion =
        `${primerNumero} ${simboloVisible(signo)} ${segundoNumero} =`;

    actual = String(Number(resultado.toPrecision(10)));
    operador = null;
    anterior = null;
    esperandoNuevoNumero = true;

    actualizarPantalla();
}

// Cambiar el signo del número
function cambiarSigno() {
    if (actual === "Error" || actual === "0") return;

    actual = actual.startsWith("-")
        ? actual.slice(1)
        : "-" + actual;

    actualizarPantalla();
}

// Calcular el porcentaje
function calcularPorcentaje() {
    if (actual === "Error") return;

    actual = String(Number(actual) / 100);
    actualizarPantalla();
}

// Limpiar la calculadora
function reiniciar() {
    actual = "0";
    anterior = null;
    operador = null;
    esperandoNuevoNumero = false;
    mostrarOperacion = "";

    actualizarPantalla();
}

// Mostrar un error
function mostrarError() {
    actual = "Error";
    anterior = null;
    operador = null;
    esperandoNuevoNumero = true;
    mostrarOperacion = "";

    actualizarPantalla();
}

// Detectar los botones pulsados
botones.addEventListener("click", function(evento) {
    const boton = evento.target.closest("button");

    if (!boton) return;

    if (boton.dataset.number !== undefined) {
        escribirNumero(boton.dataset.number);
        return;
    }

    if (boton.dataset.operator !== undefined) {
        elegirOperador(boton.dataset.operator);
        return;
    }

    switch (boton.dataset.action) {
        case "clear":
            reiniciar();
            break;

        case "decimal":
            escribirDecimal();
            break;

        case "sign":
            cambiarSigno();
            break;

        case "percent":
            calcularPorcentaje();
            break;

        case "equals":
            obtenerResultado();
            break;
    }
});

// Mostrar el estado inicial
actualizarPantalla();

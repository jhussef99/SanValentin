// ===========================
// COFRE SECRETO (SE ACTIVA DESDE explosionAmor)
// ===========================

function activarCofreSecreto() {

    const cofre = document.createElement("div");
    cofre.id = "cofreSecreto";
    cofre.innerHTML = "🎁";
    document.body.appendChild(cofre);

    setTimeout(() => {
        cofre.classList.add("mostrar");
    }, 100);

    sonarMagico();

    setTimeout(() => {
        cofre.classList.add("abrir");
    }, 1500);

    setTimeout(() => {
        abrirPantallaSecreta();
        cofre.remove();
    }, 2500);
}


// ===========================
// SONIDO MÁGICO
// ===========================

function sonarMagico() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.6);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.6);
    } catch(e) {
        console.warn('Error al reproducir sonido:', e);
    }
}

// ===========================
// CAMBIO DE PANTALLA
// ===========================

function abrirPantallaSecreta() {

    document.querySelectorAll(".screen").forEach(s => 
        s.classList.remove("active")
    );

    document.getElementById("pantallaSecreta")
        .classList.add("active");

    iniciarScratch();
    iniciarMusicaSecreta();
}

// ===========================
// SCRATCH INTERACTIVO CON CURSOR PERSONALIZADO
// ===========================

function iniciarScratch() {

    const canvas = document.getElementById("scratchCanvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = "collage-pixel.jpg";

    const baseImg = document.querySelector(".imagen-base");

    canvas.width = baseImg.clientWidth;
    canvas.height = baseImg.clientHeight;

    // CURSOR PERSONALIZADO
    canvas.style.cursor = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\"><circle cx=\"16\" cy=\"16\" r=\"12\" fill=\"rgba(255,255,255,0.3)\" stroke=\"white\" stroke-width=\"2\"/></svg>') 16 16, auto";

    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    let dibujando = false;
    let porcentajeRevelado = 0;

    function raspar(x, y) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
    }

    // PC
    canvas.addEventListener("mousedown", () => dibujando = true);
    canvas.addEventListener("mouseup", () => dibujando = false);
    canvas.addEventListener("mouseleave", () => dibujando = false);

    canvas.addEventListener("mousemove", (e) => {
        if (!dibujando) return;
        const rect = canvas.getBoundingClientRect();
        raspar(e.clientX - rect.left, e.clientY - rect.top);
        verificarRevelado();
    });

    // MÓVIL
    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        dibujando = true;
    }, { passive: false });

    canvas.addEventListener("touchend", () => dibujando = false);

    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        raspar(touch.clientX - rect.left, touch.clientY - rect.top);
        verificarRevelado();
    }, { passive: false });

    function verificarRevelado() {

        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparentes = 0;

        for (let i = 3; i < pixels.data.length; i += 4) {
            if (pixels.data[i] === 0) transparentes++;
        }

        const nuevosPorcentaje = transparentes / (canvas.width * canvas.height);

        // Solo actualizar si hay cambio significativo
        if(Math.abs(nuevosPorcentaje - porcentajeRevelado) > 0.05){
            porcentajeRevelado = nuevosPorcentaje;
            
            // Feedback táctil progresivo
            if(porcentajeRevelado > 0.3 && porcentajeRevelado < 0.35){
                if(navigator.vibrate) navigator.vibrate(50);
            }
            if(porcentajeRevelado > 0.5 && porcentajeRevelado < 0.55){
                if(navigator.vibrate) navigator.vibrate([50, 30, 50]);
            }
        }

        if (porcentajeRevelado > 0.6) {

            document.getElementById("instruccionRaspa").style.display = "none";

            // Efecto visual de revelación completa
            canvas.style.transition = "opacity 1s";
            canvas.style.opacity = "0";

            setTimeout(() => canvas.remove(), 1000);

            mostrarMensajeFinal();
        }
    }
}

// ===========================
// MENSAJE FINAL + CORAZONES MEJORADO
// ===========================

function mostrarMensajeFinal() {

    const mensaje = document.getElementById("mensajeFinal");
    mensaje.classList.add("visible");

    let cantidad = 0;

    const intervalo = setInterval(() => {

        const corazon = document.createElement("div");
        corazon.className = "corazon";
        corazon.innerHTML = "💖";
        corazon.style.left = Math.random() * window.innerWidth + "px";
        corazon.style.bottom = "0px";

        document.body.appendChild(corazon);

        setTimeout(() => corazon.remove(), 4000);

        cantidad++;

        if (cantidad > 25) {
            clearInterval(intervalo);
        }

    }, 200);

    // Vibración de celebración final
    if(navigator.vibrate) {
        setTimeout(() => navigator.vibrate([100, 50, 100, 50, 100, 50, 200]), 500);
    }
}

// ===========================
// MÚSICA SECRETA CON MANEJO DE ERRORES
// ===========================

function iniciarMusicaSecreta() {

    const musicaAnterior = document.getElementById("missionMusic");
    if (musicaAnterior) musicaAnterior.pause();

    const audio = new Audio("musica_secreta.mp3");
    audio.loop = true;
    
    audio.play().catch(err => {
        console.warn('No se pudo reproducir música secreta:', err);
        // Mostrar control manual si falla autoplay
        mostrarControlMusica(audio);
    });
}

function mostrarControlMusica(audio){
    const control = document.createElement('div');
    control.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 46, 159, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 20px;
        font-size: 11px;
        z-index: 10000;
        cursor: pointer;
        animation: fadeInUp 0.5s;
    `;
    control.innerHTML = '🎵 Toca para música especial';
    control.onclick = () => {
        audio.play();
        control.remove();
    };
    document.body.appendChild(control);
}

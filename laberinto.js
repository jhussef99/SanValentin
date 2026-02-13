function iniciarLaberinto() {

    const mazeScreen = document.getElementById("mazeScreen");
    mazeScreen.innerHTML = "";
    mazeScreen.style.background = "linear-gradient(180deg,#1e0033,#000)";

    const container = document.createElement("div");
    container.style.textAlign = "center";
    container.style.paddingTop = "40px";
    container.style.color = "white";
    container.innerHTML = `
        <h2>🏡 Encuentra nuestro hogar 🏡</h2>
        <canvas id="mazeCanvas" width="270" height="270" style="background:#111;border-radius:15px;transition:all 0.2s ease;"></canvas>
        <div style="margin-top:20px;">
            <button onclick="mover('up')" aria-label="Mover arriba">⬆️</button><br>
            <button onclick="mover('left')" aria-label="Mover izquierda">⬅️</button>
            <button onclick="mover('down')" aria-label="Mover abajo">⬇️</button>
            <button onclick="mover('right')" aria-label="Mover derecha">➡️</button>
        </div>
        <p id="mensajeMaze" style="margin-top:20px;min-height:30px;"></p>
    `;

    mazeScreen.appendChild(container);

    const canvas = document.getElementById("mazeCanvas");
    const ctx = canvas.getContext("2d");

    const tileSize = 30;
    let movimientos = 0;

    const maze = [
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,1,0,1],
        [1,0,1,1,1,0,1,0,1],
        [1,0,0,0,1,0,1,0,1],
        [1,1,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,1,0,1],
        [1,1,1,1,1,1,1,1,1]
    ];

    let player = { x:1, y:1 };
    const goal = { x:7, y:7 };

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);

        for(let y=0; y<maze.length; y++){
            for(let x=0; x<maze[y].length; x++){
                if(maze[y][x] === 1){
                    ctx.fillStyle = "#333";
                    ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
                }
            }
        }

        ctx.font = "24px Arial";
        ctx.fillText("👫🏻", player.x*tileSize+4, player.y*tileSize+24);
        ctx.fillText("🏡", goal.x*tileSize+4, goal.y*tileSize+24);
    }

    function playStepSound(){
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = "sine";
            oscillator.frequency.value = 300;
            gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch(e) {
            // Silencioso si falla
        }
    }

    window.mover = function(direction){

        let newX = player.x;
        let newY = player.y;

        if(direction === "up") newY--;
        if(direction === "down") newY++;
        if(direction === "left") newX--;
        if(direction === "right") newX++;

        if(!maze[newY] || maze[newY][newX] === undefined) return;

        if(maze[newY][newX] === 1){
            
            canvas.style.transform = "scale(0.98)";
            setTimeout(() => canvas.style.transform = "scale(1)", 100);
            
            if(navigator.vibrate) navigator.vibrate(100);

            document.getElementById("mensajeMaze").innerHTML = 
              `🚧 <span style='color:#ff6b6b;'>Camino bloqueado</span> 😏`;

            setTimeout(() => {
                document.getElementById("mensajeMaze").innerHTML = 
                  `Movimientos: ${movimientos}`;
            }, 800);

            return;
        }

        player.x = newX;
        player.y = newY;
        movimientos++;

        playStepSound();

        document.getElementById("mensajeMaze").innerHTML = 
          `Movimientos: ${movimientos}`;

        if(player.x === goal.x && player.y === goal.y){
            ganar();
        }

        draw();
    }

    document.addEventListener("keydown", function(e){
        if(e.key === "ArrowUp") mover("up");
        if(e.key === "ArrowDown") mover("down");
        if(e.key === "ArrowLeft") mover("left");
        if(e.key === "ArrowRight") mover("right");
    });

    function ganar(){

        const music = document.getElementById("missionMusic");
        if(music) music.pause();

        document.getElementById("mensajeMaze").innerHTML = 
        `💖 Lo logramos en ${movimientos} movimientos 💖<br><br>Siempre terminamos en casa 🏡♾️`;

        canvas.style.boxShadow = "0 0 40px #ff2e9f";

        if(navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);

        setTimeout(mostrarPantallaFinal, 2500);
    }

    function mostrarPantallaFinal(){

        document.body.style.opacity = "0";

        setTimeout(() => {

            mazeScreen.innerHTML = `
                <div style="min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;background:black;color:#ff4df8;text-align:center;overflow:hidden;position:relative;">

                    <h1 style="font-size:28px;animation:glow 2s infinite alternate;">♾️</h1>

                    <h2 style="margin-top:30px;">Angelo 💘 Daniely</h2>

                    <p style="margin-top:20px;font-size:12px;max-width:300px;">
                        No importa cuántas vueltas demos,<br>
                        siempre elegimos el mismo destino:<br><br>
                        Ser feliz juntos 🏡✨
                    </p>

                    <button onclick="explosionAmor()" 
                        style="margin-top:30px;padding:12px 20px;border:none;border-radius:20px;background:#ff2e9f;color:white;font-weight:bold;cursor:pointer;font-family:'Press Start 2P',cursive;font-size:12px;">
                        💖 Celebrar Amor 💖
                    </button>
                </div>
            `;

            const style = document.createElement("style");
            style.innerHTML = `
                @keyframes glow{
                    from{ text-shadow:0 0 10px #ff2e9f; transform:scale(1);}
                    to{ text-shadow:0 0 30px #ff9bf5; transform:scale(1.1);}
                }
                .particle{
                    position:absolute;
                    font-size:20px;
                    animation:fall 3s linear forwards;
                    pointer-events:none;
                }
                @keyframes fall{
                    to{
                        transform:translateY(-600px) rotate(720deg);
                        opacity:0;
                    }
                }
                .hint-popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(255, 46, 159, 0.9);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 15px;
                    font-size: 11px;
                    z-index: 10000;
                    animation: fadeInUp 0.5s;
                }
            `;
            document.head.appendChild(style);

            document.body.style.opacity = "1";

        }, 1000);
    }

    let contadorSecreto = 0;

    window.explosionAmor = function(){

        contadorSecreto++;

        const emojis = ["💖","💋","🎆","✨"];

        for(let i=0; i<40; i++){
            const span = document.createElement("span");
            span.className = "particle";
            span.innerText = emojis[Math.floor(Math.random()*emojis.length)];
            span.style.left = Math.random()*100+"vw";
            span.style.bottom = "0px";
            span.style.fontSize = (20 + Math.random()*20)+"px";

            document.body.appendChild(span);

            setTimeout(() => span.remove(), 3000);
        }

        if(navigator.vibrate) navigator.vibrate([100,50,100]);

        // PISTA VISUAL PROGRESIVA
        if(contadorSecreto >= 8 && contadorSecreto < 11){
            mostrarPista(11 - contadorSecreto);
        }

        // SECRETO A LOS 11 CLICKS
        if(contadorSecreto === 11){
            activarCofreSecreto();
        }
    }

    function mostrarPista(clicksFaltantes){
        const hint = document.createElement("div");
        hint.className = "hint-popup";
        hint.textContent = `✨ ${clicksFaltantes} clicks más... ✨`;
        document.body.appendChild(hint);

        setTimeout(() => hint.remove(), 1500);
    }

    draw();
}

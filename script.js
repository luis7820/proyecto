// --- ESTADO GLOBAL ---
const synth = window.speechSynthesis;
let currentFontSize = 17;

// --- SÍNTESIS DE VOZ ---
function speakText(text) {
    stopAllSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1;
    synth.speak(utterance);
    showToast(`🔊 Narrando...`);
}

function stopAllSpeech() {
    synth.cancel();
}

// --- ACCESIBILIDAD VISUAL ---
function toggleContrast() {
    document.body.classList.toggle('hc');
    const isHC = document.body.classList.contains('hc');
    speakText(isHC ? 'Contraste alto activado' : 'Contraste estándar activado');
}

function changeFontSize(delta) {
    currentFontSize += delta;
    if (currentFontSize < 12) currentFontSize = 12;
    if (currentFontSize > 36) currentFontSize = 36;
    document.body.style.fontSize = `${currentFontSize}px`;
    showToast(`Tamaño: ${currentFontSize}px`);
}

// --- RECONOCIMIENTO DE VOZ ---
function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    const voiceBtn = document.getElementById('voice-btn');
    const statusText = document.getElementById('voice-status');

    recognition.onstart = () => {
        voiceBtn.classList.add('active');
        statusText.innerText = "Escuchando...";
    };

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('active');
        statusText.innerText = "Comandos";
    };

    recognition.start();
}

function handleVoiceCommand(cmd) {
    showToast(`Dijiste: "${cmd}"`);
    
    if (cmd.includes('contraste')) {
        toggleContrast();
    } else if (cmd.includes('grande') || cmd.includes('aumenta')) {
        changeFontSize(4);
        speakText('Letra más grande');
    } else if (cmd.includes('pequeño') || cmd.includes('reduce')) {
        changeFontSize(-4);
        speakText('Letra más pequeña');
    } else if (cmd.includes('detener') || cmd.includes('para')) {
        stopAllSpeech();
        showToast('⏹ Audio detenido');
    } else if (cmd.includes('ayuda')) {
        speakText('Puedes usar los botones de la barra superior para contraste, tamaño de letra y comandos de voz. También puedes navegar con el teclado.');
    } else if (cmd.includes('inicio')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        speakText('Volviendo al inicio');
    } else {
        speakText('Comando no reconocido. Prueba con: contraste, más grande, más pequeño, ayuda o detener.');
    }
}

// --- TECLADO ---
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'c') { e.preventDefault(); toggleContrast(); }
    if (e.altKey && e.key === 'v') { e.preventDefault(); startVoiceRecognition(); }
    if (e.altKey && e.key === '+') { e.preventDefault(); changeFontSize(2); }
    if (e.altKey && e.key === '-') { e.preventDefault(); changeFontSize(-2); }
});

// --- UI UTILS ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
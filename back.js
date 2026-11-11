
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 120, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#e00000" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": true },
        "size": { "value": 5, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#850f0f", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
    },
    "interactivity": {
    "detect_on": "window",
    "events": {
        "onhover": {
            "enable": true,
            "mode": "repulse"
        },
        "onclick": {
            "enable": false
        },
        "resize": true
    },
    "modes": {
        "repulse": {
            "distance": 150,
            "duration": 0.4
        }
    }
}
});

const container = document.getElementById('container');

for (let i = 0; i < 100; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const angle = (i / 20) * Math.PI * 2;
    const distance = 100 + (i % 10) * 50;
    const startX = Math.cos(angle) * distance * 3;
    const startY = Math.sin(angle) * distance * 3;
    const midX = Math.cos(angle) * distance;
    const midY = Math.sin(angle) * distance;
    particle.style.setProperty('--startX', `${startX}px`);
    particle.style.setProperty('--startY', `${startY}px`);
    particle.style.setProperty('--midX', `${midX}px`);
    particle.style.setProperty('--midY', `${midY}px`);
    particle.style.animation = `particle-move 2.5s ease-out forwards ${i * 0.02}s`;
    container.appendChild(particle);
}

for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle2';
    const angle = Math.random() * Math.PI * 2;
    const distance = 500 + Math.random() * 300;
    const startX = Math.cos(angle) * distance;
    const startY = Math.sin(angle) * distance;
    const midX = Math.cos(angle) * distance * 0.5;
    const midY = Math.sin(angle) * distance * 0.5;
    particle.style.setProperty('--startX', `${startX}px`);
    particle.style.setProperty('--startY', `${startY}px`);
    particle.style.setProperty('--midX', `${midX}px`);
    particle.style.setProperty('--midY', `${midY}px`);
    particle.style.animation = `particle2-move 3s ease-out forwards ${i * 0.03}s`;
    container.appendChild(particle);
}
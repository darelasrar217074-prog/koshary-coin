// Get the canvas element and its context
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Star properties
const stars = [];
const starCount = 100;

// Create stars
for (let i = 0; i < starCount; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 3 + 1,
        opacity: Math.random()
    });
}

// Animation function
function animateStars() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.globalAlpha = star.opacity;
        ctx.fill();
        
        // Move star down
        star.y += star.speed;
        
        // Reset star when it goes off screen
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
    
    // Reset global alpha
    ctx.globalAlpha = 1;
    
    // Next frame
    requestAnimationFrame(animateStars);
}

// Start animation
animateStars();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
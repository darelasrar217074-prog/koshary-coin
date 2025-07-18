// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle (for responsive design)
const createMobileMenu = () => {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    const mobileMenuBtn = document.createElement('div');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
    
    header.appendChild(mobileMenuBtn);
};

// Initialize mobile menu on smaller screens
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Update on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
        createMobileMenu();
    } else if (window.innerWidth > 768 && document.querySelector('.mobile-menu-btn')) {
        document.querySelector('.mobile-menu-btn').remove();
        document.querySelector('nav').classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Stars
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        const numberOfStars = 100;
        for (let i = 0; i < numberOfStars; i++) {
            let star = document.createElement('div');
            star.className = 'star';
            star.style.top = `${-5 + Math.random() * 10}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.setProperty('--random-x-start', `${Math.random() * 100 - 50}vw`);
            star.style.setProperty('--random-x-end', `${Math.random() * 100 - 50}vw`);
            star.style.animationDelay = `${Math.random() * 10}s`;
            star.style.animationDuration = `${5 + Math.random() * 5}s`;
            starsContainer.appendChild(star);
        }
    }

    // Scroll Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach(el => {
        observer.observe(el);
    });

    // Wallet Connection Logic
    const connectWalletBtn = document.querySelector('.connect-wallet-btn');
    const claimTokensBtn = document.getElementById('claimTokensBtn');

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                alert(`Wallet connected: ${account}`);
                // You can add further logic here, e.g., display connected address, enable claim button
            } catch (error) {
                console.error("User denied account access or other error: ", error);
                alert("Failed to connect wallet. Please make sure MetaMask is installed and unlocked.");
            }
        } else {
            alert("MetaMask is not installed. Please install it to connect your wallet.");
        }
    };

    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWallet);
    }

    if (claimTokensBtn) {
        claimTokensBtn.addEventListener('click', connectWallet);
    }
});
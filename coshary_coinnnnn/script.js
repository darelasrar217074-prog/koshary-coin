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
            const size = Math.random() * 3 + 1; // حجم النجمة بين 1px و 4px
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            star.style.animationDuration = `${Math.random() * 10 + 5}s`; // مدة الحركة بين 5s و 15s
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
        console.log('Attempting to connect wallet...');
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask/Trust Wallet (window.ethereum) is detected.');
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                alert(`Wallet connected: ${account}`);
                console.log(`Wallet successfully connected: ${account}`);
                // Populate the wallet address field in the airdrop form if it exists
                const walletAddressInput = document.getElementById('walletAddress');
                if (walletAddressInput) {
                    walletAddressInput.value = account;
                }
            } catch (error) {
                console.error("Error connecting wallet: ", error);
                if (error.code === 4001) {
                    alert("Wallet connection rejected by user.");
                } else {
                    alert("Failed to connect wallet. Please make sure MetaMask or Trust Wallet is installed and unlocked. Check console for details.");
                }
            }
        } else {
            alert("No Ethereum wallet (like MetaMask or Trust Wallet) detected. Please install one to connect your wallet.");
            console.log('No Ethereum wallet (window.ethereum) is detected.');
        }
    };

    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWallet);
    }

    if (claimTokensBtn) {
        claimTokensBtn.addEventListener('click', connectWallet);
    }

    // Airdrop Form Submission Handling
    // The following section for local storage and airdropParticipants array is removed
    // as Firebase Firestore is now handling participant storage directly in airdrop.html.

    // Leaderboard functionality
    const viewLeaderboardBtn = document.getElementById('viewLeaderboardBtn');
    if (viewLeaderboardBtn) {
        viewLeaderboardBtn.addEventListener('click', () => {
            console.log('View Leaderboard button clicked.'); // Debugging line
            document.querySelector('.airdrop-leaderboard').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});

// Star animation
document.addEventListener('DOMContentLoaded', function() {
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        const numberOfStars = 100; // يمكنك تعديل عدد النجوم هنا
        for (let i = 0; i < numberOfStars; i++) {
            let star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 3 + 1; // حجم النجمة بين 1px و 4px
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            star.style.animationDuration = `${Math.random() * 10 + 5}s`; // مدة الحركة بين 5s و 15s
            starsContainer.appendChild(star);
        }
    }
});

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
    console.log('Attempting to connect wallet...');
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask/Trust Wallet (window.ethereum) is detected.');
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            alert(`Wallet connected: ${account}`);
            console.log(`Wallet successfully connected: ${account}`);
            // Populate the wallet address field in the airdrop form if it exists
            const walletAddressInput = document.getElementById('walletAddress');
            if (walletAddressInput) {
                walletAddressInput.value = account;
            }
        } catch (error) {
            console.error("Error connecting wallet: ", error);
            if (error.code === 4001) {
                alert("Wallet connection rejected by user.");
            } else {
                alert("Failed to connect wallet. Please make sure MetaMask or Trust Wallet is installed and unlocked. Check console for details.");
            }
        }
    } else {
        alert("No Ethereum wallet (like MetaMask or Trust Wallet) detected. Please install one to connect your wallet.");
        console.log('No Ethereum wallet (window.ethereum) is detected.');
    }
};

if (connectWalletBtn) {
    connectWalletBtn.addEventListener('click', connectWallet);
}

if (claimTokensBtn) {
    claimTokensBtn.addEventListener('click', connectWallet);
}

// Airdrop Form Submission Handling
// The following section for local storage and airdropParticipants array is removed
// as Firebase Firestore is now handling participant storage directly in airdrop.html.

// Leaderboard functionality
const viewLeaderboardBtn = document.getElementById('viewLeaderboardBtn');
if (viewLeaderboardBtn) {
    viewLeaderboardBtn.addEventListener('click', () => {
        console.log('View Leaderboard button clicked.'); // Debugging line
        document.querySelector('.airdrop-leaderboard').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = ''; // Clear existing entries

    // Sort participants by points in descending order
    const sortedParticipants = [...airdropParticipants].sort((a, b) => b.points - a.points);

    // Add new entries
    sortedParticipants.forEach((participant, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${participant.address}</td>
            <td>${participant.telegram}</td>
            <td>5000 KSHR</td>
        `;
        leaderboardList.appendChild(row);
    });
}
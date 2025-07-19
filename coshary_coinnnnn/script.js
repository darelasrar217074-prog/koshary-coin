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
        console.log('Attempting to connect wallet...');
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask (window.ethereum) is detected.');
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                alert(`Wallet connected: ${account}`);
                console.log(`Wallet successfully connected: ${account}`);
                // You can add further logic here, e.g., display connected address, enable claim button
            } catch (error) {
                console.error("Error connecting wallet: ", error);
                if (error.code === 4001) {
                    alert("Wallet connection rejected by user.");
                } else {
                    alert("Failed to connect wallet. Please make sure MetaMask is installed and unlocked. Check console for details.");
                }
            }
        } else {
            alert("MetaMask is not installed. Please install it to connect your wallet.");
            console.log('MetaMask (window.ethereum) is not detected.');
        }
    };

    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWallet);
    }

    if (claimTokensBtn) {
        claimTokensBtn.addEventListener('click', connectWallet);
    }

    // Airdrop Form Submission Handling
    // Use a global array to store participants for demonstration purposes
    // In a real application, this data would be stored in a database on a backend server.
    let airdropParticipants = [];

    // Load participants from localStorage if available (for persistence across sessions)
    if (localStorage.getItem('airdropParticipants')) {
        airdropParticipants = JSON.parse(localStorage.getItem('airdropParticipants'));
        console.log('Loaded airdrop participants from localStorage:', airdropParticipants); // Debugging line
    }

    // Call updateLeaderboard on page load to display any existing data
    updateLeaderboard(); // Add this line

    const airdropForm = document.getElementById('airdropForm');
    if (airdropForm) {
        airdropForm.addEventListener('submit', async (e) => {
            e.preventDefault();
    
            const walletAddress = document.getElementById('walletAddress').value;
            const telegramUsername = document.getElementById('telegramUsername').value;
            const twitterUsername = document.getElementById('twitterUsername').value;
    
            // Basic validation
            if (!walletAddress || !telegramUsername || !twitterUsername) {
                alert('Please fill in all fields.');
                return;
            }

            // Check for duplicate wallet address
            const isDuplicate = airdropParticipants.some(participant => participant.address === walletAddress);
            if (isDuplicate) {
                alert('This wallet address has already participated in the airdrop.');
                return;
            }

            // Add new participant to the array
            const newParticipant = {
                address: walletAddress,
                telegram: telegramUsername,
                twitter: twitterUsername,
                points: Math.floor(Math.random() * 1000) + 500, // Assign random points for demonstration
                registrationTime: new Date().toISOString() // Add registration time
            };
            airdropParticipants.push(newParticipant);

            // Save updated participants to localStorage
            localStorage.setItem('airdropParticipants', JSON.stringify(airdropParticipants));
            console.log('Saved airdrop participants to localStorage:', airdropParticipants); // Debugging line

            console.log('Airdrop Submission:', newParticipant);
            alert('Airdrop submission successful! You will be notified of the next steps.');
            airdropForm.reset();
            updateLeaderboard(); // Update leaderboard after submission
        });
    }

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
        console.log('updateLeaderboard function called.'); // Debugging line
        const leaderboardList = document.getElementById('leaderboardList');
        if (!leaderboardList) {
            console.log('leaderboardList element not found.'); // Debugging line
            return;
        }

        // Sort participants by points (descending)
        const sortedParticipants = [...airdropParticipants].sort((a, b) => b.points - a.points);
        console.log('Sorted participants:', sortedParticipants); // Debugging line

        // Clear existing entries
        leaderboardList.innerHTML = '';

        // Add new entries
        sortedParticipants.forEach((participant, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="rank-cell">${index + 1}</td>
                <td class="wallet-cell">${participant.address}</td>
                <td class="telegram-cell">@${participant.telegram}</td>
                <td class="twitter-cell">@${participant.twitter}</td>
                <td class="points-cell">${participant.points}</td>
            `;
            leaderboardList.appendChild(row);
        });
        console.log('Leaderboard updated.'); // Debugging line
    }
});
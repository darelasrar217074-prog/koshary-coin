// Import the Thirdweb SDK and ethers
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

// Initialize the Thirdweb SDK
// You can set this to your desired network, e.g., "goerli", "polygon", "mainnet"
const activeChain = "goerli"; // يمكنك تغيير هذه السلسلة حسب شبكتك

let sdk;
let walletConnected = false; // New variable to track wallet connection status
let currentAccount = null; // New variable to store the connected account

// Function to initialize SDK after wallet connection
const initializeSDK = async (signer) => {
    if (!signer) {
        console.error("No signer available to initialize SDK.");
        sdk = null; // Ensure SDK is null if no signer
        return;
    }
    try {
        sdk = ThirdwebSDK.fromSigner(signer, activeChain);
        console.log("Thirdweb SDK initialized.", sdk);
    } catch (error) {
        console.error("Error initializing Thirdweb SDK:", error);
        sdk = null; // Set SDK to null on error
    }
};

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
    const walletStatusElement = document.getElementById('wallet-status'); // New element for status display

    const updateWalletStatus = () => {
        if (walletStatusElement) {
            if (walletConnected && currentAccount) {
                walletStatusElement.textContent = `Wallet Connected: ${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`;
                walletStatusElement.style.color = 'green';
            } else {
                walletStatusElement.textContent = 'Wallet Not Connected';
                walletStatusElement.style.color = 'red';
            }
        }
    };

    const connectWallet = async () => {
        console.log('Attempting to connect wallet...');
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask/Trust Wallet (window.ethereum) is detected.');
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const signer = provider.getSigner();
                currentAccount = accounts[0];
                walletConnected = true;
                alert(`Wallet connected: ${currentAccount}`);
                console.log(`Wallet successfully connected: ${currentAccount}`);
                // Populate the wallet address field in the airdrop form if it exists
                const walletAddressInput = document.getElementById('walletAddress');
                if (walletAddressInput) {
                    walletAddressInput.value = currentAccount;
                }
                await initializeSDK(signer);
                updateWalletStatus();

                // Listen for account changes
                window.ethereum.on('accountsChanged', async (newAccounts) => {
                    if (newAccounts.length > 0) {
                        currentAccount = newAccounts[0];
                        walletConnected = true;
                        const newSigner = provider.getSigner();
                        await initializeSDK(newSigner);
                        console.log(`Account changed to: ${currentAccount}`);
                    } else {
                        // No accounts connected, disconnect wallet
                        disconnectWallet();
                        console.log('No accounts found, wallet disconnected.');
                    }
                    updateWalletStatus();
                });

                // Listen for network changes
                window.ethereum.on('chainChanged', (chainId) => {
                    console.log(`Network changed to chainId: ${chainId}`);
                    // You might want to re-initialize SDK or prompt user to switch to Goerli
                    alert("Network changed. Please ensure you are on the Goerli network.");
                    // Re-initialize SDK with the current signer if available
                    if (walletConnected && currentAccount) {
                        const newSigner = provider.getSigner();
                        initializeSDK(newSigner);
                    }
                });

            } catch (error) {
                console.error("Error connecting wallet: ", error);
                walletConnected = false;
                currentAccount = null;
                sdk = null;
                if (error.code === 4001) {
                    alert("Wallet connection rejected by user.");
                } else {
                    alert("Failed to connect wallet. Please make sure MetaMask or Trust Wallet is installed and unlocked. Check console for details.");
                }
                updateWalletStatus();
            }
        } else {
            alert("No Ethereum wallet (like MetaMask or Trust Wallet) detected. Please install one to connect your wallet.");
            console.log('No Ethereum wallet (window.ethereum) is detected.');
            walletConnected = false;
            currentAccount = null;
            sdk = null;
            updateWalletStatus();
        }
    };

    const disconnectWallet = () => {
        walletConnected = false;
        currentAccount = null;
        sdk = null;
        alert("Wallet disconnected.");
        console.log("Wallet disconnected.");
        updateWalletStatus();
    };

    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWallet);
    }

    // Initial status update
    updateWalletStatus();

    if (claimTokensBtn) {
        claimTokensBtn.addEventListener('click', connectWallet);
    }

    // Add Minting and Claiming Functions
    const mintButtons = document.querySelectorAll('.mint-btn');
    const claimButtons = document.querySelectorAll('.claim-btn');

    // Function to mint NFT
    async function mintNFT(contractAddress) {
        if (!sdk || !walletConnected) {
            console.error("Thirdweb SDK not initialized or wallet not connected. Please connect wallet first.");
            alert("Please connect your wallet first.");
            return;
        }
        try {
            const contract = await sdk.getContract(contractAddress);
            // استدعاء وظيفة mint. تأكد من أن هذه الوظيفة لا تتطلب أي معلمات أو قم بتمريرها إذا لزم الأمر.
            const transaction = await contract.call("mint"); 
            console.log("Mint transaction successful:", transaction);
            alert("NFT Minted Successfully!");
        } catch (error) {
            console.error("Error minting NFT:", error);
            alert("Error minting NFT. Check console for details.");
        }
    }
    
    // Function to claim tokens
    async function claimTokens(contractAddress) {
        if (!sdk || !walletConnected) {
            console.error("Thirdweb SDK not initialized or wallet not connected. Please connect wallet first.");
            alert("Please connect your wallet first.");
            return;
        }
        try {
            const contract = await sdk.getContract(contractAddress);
            // استدعاء وظيفة claim. تأكد من أن هذه الوظيفة لا تتطلب أي معلمات أو قم بتمريرها إذا لزم الأمر.
            const transaction = await contract.call("claim"); 
            console.log("Claim transaction successful:", transaction);
            alert("Tokens Claimed Successfully!");
        } catch (error) {
            console.error("Error claiming tokens:", error);
            alert("Error claiming tokens. Check console for details.");
        }
    }

    // Attach event listeners to all elements with class 'mint-btn'
    document.querySelectorAll('.mint-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const contractAddress = button.dataset.contractAddress || '0x15C8d532eeD7BeA4ba84945AAC4408192c7Bb94C'; // استخدم العنوان الذي قدمته
            await mintNFT(contractAddress);
        });
    });

    // Attach event listeners to all elements with class 'claim-btn'
    document.querySelectorAll('.claim-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const contractAddress = button.dataset.contractAddress || '0x15C8d532eeD7BeA4ba84945AAC4408192c7Bb94C'; // استخدم العنوان الذي قدمته
            await claimTokens(contractAddress);
        });
    });
});

// Star animation (duplicate, can be removed if the one inside DOMContentLoaded is sufficient)
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

// Scroll Animation (duplicate, can be removed if the one inside DOMContentLoaded is sufficient)
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

// Wallet Connection Logic (duplicate, can be removed if the one inside DOMContentLoaded is sufficient)
const connectWalletBtn = document.querySelector('.connect-wallet-btn');
const claimTokensBtn = document.getElementById('claimTokensBtn');

const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
        alert('الرجاء تثبيت MetaMask أولاً');
        return;
    }
    
    try {
        // طلب تبديل الشبكة إلى BSC
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [bscChain]
        });
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // التحقق من أن الشبكة هي BSC (ChainId = 56)
        const network = await provider.getNetwork();
        if (network.chainId !== 56) {
            alert('الرجاء التبديل إلى شبكة BSC في MetaMask');
            return;
        }
        
        const signer = provider.getSigner();
        sdk = ThirdwebSDK.fromSigner(signer, "binance");
        
        console.log('Connected to BSC:', accounts[0]);
        alert(`تم الاتصال بالمحفظة على شبكة BSC: ${accounts[0].substring(0, 6)}...`);
        
    } catch (error) {
        console.error('Error:', error);
        alert(`خطأ في الاتصال: ${error.message}`);
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

document.querySelector('.explore-btn').addEventListener('click', function() {
    // يمكنك إضافة تأثيرات إضافية هنا قبل الانتقال للصفحة
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
});
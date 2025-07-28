const player1HealthBar = document.getElementById('player1-health-bar');
const player2HealthBar = document.getElementById('player2-health-bar');
const player1HealthText = document.getElementById('player1-health-text');
const player2HealthText = document.getElementById('player2-health-text');
const gameMessages = document.getElementById('game-messages');
const attackButton = document.getElementById('attack-button');
const player1Image = document.getElementById('player1-image');
const player2Image = document.getElementById('player2-image');

// Define NFT characters with their properties, including special attacks
const nftCharacters = {
    'character1': {
        name: 'NFT Character 1',
        maxHealth: 100,
        attackPower: 15,
        image: 'images/nft-images/1.png',
        specialAttack: {
            name: 'Fireball',
            damage: 30,
            cooldown: 3,
            currentCooldown: 0
        }
    },
    'character2': {
        name: 'NFT Character 2',
        maxHealth: 120,
        attackPower: 10,
        image: 'images/nft-images/2.png',
        specialAttack: {
            name: 'Ice Shard',
            damage: 25,
            cooldown: 2,
            currentCooldown: 0
        }
    },
    'character3': {
        name: 'NFT Character 3',
        maxHealth: 90,
        attackPower: 20,
        image: 'images/nft-images/3.png',
        specialAttack: {
            name: 'Lightning Strike',
            damage: 35,
            cooldown: 4,
            currentCooldown: 0
        }
    }
    // Add more characters as needed
};

let players = {};
let currentPlayer = 1;

function initGame() {
    // Initialize players with their active character and a list of available characters
    players = {
        1: {
            name: 'Player 1',
            characters: [nftCharacters.character1, nftCharacters.character2, nftCharacters.character3],
            activeCharacter: nftCharacters.character1, // Default active character
            currentHealth: nftCharacters.character1.maxHealth
        },
        2: {
            name: 'Player 2',
            characters: [nftCharacters.character2, nftCharacters.character1, nftCharacters.character3],
            activeCharacter: nftCharacters.character2, // Default active character
            currentHealth: nftCharacters.character2.maxHealth
        }
    };

    updateHealthBars();
    logMessage('Game started! Player 1 attacks first.');
    attackButton.disabled = false;

    // Set initial character images
    player1Image.src = players[1].activeCharacter.image;
    player2Image.src = players[2].activeCharacter.image;

    // Add character switching buttons (will be added in HTML later)
    // For now, we'll just log the active character
    logMessage(`Player 1 active character: ${players[1].activeCharacter.name}`);
    logMessage(`Player 2 active character: ${players[2].activeCharacter.name}`);
}

function aiDecision() {
    const aiPlayer = players[2];
    const humanPlayer = players[1];
    
    // 70% chance to use normal attack
    // 30% chance to use special attack if available
    if (aiPlayer.activeCharacter.specialAttack.currentCooldown === 0 && Math.random() < 0.3) {
        handleSpecialAttack();
    } else {
        handleAttack();
    }
}

function handleTurn() {
    if (currentPlayer === 2) {
        // AI's turn
        setTimeout(aiDecision, 1000); // Add slight delay for realism
    }
    // Human player's turn remains manual
}

// Modify existing attack functions to call handleTurn() after each move
function handleAttack() {
    const attacker = players[currentPlayer];
    const defender = players[currentPlayer === 1 ? 2 : 1];

    const damage = attacker.activeCharacter.attackPower;
    defender.currentHealth -= damage;

    logMessage(`${attacker.name}'s ${attacker.activeCharacter.name} attacks ${defender.name}'s ${defender.activeCharacter.name} for ${damage} damage.`);

    updateHealthBars();

    if (defender.currentHealth <= 0) {
        endGame(attacker);
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        logMessage(`It's ${players[currentPlayer].name}'s turn.`);
    }
    handleTurn(); // Add this line at the end
}

function handleSpecialAttack() {
    const attacker = players[currentPlayer];
    const defender = players[currentPlayer === 1 ? 2 : 1];
    const specialAttack = attacker.activeCharacter.specialAttack;

    if (specialAttack.currentCooldown === 0) {
        const damage = specialAttack.damage;
        defender.currentHealth -= damage;

        logMessage(`${attacker.name}'s ${attacker.activeCharacter.name} uses ${specialAttack.name} for ${damage} special damage!`);

        specialAttack.currentCooldown = specialAttack.cooldown;
        updateHealthBars();

        if (defender.currentHealth <= 0) {
            endGame(attacker);
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            logMessage(`It's ${players[currentPlayer].name}'s turn.`);
        }
    } else {
        logMessage(`${specialAttack.name} is on cooldown. ${specialAttack.currentCooldown} turns remaining.`);
    }

    // Decrease cooldown for all special attacks at the end of the turn
    for (const playerKey in players) {
        const player = players[playerKey];
        for (const char of player.characters) {
            if (char.specialAttack && char.specialAttack.currentCooldown > 0) {
                char.specialAttack.currentCooldown--;
            }
        }
    }
}

function switchCharacter(playerNum, characterName) {
    const player = players[playerNum];
    const newCharacter = player.characters.find(char => char.name === characterName);

    if (newCharacter && newCharacter !== player.activeCharacter) {
        player.activeCharacter = newCharacter;
        player.currentHealth = newCharacter.maxHealth; // Reset health when switching
        logMessage(`${player.name} switched to ${newCharacter.name}. Health reset to ${newCharacter.maxHealth}.`);
        updateHealthBars();
        // Update image based on playerNum
        if (playerNum === 1) {
            player1Image.src = newCharacter.image;
        } else {
            player2Image.src = newCharacter.image;
        }
    } else if (newCharacter === player.activeCharacter) {
        logMessage(`${player.name} already has ${newCharacter.name} active.`);
    } else {
        logMessage(`Character ${characterName} not found for ${player.name}.`);
    }
}

function updateHealthBars() {
    const p1Health = players[1].currentHealth;
    const p2Health = players[2].currentHealth;

    const p1MaxHealth = players[1].activeCharacter.maxHealth;
    const p2MaxHealth = players[2].activeCharacter.maxHealth;

    player1HealthBar.style.width = (p1Health / p1MaxHealth) * 100 + '%';
    player2HealthBar.style.width = (p2Health / p2MaxHealth) * 100 + '%';

    player1HealthText.textContent = `Health: ${Math.max(0, p1Health)} / ${p1MaxHealth}`;
    player2HealthText.textContent = `Health: ${Math.max(0, p2Health)} / ${p2MaxHealth}`;
}

function logMessage(message) {
    const p = document.createElement('p');
    p.textContent = message;
    gameMessages.appendChild(p);
    gameMessages.scrollTop = gameMessages.scrollHeight; // Auto-scroll to bottom
}

function endGame(winner) {
    logMessage(`${winner.name}'s ${winner.activeCharacter.name} wins the game!`);
    attackButton.disabled = true;
    // Optionally add a restart button or other end-game logic
}

attackButton.addEventListener('click', handleAttack);

document.getElementById('special-attack-button').addEventListener('click', handleSpecialAttack);

document.getElementById('player1-char1-button').addEventListener('click', () => switchCharacter(1, 'NFT Character 1'));
document.getElementById('player1-char2-button').addEventListener('click', () => switchCharacter(1, 'NFT Character 2'));
document.getElementById('player1-char3-button').addEventListener('click', () => switchCharacter(1, 'NFT Character 3'));

document.getElementById('player2-char1-button').addEventListener('click', () => switchCharacter(2, 'NFT Character 1'));
document.getElementById('player2-char2-button').addEventListener('click', () => switchCharacter(2, 'NFT Character 2'));
document.getElementById('player2-char3-button').addEventListener('click', () => switchCharacter(2, 'NFT Character 3'));

document.addEventListener('DOMContentLoaded', initGame);
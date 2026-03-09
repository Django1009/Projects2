// Cataclysm: Dark Days Ahead - Core Game Logic

// Game Configuration
const MAP_WIDTH = 80;
const MAP_HEIGHT = 24;
const VIEW_DISTANCE = 10;

// Game State
let gameState = {
    player: {
        x: 40,
        y: 12,
        health: 100,
        maxHealth: 100,
        hunger: 0,
        thirst: 0,
        fatigue: 0,
        inventory: [],
        equipped: null
    },
    map: [],
    turn: 0,
    messages: []
};

// Terrain Types
const TERRAIN = {
    GRASS: { symbol: '.', color: 'grass', name: 'grass' },
    DIRT: { symbol: ',', color: 'dirt', name: 'dirt' },
    ROAD: { symbol: '#', color: 'road', name: 'road' },
    TREE: { symbol: '♣', color: 'tree', name: 'tree', blocks: true },
    WALL: { symbol: '█', color: 'wall', name: 'wall', blocks: true },
    DOOR: { symbol: '▬', color: 'door', name: 'door' },
    WINDOW: { symbol: '□', color: 'window', name: 'window' }
};

// Items
const ITEMS = {
    'canned_food': { symbol: '%', name: 'canned food', color: 'item', type: 'food', nutrition: 50 },
    'water_bottle': { symbol: '~', name: 'water bottle', color: 'item', type: 'drink', hydration: 50 },
    'knife': { symbol: '/', name: 'knife', color: 'item', type: 'weapon', damage: 15 },
    'baseball_bat': { symbol: '/', name: 'baseball bat', color: 'item', type: 'weapon', damage: 20 },
    'backpack': { symbol: '(', name: 'backpack', color: 'item', type: 'container', capacity: 20 },
    'first_aid_kit': { symbol: '+', name: 'first aid kit', color: 'item', type: 'medical', healing: 30 }
};

// Creatures
const CREATURES = {
    'zombie': { symbol: 'Z', color: 'zombie', name: 'zombie', health: 30, damage: 8 },
    'skeleton': { symbol: 'S', color: 'skeleton', name: 'skeleton', health: 20, damage: 6 }
};

// Initialize Game
function initGame() {
    generateMap();
    placeItems();
    placeCreatures();
    setupEventListeners();
    render();
    addMessage("Welcome to Cataclysm: Dark Days Ahead!", "important");
    addMessage("There's a building to the north and south with doors (▬).", "important");
    addMessage("Use numpad or arrow keys to move. Press 'g' to pickup items.");
}

// Generate Random Map
function generateMap() {
    gameState.map = [];

    for (let y = 0; y < MAP_HEIGHT; y++) {
        gameState.map[y] = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            let terrain = TERRAIN.GRASS;

            // Create a building in the center area FIRST (before other terrain)
            if (x >= 30 && x <= 50 && y >= 5 && y <= 18) {
                if (x === 30 || x === 50 || y === 5 || y === 18) {
                    terrain = TERRAIN.WALL;
                } else if ((x === 40 && y === 5) || (x === 40 && y === 18)) {
                    terrain = TERRAIN.DOOR;
                } else {
                    terrain = TERRAIN.DIRT;
                }
            }
            // Create some roads (avoiding building area)
            else if (Math.random() < 0.05) {
                terrain = TERRAIN.ROAD;
            }
            // Create some trees (avoiding building area)
            else if (Math.random() < 0.1) {
                terrain = TERRAIN.TREE;
            }

            gameState.map[y][x] = {
                terrain: terrain,
                items: [],
                creature: null
            };
        }
    }

    // Debug: Log door positions
    console.log('Door positions:');
    for (let y = 5; y <= 18; y++) {
        for (let x = 30; x <= 50; x++) {
            if (gameState.map[y][x].terrain === TERRAIN.DOOR) {
                console.log(`Door at (${x}, ${y})`);
            }
        }
    }
}

// Place Random Items
function placeItems() {
    const itemTypes = Object.keys(ITEMS);
    for (let i = 0; i < 15; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * MAP_WIDTH);
            y = Math.floor(Math.random() * MAP_HEIGHT);
        } while (gameState.map[y][x].terrain.blocks ||
                gameState.map[y][x].terrain === TERRAIN.DOOR ||
                (x >= 30 && x <= 50 && y >= 5 && y <= 18)); // Avoid building interior

        const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        gameState.map[y][x].items.push({
            ...ITEMS[itemType],
            id: Date.now() + Math.random()
        });
    }
}

// Place Random Creatures
function placeCreatures() {
    const creatureTypes = Object.keys(CREATURES);
    for (let i = 0; i < 5; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * MAP_WIDTH);
            y = Math.floor(Math.random() * MAP_HEIGHT);
        } while (gameState.map[y][x].terrain.blocks ||
                gameState.map[y][x].terrain === TERRAIN.DOOR ||
                (x >= 30 && x <= 50 && y >= 5 && y <= 18) || // Avoid building
                (Math.abs(x - gameState.player.x) < 5 && Math.abs(y - gameState.player.y) < 5));

        const creatureType = creatureTypes[Math.floor(Math.random() * creatureTypes.length)];
        gameState.map[y][x].creature = {
            ...CREATURES[creatureType],
            id: Date.now() + Math.random(),
            x: x,
            y: y
        };
    }
}

// Movement Keys
const MOVEMENT_KEYS = {
    'ArrowUp': { dx: 0, dy: -1 },
    'ArrowDown': { dx: 0, dy: 1 },
    'ArrowLeft': { dx: -1, dy: 0 },
    'ArrowRight': { dx: 1, dy: 0 },
    '8': { dx: 0, dy: -1 },    // Numpad
    '2': { dx: 0, dy: 1 },
    '4': { dx: -1, dy: 0 },
    '6': { dx: 1, dy: 0 },
    '7': { dx: -1, dy: -1 },   // Diagonals
    '9': { dx: 1, dy: -1 },
    '1': { dx: -1, dy: 1 },
    '3': { dx: 1, dy: 1 }
};

// Event Listeners
function setupEventListeners() {
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        // Movement
        if (MOVEMENT_KEYS[key]) {
            event.preventDefault();
            const movement = MOVEMENT_KEYS[key];
            movePlayer(movement.dx, movement.dy);
        }

        // Pickup items
        else if (key === 'g' || key === 'G') {
            event.preventDefault();
            pickupItems();
        }

        // Inventory
        else if (key === 'i' || key === 'I') {
            event.preventDefault();
            showInventory();
        }

        // Use item
        else if (key >= 'a' && key <= 'z') {
            event.preventDefault();
            useItem(key);
        }
    });
}

// Move Player
function movePlayer(dx, dy) {
    const newX = gameState.player.x + dx;
    const newY = gameState.player.y + dy;

    // Check bounds
    if (newX < 0 || newX >= MAP_WIDTH || newY < 0 || newY >= MAP_HEIGHT) {
        return;
    }

    // Check if terrain blocks movement
    if (gameState.map[newY][newX].terrain.blocks) {
        addMessage("You can't move there!");
        return;
    }

    // Check for creatures
    if (gameState.map[newY][newX].creature) {
        attackCreature(gameState.map[newY][newX].creature);
        return;
    }

    // Move player
    gameState.player.x = newX;
    gameState.player.y = newY;

    // Update game state
    gameState.turn++;
    updatePlayerStats();
    moveCreatures();

    render();
}

// Attack Creature
function attackCreature(creature) {
    const damage = gameState.player.equipped ? gameState.player.equipped.damage : 5;
    creature.health -= damage;

    addMessage(`You attack the ${creature.name} for ${damage} damage!`, "danger");

    if (creature.health <= 0) {
        addMessage(`You killed the ${creature.name}!`);
        gameState.map[creature.y][creature.x].creature = null;
    } else {
        // Creature attacks back
        const creatureDamage = creature.damage;
        gameState.player.health -= creatureDamage;
        addMessage(`The ${creature.name} hits you for ${creatureDamage} damage!`, "danger");
    }
}

// Move Creatures (simple AI)
function moveCreatures() {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tile = gameState.map[y][x];
            if (tile.creature) {
                // Simple movement towards player
                const dx = Math.sign(gameState.player.x - x);
                const dy = Math.sign(gameState.player.y - y);

                const newX = x + dx;
                const newY = y + dy;

                if (newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT &&
                    !gameState.map[newY][newX].terrain.blocks &&
                    !gameState.map[newY][newX].creature &&
                    !(newX === gameState.player.x && newY === gameState.player.y)) {

                    // Move creature
                    gameState.map[newY][newX].creature = tile.creature;
                    gameState.map[newY][newX].creature.x = newX;
                    gameState.map[newY][newX].creature.y = newY;
                    tile.creature = null;
                }
            }
        }
    }
}

// Pickup Items
function pickupItems() {
    const tile = gameState.map[gameState.player.y][gameState.player.x];
    if (tile.items.length > 0) {
        const item = tile.items.pop();
        gameState.player.inventory.push(item);
        addMessage(`You picked up ${item.name}.`);
        render();
    } else {
        addMessage("There's nothing here to pick up.");
    }
}

// Use Item
function useItem(key) {
    const index = key.charCodeAt(0) - 'a'.charCodeAt(0);
    if (index >= 0 && index < gameState.player.inventory.length) {
        const item = gameState.player.inventory[index];

        if (item.type === 'food') {
            gameState.player.hunger = Math.max(0, gameState.player.hunger - item.nutrition);
            gameState.player.inventory.splice(index, 1);
            addMessage(`You eat the ${item.name}.`);
        } else if (item.type === 'drink') {
            gameState.player.thirst = Math.max(0, gameState.player.thirst - item.hydration);
            gameState.player.inventory.splice(index, 1);
            addMessage(`You drink from the ${item.name}.`);
        } else if (item.type === 'weapon') {
            gameState.player.equipped = item;
            addMessage(`You equip the ${item.name}.`);
        } else if (item.type === 'medical') {
            gameState.player.health = Math.min(gameState.player.maxHealth, gameState.player.health + item.healing);
            gameState.player.inventory.splice(index, 1);
            addMessage(`You use the ${item.name} and heal ${item.healing} HP.`);
        }

        render();
    }
}

// Update Player Stats
function updatePlayerStats() {
    gameState.player.hunger += 1;
    gameState.player.thirst += 1;
    gameState.player.fatigue += 0.5;

    // Check for death conditions
    if (gameState.player.health <= 0) {
        addMessage("You have died!", "danger");
    }
    if (gameState.player.hunger >= 100) {
        gameState.player.health -= 5;
        addMessage("You're starving!", "danger");
    }
    if (gameState.player.thirst >= 100) {
        gameState.player.health -= 5;
        addMessage("You're dehydrated!", "danger");
    }
}

// Add Message to Log
function addMessage(text, type = "normal") {
    gameState.messages.push({ text, type, turn: gameState.turn });
    if (gameState.messages.length > 50) {
        gameState.messages.shift();
    }
}

// Show Inventory
function showInventory() {
    let inventoryText = "";
    gameState.player.inventory.forEach((item, index) => {
        const letter = String.fromCharCode('a'.charCodeAt(0) + index);
        inventoryText += `${letter}) ${item.name}\n`;
    });

    if (inventoryText === "") {
        inventoryText = "Your inventory is empty.";
    }

    addMessage("Inventory:\n" + inventoryText);
}

// Render Game
function render() {
    renderMap();
    renderUI();
}

// Render Map
function renderMap() {
    const gameMap = document.getElementById('game-map');
    gameMap.innerHTML = '';

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tile = document.createElement('div');
            const tileData = gameState.map[y][x];

            tile.className = 'tile';

            // Determine what to display
            let symbol = tileData.terrain.symbol;
            let colorClass = tileData.terrain.color;

            // Check for items
            if (tileData.items.length > 0) {
                symbol = tileData.items[0].symbol;
                colorClass = 'item';
            }

            // Check for creatures
            if (tileData.creature) {
                symbol = tileData.creature.symbol;
                colorClass = tileData.creature.color;
            }

            // Check for player
            if (x === gameState.player.x && y === gameState.player.y) {
                symbol = '@';
                colorClass = 'player';
            }

            tile.className = `tile ${colorClass}`;
            tile.textContent = symbol;
            gameMap.appendChild(tile);
        }
    }
}

// Render UI
function renderUI() {
    // Player Stats
    const statsDiv = document.getElementById('player-stats');
    statsDiv.innerHTML = `
        <div class="stat-line"><span class="stat-label">HP:</span> <span class="stat-value">${gameState.player.health}/${gameState.player.maxHealth}</span></div>
        <div class="stat-line"><span class="stat-label">Hunger:</span> <span class="stat-value">${gameState.player.hunger}</span></div>
        <div class="stat-line"><span class="stat-label">Thirst:</span> <span class="stat-value">${gameState.player.thirst}</span></div>
        <div class="stat-line"><span class="stat-label">Fatigue:</span> <span class="stat-value">${Math.floor(gameState.player.fatigue)}</span></div>
        <div class="stat-line"><span class="stat-label">Turn:</span> <span class="stat-value">${gameState.turn}</span></div>
        <div class="stat-line"><span class="stat-label">Equipped:</span> <span class="stat-value">${gameState.player.equipped ? gameState.player.equipped.name : 'None'}</span></div>
    `;

    // Inventory
    const inventoryDiv = document.getElementById('inventory-list');
    inventoryDiv.innerHTML = '';
    gameState.player.inventory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        const letter = String.fromCharCode('a'.charCodeAt(0) + index);
        itemDiv.textContent = `${letter}) ${item.name}`;
        itemDiv.onclick = () => useItem(letter);
        inventoryDiv.appendChild(itemDiv);
    });

    // Messages
    const messagesDiv = document.getElementById('message-log');
    messagesDiv.innerHTML = '';
    gameState.messages.slice(-10).forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        messageDiv.textContent = message.text;
        messagesDiv.appendChild(messageDiv);
    });
}

// Start the game
initGame();

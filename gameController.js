// ===============================================
// GAME CONTROLLER - UI, eventos y coordinación
// ===============================================

class GameController {
    constructor() {
        this.initializeElements();
        this.initializeGame();
        this.setupEventListeners();
        this.bestScore = localStorage.getItem('pacmanBestScore') || 0;
        this.updateUI();
        this.startGameLoops();
    }

    initializeElements() {
        this.canvas = document.getElementById('gameCanvas');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.gameTimeElement = document.getElementById('gameTime');
        this.levelElement = document.getElementById('level');
        this.bestScoreElement = document.getElementById('bestScore');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.muteBtn = document.getElementById('muteBtn');
        this.appContainer = document.querySelector('.app-container');
    }

    initializeGame() {
        this.gameEngine = new GameEngine();
        this.renderer = new GameRenderer(this.canvas);
        this.renderer.resizeCanvas();
        
        // AI Configuration
        this.aiEnabled = false;
        this.aiLevel = 'medium'; // easy, medium, hard
        this.showDebugInfo = false;
        this.lastAIDecision = null;
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Button controls
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.muteBtn.addEventListener('click', () => this.toggleSound());
        
        // Touch controls
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleDirectionButton(btn.dataset.direction));
        });
        
        // Window resize
        window.addEventListener('resize', () => this.renderer.resizeCanvas());
        
        // AI Toggle (for testing - add button in HTML if needed)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'a' || e.key === 'A') {
                this.toggleAI();
            }
            if (e.key === 'd' || e.key === 'D') {
                this.showDebugInfo = !this.showDebugInfo;
            }
        });
    }

    handleKeyDown(e) {
        if (!this.gameEngine.gameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.gameEngine.pacman.nextDirection = 3;
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.gameEngine.pacman.nextDirection = 1;
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.gameEngine.pacman.nextDirection = 2;
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.gameEngine.pacman.nextDirection = 0;
                break;
            case ' ':
                e.preventDefault();
                this.togglePause();
                break;
        }
    }

    handleDirectionButton(direction) {
        if (!this.gameEngine.gameRunning) return;
        
        switch(direction) {
            case 'up': this.gameEngine.pacman.nextDirection = 3; break;
            case 'down': this.gameEngine.pacman.nextDirection = 1; break;
            case 'left': this.gameEngine.pacman.nextDirection = 2; break;
            case 'right': this.gameEngine.pacman.nextDirection = 0; break;
        }
    }

    togglePause() {
        const isPaused = this.gameEngine.togglePause();
        this.pauseBtn.textContent = isPaused ? 'REANUDAR' : 'PAUSA';
        
        if (isPaused) {
            this.appContainer.classList.add('paused');
        } else {
            this.appContainer.classList.remove('paused');
        }
    }

    restartGame() {
        this.gameEngine.resetGame();
        this.pauseBtn.textContent = 'PAUSA';
        this.appContainer.classList.remove('paused');
        this.updateUI();
    }

    toggleSound() {
        this.gameEngine.soundEnabled = !this.gameEngine.soundEnabled;
        this.muteBtn.textContent = this.gameEngine.soundEnabled ? 'SONIDO' : 'SILENCIO';
    }

    toggleAI() {
        this.aiEnabled = !this.aiEnabled;
        console.log(`AI ${this.aiEnabled ? 'habilitada' : 'deshabilitada'}`);
    }

    updateGameTime() {
        if (!this.gameEngine.gamePaused && this.gameEngine.gameRunning) {
            const elapsed = Math.floor((Date.now() - this.gameEngine.gameStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            this.gameTimeElement.textContent = `${minutes}:${seconds}`;
        }
    }

    updateUI() {
        this.scoreElement.textContent = this.gameEngine.score;
        this.livesElement.textContent = this.gameEngine.lives;
        this.levelElement.textContent = this.gameEngine.level;
        this.bestScoreElement.textContent = this.bestScore;
        
        // Update best score if needed
        if (this.gameEngine.score > this.bestScore) {
            this.bestScore = this.gameEngine.score;
            this.bestScoreElement.textContent = this.bestScore;
            localStorage.setItem('pacmanBestScore', this.bestScore);
        }
    }

    gameLoop() {
        if (!this.gameEngine.gameRunning) return;
        
        // AI Decision Making
        if (this.aiEnabled && !this.gameEngine.gamePaused) {
            this.lastAIDecision = this.makeAIDecision();
            if (this.lastAIDecision) {
                this.gameEngine.pacman.nextDirection = this.lastAIDecision.direction;
            }
        }
        
        // Update game state
        const updateResult = this.gameEngine.update();
        
        if (updateResult) {
            this.updateUI();
            
            // Handle game events
            if (updateResult.collisionResult === 'gameOver') {
                setTimeout(() => {
                    alert(`Game Over! Puntuación final: ${this.gameEngine.score}`);
                    this.restartGame();
                }, 100);
            }
        }
        
        // Render game
        const gameState = this.gameEngine.getGameState();
        this.renderer.render(gameState, this.showDebugInfo, this.lastAIDecision);
        
        setTimeout(() => this.gameLoop(), 200);
    }

    timeLoop() {
        this.updateGameTime();
        setTimeout(() => this.timeLoop(), 1000);
    }

    startGameLoops() {
        this.gameLoop();
        this.timeLoop();
    }

    // ===============================================
    // AI IMPLEMENTATION - Minimax with Alpha-Beta
    // ===============================================

    makeAIDecision() {
        const gameState = this.gameEngine.getGameState();
        const depth = this.getAIDepth();
        
        const startTime = performance.now();
        let nodesEvaluated = 0;
        
        const bestMove = this.minimax(
            gameState, 
            depth, 
            true, 
            -Infinity, 
            Infinity,
            (nodes) => nodesEvaluated = nodes
        );
        
        const endTime = performance.now();
        
        return {
            direction: bestMove.direction,
            score: bestMove.score,
            depth: depth,
            nodesEvaluated: nodesEvaluated,
            timeMs: endTime - startTime
        };
    }

    getAIDepth() {
        switch(this.aiLevel) {
            case 'easy': return 3;
            case 'medium': return 5;
            case 'hard': return 7;
            default: return 5;
        }
    }

    minimax(gameState, depth, isMaximizing, alpha, beta, nodeCounter) {
        nodeCounter(nodeCounter() + 1);
        
        if (depth === 0 || !gameState.gameRunning) {
            return {
                score: this.evaluateGameState(gameState, isMaximizing),
                direction: null
            };
        }

        if (isMaximizing) {
            // Pacman's turn - maximize score
            let maxEval = -Infinity;
            let bestDirection = 0;
            
            const possibleMoves = this.gameEngine.getPossibleMoves(
                gameState.pacman.x, 
                gameState.pacman.y
            );
            
            for (let direction of possibleMoves) {
                const newState = this.simulateMove(gameState, direction, true);
                const evaluation = this.minimax(newState, depth - 1, false, alpha, beta, nodeCounter);
                
                if (evaluation.score > maxEval) {
                    maxEval = evaluation.score;
                    bestDirection = direction;
                }
                
                alpha = Math.max(alpha, evaluation.score);
                if (beta <= alpha) break; // Alpha-beta pruning
            }
            
            return { score: maxEval, direction: bestDirection };
        } else {
            // Ghosts' turn - minimize Pacman's score
            let minEval = Infinity;
            let bestDirection = null;
            
            // Simulate all ghosts moving optimally against Pacman
            const ghostStates = this.simulateOptimalGhostMoves(gameState);
            
            for (let ghostState of ghostStates) {
                const evaluation = this.minimax(ghostState, depth - 1, true, alpha, beta, nodeCounter);
                minEval = Math.min(minEval, evaluation.score);
                beta = Math.min(beta, evaluation.score);
                if (beta <= alpha) break; // Alpha-beta pruning
            }
            
            return { score: minEval, direction: bestDirection };
        }
    }

    simulateMove(gameState, direction, isPacman = true) {
        // Create deep copy of game state
        const newState = JSON.parse(JSON.stringify(gameState));
        
        if (isPacman) {
            // Simulate Pacman move
            const dir = this.gameEngine.directions[direction];
            const newX = newState.pacman.x + dir.dx;
            const newY = newState.pacman.y + dir.dy;
            
            if (this.gameEngine.canMove(newX, newY)) {
                newState.pacman.x = newX;
                newState.pacman.y = newY;
                
                // Handle tunnel
                if (newState.pacman.x < 0) newState.pacman.x = this.gameEngine.COLS - 1;
                if (newState.pacman.x >= this.gameEngine.COLS) newState.pacman.x = 0;
                
                // Collect dots
                if (newState.maze[newState.pacman.y][newState.pacman.x] === 2) {
                    newState.maze[newState.pacman.y][newState.pacman.x] = 0;
                    newState.score += 10;
                } else if (newState.maze[newState.pacman.y][newState.pacman.x] === 3) {
                    newState.maze[newState.pacman.y][newState.pacman.x] = 0;
                    newState.score += 50;
                }
            }
        }
        
        return newState;
    }

    simulateOptimalGhostMoves(gameState) {
        // For simplicity, return a few possible ghost configurations
        const ghostStates = [];
        
        // Current state (ghosts don't move)
        ghostStates.push(JSON.parse(JSON.stringify(gameState)));
        
        // Ghosts move closer to Pacman
        const aggressiveState = JSON.parse(JSON.stringify(gameState));
        aggressiveState.ghosts.forEach(ghost => {
            const bestMove = this.findBestGhostMove(ghost, gameState.pacman);
            if (bestMove !== null) {
                const dir = this.gameEngine.directions[bestMove];
                ghost.x += dir.dx;
                ghost.y += dir.dy;
            }
        });
        ghostStates.push(aggressiveState);
        
        return ghostStates;
    }

    findBestGhostMove(ghost, pacman) {
        const possibleMoves = this.gameEngine.getPossibleMoves(ghost.x, ghost.y);
        let bestMove = null;
        let shortestDistance = Infinity;
        
        for (let direction of possibleMoves) {
            const dir = this.gameEngine.directions[direction];
            const newX = ghost.x + dir.dx;
            const newY = ghost.y + dir.dy;
            
            const distance = this.gameEngine.calculateDistance(
                { x: newX, y: newY }, 
                pacman
            );
            
            if (distance < shortestDistance) {
                shortestDistance = distance;
                bestMove = direction;
            }
        }
        
        return bestMove;
    }

    evaluateGameState(gameState, isMaximizing) {
        let score = gameState.score;
        
        // Game over penalty
        if (!gameState.gameRunning) {
            return isMaximizing ? -1000 : 1000;
        }
        
        // Distance to nearest ghost (negative for closer ghosts)
        let minGhostDistance = Infinity;
        gameState.ghosts.forEach(ghost => {
            const distance = this.gameEngine.calculateDistance(gameState.pacman, ghost);
            minGhostDistance = Math.min(minGhostDistance, distance);
        });
        
        // Penalty for being too close to ghosts
        if (minGhostDistance <= 2) {
            score -= (3 - minGhostDistance) * 50;
        } else if (minGhostDistance <= 4) {
            score -= (5 - minGhostDistance) * 20;
        }
        
        // Reward for collecting dots
        let dotsRemaining = 0;
        gameState.maze.forEach(row => {
            row.forEach(cell => {
                if (cell === 2 || cell === 3) dotsRemaining++;
            });
        });
        
        // Bonus for fewer dots remaining
        score += (240 - dotsRemaining) * 5;
        
        // Distance to nearest dot (reward for being closer)
        const nearestDotDistance = this.findNearestDotDistance(gameState);
        if (nearestDotDistance > 0) {
            score += (20 - nearestDotDistance) * 2;
        }
        
        // Lives value
        score += gameState.lives * 100;
        
        return score;
    }

    findNearestDotDistance(gameState) {
        let minDistance = Infinity;
        
        for (let y = 0; y < this.gameEngine.ROWS; y++) {
            for (let x = 0; x < this.gameEngine.COLS; x++) {
                if (gameState.maze[y][x] === 2 || gameState.maze[y][x] === 3) {
                    const distance = this.gameEngine.calculateDistance(
                        gameState.pacman, 
                        { x, y }
                    );
                    minDistance = Math.min(minDistance, distance);
                }
            }
        }
        
        return minDistance === Infinity ? 0 : minDistance;
    }
}

// ===============================================
// INITIALIZE GAME
// ===============================================

let gameController;

document.addEventListener('DOMContentLoaded', () => {
    gameController = new GameController();
});
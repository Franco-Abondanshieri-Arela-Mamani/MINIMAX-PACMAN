// ===============================================
// GAME ENGINE - Lógica central del juego
// ===============================================

class GameEngine {
    constructor() {
        this.CELL_SIZE = 20;
        this.ROWS = 30;
        this.COLS = 30;
        
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameStartTime = Date.now();
        this.soundEnabled = true;
        
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,1,0,0,1,2,1,0,0,0,1,2,2,1,1,2,2,1,0,0,0,1,2,1,0,0,1,3,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
            [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
            [0,0,0,0,0,1,2,1,1,0,1,1,1,0,0,0,0,1,1,1,0,1,1,2,1,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
            [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
            [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,3,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        this.pacman = {
            x: 15,
            y: 23,
            direction: 0,
            nextDirection: 0,
            mouthOpen: true
        };

        this.ghosts = [
            { x: 15, y: 14, color: '#ff0000', dx: 1, dy: 0, originalX: 15, originalY: 14 },
            { x: 14, y: 14, color: '#ffb8ff', dx: -1, dy: 0, originalX: 14, originalY: 14 },
            { x: 13, y: 14, color: '#00ffff', dx: 0, dy: 1, originalX: 13, originalY: 14 },
            { x: 16, y: 14, color: '#ffb852', dx: 0, dy: -1, originalX: 16, originalY: 14 }
        ];

        this.directions = [
            { dx: 1, dy: 0 },   // 0: right
            { dx: 0, dy: 1 },   // 1: down
            { dx: -1, dy: 0 },  // 2: left
            { dx: 0, dy: -1 }   // 3: up
        ];
    }

    canMove(x, y) {
        if (x < 0 || x >= this.COLS || y < 0 || y >= this.ROWS) return false;
        return this.maze[y][x] !== 1;
    }

    getPossibleMoves(x, y) {
        const moves = [];
        this.directions.forEach((dir, index) => {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            if (this.canMove(newX, newY)) {
                moves.push(index);
            }
        });
        return moves;
    }

    moveEntity(entity, direction) {
        const dir = this.directions[direction];
        const newX = entity.x + dir.dx;
        const newY = entity.y + dir.dy;
        
        if (this.canMove(newX, newY)) {
            entity.x = newX;
            entity.y = newY;
            
            // Handle tunnel teleportation
            if (entity.x < 0) entity.x = this.COLS - 1;
            if (entity.x >= this.COLS) entity.x = 0;
            
            return true;
        }
        return false;
    }

    movePacman() {
        const nextDir = this.directions[this.pacman.nextDirection];
        if (this.canMove(this.pacman.x + nextDir.dx, this.pacman.y + nextDir.dy)) {
            this.pacman.direction = this.pacman.nextDirection;
        }
        
        if (this.moveEntity(this.pacman, this.pacman.direction)) {
            // Check for dots
            if (this.maze[this.pacman.y][this.pacman.x] === 2) {
                this.maze[this.pacman.y][this.pacman.x] = 0;
                this.score += 10;
                return 'dot';
            } else if (this.maze[this.pacman.y][this.pacman.x] === 3) {
                this.maze[this.pacman.y][this.pacman.x] = 0;
                this.score += 50;
                return 'powerPellet';
            }
        }
        return null;
    }

    moveGhosts() {
        this.ghosts.forEach(ghost => {
            const possibleMoves = this.getPossibleMoves(ghost.x, ghost.y);
            if (possibleMoves.length > 0) {
                const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                this.moveEntity(ghost, randomMove);
            }
        });
    }

    checkCollisions() {
        for (let ghost of this.ghosts) {
            if (ghost.x === this.pacman.x && ghost.y === this.pacman.y) {
                this.lives--;
                if (this.lives <= 0) {
                    this.gameRunning = false;
                    return 'gameOver';
                } else {
                    this.resetPacmanPosition();
                    return 'lifeLost';
                }
            }
        }
        return null;
    }

    resetPacmanPosition() {
        this.pacman.x = 15;
        this.pacman.y = 23;
        this.pacman.direction = 0;
        this.pacman.nextDirection = 0;
    }

    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameStartTime = Date.now();
        
        this.resetPacmanPosition();
        
        // Reset ghosts
        this.ghosts.forEach(ghost => {
            ghost.x = ghost.originalX;
            ghost.y = ghost.originalY;
        });
        
        // Reset maze dots
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                if (this.maze[row][col] === 0) {
                    this.maze[row][col] = 2;
                }
            }
        }
        
        // Reset power pellets
        this.maze[3][1] = 3;
        this.maze[3][28] = 3;
        this.maze[23][1] = 3;
        this.maze[23][28] = 3;
    }

    getGameState() {
        return {
            score: this.score,
            lives: this.lives,
            level: this.level,
            gameRunning: this.gameRunning,
            gamePaused: this.gamePaused,
            pacman: { ...this.pacman },
            ghosts: this.ghosts.map(g => ({ ...g })),
            maze: this.maze.map(row => [...row])
        };
    }

    togglePause() {
        this.gamePaused = !this.gamePaused;
        return this.gamePaused;
    }

    calculateDistance(pos1, pos2) {
        return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
    }

    update() {
        if (!this.gameRunning || this.gamePaused) return null;
        
        const moveResult = this.movePacman();
        this.moveGhosts();
        const collisionResult = this.checkCollisions();
        
        this.pacman.mouthOpen = !this.pacman.mouthOpen;
        
        return {
            moveResult,
            collisionResult,
            gameState: this.getGameState()
        };
    }
}
// ===============================================
// GAME RENDERER - Manejo de gráficos y canvas
// ===============================================

class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.CELL_SIZE = 20;
        this.ROWS = 30;
        this.COLS = 30;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawMaze(maze) {
        this.ctx.strokeStyle = '#0000ff';
        this.ctx.lineWidth = 2;
        
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                const x = col * this.CELL_SIZE;
                const y = row * this.CELL_SIZE;
                
                switch (maze[row][col]) {
                    case 1: // Wall
                        this.ctx.fillStyle = '#0000ff';
                        this.ctx.fillRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
                        break;
                    case 2: // Dot
                        this.ctx.fillStyle = '#ffff00';
                        this.ctx.beginPath();
                        this.ctx.arc(x + this.CELL_SIZE/2, y + this.CELL_SIZE/2, 2, 0, Math.PI * 2);
                        this.ctx.fill();
                        break;
                    case 3: // Power pellet
                        this.ctx.fillStyle = '#ffff00';
                        this.ctx.beginPath();
                        this.ctx.arc(x + this.CELL_SIZE/2, y + this.CELL_SIZE/2, 6, 0, Math.PI * 2);
                        this.ctx.fill();
                        break;
                }
            }
        }
    }

    drawPacman(pacman) {
        const x = pacman.x * this.CELL_SIZE + this.CELL_SIZE/2;
        const y = pacman.y * this.CELL_SIZE + this.CELL_SIZE/2;
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        
        if (pacman.mouthOpen) {
            const angle = pacman.direction * Math.PI / 2;
            this.ctx.arc(x, y, this.CELL_SIZE/2 - 2, angle + 0.3, angle - 0.3);
            this.ctx.lineTo(x, y);
        } else {
            this.ctx.arc(x, y, this.CELL_SIZE/2 - 2, 0, Math.PI * 2);
        }
        
        this.ctx.fill();
    }

    drawGhost(ghost) {
        const x = ghost.x * this.CELL_SIZE + this.CELL_SIZE/2;
        const y = ghost.y * this.CELL_SIZE + this.CELL_SIZE/2;
        
        // Ghost body
        this.ctx.fillStyle = ghost.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y - 4, this.CELL_SIZE/2 - 2, Math.PI, 0);
        this.ctx.fillRect(x - this.CELL_SIZE/2 + 2, y - 4, this.CELL_SIZE - 4, this.CELL_SIZE/2);
        
        // Ghost bottom wavy part
        for (let i = 0; i < 3; i++) {
            this.ctx.fillRect(x - this.CELL_SIZE/2 + 2 + i * 4, y + this.CELL_SIZE/2 - 4, 2, 4);
        }
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x - 4, y - 8, 3, 3);
        this.ctx.fillRect(x + 1, y - 8, 3, 3);
        
        // Pupils
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x - 3, y - 7, 1, 1);
        this.ctx.fillRect(x + 2, y - 7, 1, 1);
    }

    drawGhosts(ghosts) {
        ghosts.forEach(ghost => this.drawGhost(ghost));
    }

    drawDebugInfo(gameState, aiDecision = null) {
        if (!aiDecision) return;
        
        // Draw AI decision overlay
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fillRect(10, 10, 200, 80);
        
        this.ctx.fillStyle = '#000';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`AI Decision: ${aiDecision.direction}`, 15, 25);
        this.ctx.fillText(`Score: ${aiDecision.score}`, 15, 40);
        this.ctx.fillText(`Depth: ${aiDecision.depth}`, 15, 55);
        this.ctx.fillText(`Evaluated: ${aiDecision.nodesEvaluated}`, 15, 70);
    }

    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSADO', this.canvas.width/2, this.canvas.height/2);
        this.ctx.textAlign = 'left';
    }

    drawGameOver(score) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2 - 20);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Puntuación Final: ${score}`, this.canvas.width/2, this.canvas.height/2 + 20);
        this.ctx.textAlign = 'left';
    }

    render(gameState, showDebug = false, aiDecision = null) {
        this.clear();
        this.drawMaze(gameState.maze);
        this.drawPacman(gameState.pacman);
        this.drawGhosts(gameState.ghosts);
        
        if (gameState.gamePaused) {
            this.drawPauseOverlay();
        }
        
        if (!gameState.gameRunning) {
            this.drawGameOver(gameState.score);
        }
        
        if (showDebug && aiDecision) {
            this.drawDebugInfo(gameState, aiDecision);
        }
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth - 40;
        const maxSize = Math.min(containerWidth, 600);
        
        this.canvas.style.width = maxSize + 'px';
        this.canvas.style.height = maxSize + 'px';
    }

    // Utility methods for AI visualization
    highlightCell(x, y, color = 'rgba(255, 0, 0, 0.3)') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
    }

    drawPath(path, color = 'rgba(0, 255, 0, 0.5)') {
        if (path.length < 2) return;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        const startX = path[0].x * this.CELL_SIZE + this.CELL_SIZE/2;
        const startY = path[0].y * this.CELL_SIZE + this.CELL_SIZE/2;
        this.ctx.moveTo(startX, startY);
        
        for (let i = 1; i < path.length; i++) {
            const x = path[i].x * this.CELL_SIZE + this.CELL_SIZE/2;
            const y = path[i].y * this.CELL_SIZE + this.CELL_SIZE/2;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.stroke();
    }

    drawEvaluationHeatmap(evaluations) {
        for (let y = 0; y < this.ROWS; y++) {
            for (let x = 0; x < this.COLS; x++) {
                const evaluation = evaluations[y]?.[x];
                if (evaluation !== undefined) {
                    const intensity = Math.min(Math.abs(evaluation) / 100, 1);
                    const color = evaluation > 0 
                        ? `rgba(0, 255, 0, ${intensity * 0.3})`
                        : `rgba(255, 0, 0, ${intensity * 0.3})`;
                    this.highlightCell(x, y, color);
                }
            }
        }
    }
}
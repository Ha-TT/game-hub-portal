
import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 4;

export type Tile = {
    x: number;
    y: number;
    value: number;
    id: string; // Unique ID for React keys and animations
    mergedFrom?: Tile[];
    isNew?: boolean;
};

export type GameState = 'playing' | 'won' | 'over';

export const use2048 = () => {
    const [grid, setGrid] = useState<(Tile | null)[][]>(() => createEmptyGrid());
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem('2048_bestScore') || '0', 10));
    const [gameState, setGameState] = useState<GameState>('playing');
    const [won, setWon] = useState(false);

    useEffect(() => {
        if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem('2048_bestScore', score.toString());
        }
    }, [score, bestScore]);

    function createEmptyGrid() {
        return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    }

    const addRandomTile = useCallback((currentGrid: (Tile | null)[][]) => {
        const emptyCells: { x: number; y: number }[] = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                if (!currentGrid[x][y]) emptyCells.push({ x, y });
            }
        }

        if (emptyCells.length > 0) {
            const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            const newTile: Tile = {
                x,
                y,
                value,
                id: `tile-${Date.now()}-${Math.random()}`,
                isNew: true
            };
            currentGrid[x][y] = newTile;
        }
    }, []);

    const initGame = useCallback(() => {
        const newGrid = createEmptyGrid();
        addRandomTile(newGrid);
        addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameState('playing');
        setWon(false);
    }, [addRandomTile]);

    // Initial load
    useEffect(() => {
        initGame();
    }, [initGame]);

    const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameState === 'over') return;

        setGrid(prevGrid => {
            const nextGrid = prevGrid.map(row => [...row]);
            let moved = false;
            let scoreAdd = 0;
            let gameWonInMove = false;

            // Reset flags
            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    if (nextGrid[i][j]) {
                        nextGrid[i][j] = { ...nextGrid[i][j]!, mergedFrom: undefined, isNew: false };
                    }
                }
            }

            const vector = {
                up: { x: -1, y: 0 },
                down: { x: 1, y: 0 },
                left: { x: 0, y: -1 },
                right: { x: 0, y: 1 }
            }[direction];

            const traverseX = [];
            const traverseY = [];
            for (let i = 0; i < GRID_SIZE; i++) {
                traverseX.push(i);
                traverseY.push(i);
            }
            if (vector.x === 1) traverseX.reverse();
            if (vector.y === 1) traverseY.reverse();

            traverseX.forEach(x => {
                traverseY.forEach(y => {
                    const tile = nextGrid[x][y];
                    if (tile) {
                        // Find farthest position
                        let previous = { x, y };
                        let cell = { x: previous.x + vector.x, y: previous.y + vector.y };

                        while (
                            cell.x >= 0 && cell.x < GRID_SIZE &&
                            cell.y >= 0 && cell.y < GRID_SIZE &&
                            !nextGrid[cell.x][cell.y]
                        ) {
                            previous = cell;
                            cell = { x: previous.x + vector.x, y: previous.y + vector.y };
                        }

                        // Check Merge
                        const nextCell = { x: cell.x, y: cell.y };
                        const nextTile = (
                            nextCell.x >= 0 && nextCell.x < GRID_SIZE &&
                            nextCell.y >= 0 && nextCell.y < GRID_SIZE
                        ) ? nextGrid[nextCell.x][nextCell.y] : null;

                        if (nextTile && nextTile.value === tile.value && !nextTile.mergedFrom) {
                            // Merge
                            const merged: Tile = {
                                x: nextCell.x,
                                y: nextCell.y,
                                value: tile.value * 2,
                                id: `tile-${Date.now()}-${Math.random()}`,
                                mergedFrom: [tile, nextTile]
                            };

                            nextGrid[nextCell.x][nextCell.y] = merged;
                            nextGrid[x][y] = null;

                            // Visual fix/hack: ensuring the source tile 'moves' to the dest before disappearing
                            // In a pure React state, we just replace.
                            // The renderer (component) should handle the 'key' continuity if possible, 
                            // or we rely on the visual 'mergedFrom' to render the underlying tiles.

                            tile.x = nextCell.x; tile.y = nextCell.y; // Update logical pos for smooth slide if we track it? 
                            // Actually React renders snapshot to snapshot. 
                            // To animate: we need the component to see "Oh, tile ID X moved from A to B"
                            // So we shouldn't destroy tile ID X yet?
                            // But here we are creating a NEW tile 'merged'.
                            // The standard way is to keep 'mergedFrom' which contains the Old Tiles.
                            // The Renderer will render 'merged' (scale 0 -> 1) AND the 'mergedFrom' tiles (sliding in).

                            scoreAdd += merged.value;
                            if (merged.value === 2048) gameWonInMove = true;
                            moved = true;
                        } else {
                            // Move to farthest
                            if (x !== previous.x || y !== previous.y) {
                                nextGrid[previous.x][previous.y] = tile;
                                nextGrid[x][y] = null;
                                tile.x = previous.x; tile.y = previous.y;
                                moved = true;
                            }
                        }
                    }
                });
            });

            if (moved) {
                addRandomTile(nextGrid);
                setScore(s => s + scoreAdd);
                if (gameWonInMove && !won) {
                    setWon(true);
                    setGameState('won');
                } else if (checkGameOver(nextGrid)) {
                    setGameState('over');
                }
                return nextGrid;
            }
            return prevGrid;
        });
    }, [gameState, won, addRandomTile]);

    function checkGameOver(currentGrid: (Tile | null)[][]) {
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                if (!currentGrid[x][y]) return false;
            }
        }
        // Check neighbors
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                const val = currentGrid[x][y]!.value;
                const dirs = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
                for (const d of dirs) {
                    const nx = x + d.x, ny = y + d.y;
                    if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                        if (currentGrid[nx][ny]?.value === val) return false;
                    }
                }
            }
        }
        return true;
    }

    return { grid, score, bestScore, gameState, initGame, move };
};

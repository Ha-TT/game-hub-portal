import { useState, useCallback, useEffect, useRef } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES, TetrominoType } from './constants';

export type Cell = { filled: boolean; color: string } | null;
export type Board = Cell[][];

export interface Piece {
    type: TetrominoType;
    shape: number[][];
    color: string;
    x: number;
    y: number;
}

export type GameState = 'playing' | 'paused' | 'over';

const createEmptyBoard = (): Board => {
    return Array.from({ length: BOARD_HEIGHT }, () =>
        Array.from({ length: BOARD_WIDTH }, () => null)
    );
};

const randomTetromino = (): Piece => {
    const types = Object.keys(TETROMINOES) as TetrominoType[];
    const type = types[Math.floor(Math.random() * types.length)];
    const tetromino = TETROMINOES[type];
    return {
        type,
        shape: tetromino.shape.map(row => [...row]),
        color: tetromino.color,
        x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
        y: 0,
    };
};

const rotate = (shape: number[][]): number[][] => {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated: number[][] = [];
    for (let c = 0; c < cols; c++) {
        const newRow: number[] = [];
        for (let r = rows - 1; r >= 0; r--) {
            newRow.push(shape[r][c]);
        }
        rotated.push(newRow);
    }
    return rotated;
};

export const useTetris = () => {
    const [board, setBoard] = useState<Board>(createEmptyBoard);
    const [piece, setPiece] = useState<Piece | null>(null);
    const [nextPiece, setNextPiece] = useState<Piece | null>(null);
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameState, setGameState] = useState<GameState>('playing');
    const [clearingRows, setClearingRows] = useState<number[]>([]);

    const gameLoopRef = useRef<number | null>(null);
    const speedRef = useRef(1000);

    const checkCollision = useCallback((p: Piece, boardState: Board): boolean => {
        for (let row = 0; row < p.shape.length; row++) {
            for (let col = 0; col < p.shape[row].length; col++) {
                if (p.shape[row][col]) {
                    const newX = p.x + col;
                    const newY = p.y + row;
                    if (
                        newX < 0 ||
                        newX >= BOARD_WIDTH ||
                        newY >= BOARD_HEIGHT ||
                        (newY >= 0 && boardState[newY][newX])
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }, []);

    const mergePiece = useCallback((p: Piece, boardState: Board): Board => {
        const newBoard = boardState.map(row => [...row]);
        for (let row = 0; row < p.shape.length; row++) {
            for (let col = 0; col < p.shape[row].length; col++) {
                if (p.shape[row][col]) {
                    const y = p.y + row;
                    const x = p.x + col;
                    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
                        newBoard[y][x] = { filled: true, color: p.color };
                    }
                }
            }
        }
        return newBoard;
    }, []);

    const clearLines = useCallback((boardState: Board): { newBoard: Board; cleared: number; clearingIndices: number[] } => {
        // Find which rows are full (will be cleared)
        const clearingIndices: number[] = [];
        boardState.forEach((row, idx) => {
            if (row.every(cell => cell !== null)) {
                clearingIndices.push(idx);
            }
        });

        const newBoard = boardState.filter(row => row.some(cell => !cell));
        const cleared = BOARD_HEIGHT - newBoard.length;
        while (newBoard.length < BOARD_HEIGHT) {
            newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
        }
        return { newBoard, cleared, clearingIndices };
    }, []);

    const spawnPiece = useCallback(() => {
        const newPiece = nextPiece || randomTetromino();
        const next = randomTetromino();

        setBoard(currentBoard => {
            if (checkCollision(newPiece, currentBoard)) {
                setGameState('over');
                return currentBoard;
            }
            return currentBoard;
        });

        setPiece(newPiece);
        setNextPiece(next);
    }, [nextPiece, checkCollision]);

    const drop = useCallback(() => {
        if (!piece || gameState !== 'playing') return;

        const newPiece = { ...piece, y: piece.y + 1 };

        setBoard(currentBoard => {
            if (checkCollision(newPiece, currentBoard)) {
                // Lock piece - merge it into the board
                const merged = mergePiece(piece, currentBoard);
                const { newBoard, cleared, clearingIndices } = clearLines(merged);

                const spawnNext = (boardToUse: Board) => {
                    const nextP = nextPiece || randomTetromino();
                    const newNext = randomTetromino();

                    if (checkCollision(nextP, boardToUse)) {
                        setGameState('over');
                        setPiece(null);
                    } else {
                        setPiece(nextP);
                        setNextPiece(newNext);
                    }
                };

                if (cleared > 0) {
                    // Trigger animation
                    setClearingRows(clearingIndices);

                    const points = [0, 100, 300, 500, 800][cleared] * level;
                    setScore(s => s + points);
                    setLines(l => {
                        const newLines = l + cleared;
                        setLevel(Math.floor(newLines / 10) + 1);
                        return newLines;
                    });

                    // Hide current piece during animation
                    setPiece(null);

                    // After animation: clear rows, update board, spawn next
                    setTimeout(() => {
                        setClearingRows([]);
                        setBoard(() => {
                            spawnNext(newBoard);
                            return newBoard;
                        });
                    }, 300);

                    // Return merged board (lines still visible for animation)
                    return merged;
                } else {
                    // No lines cleared, spawn immediately
                    spawnNext(newBoard);
                    return newBoard;
                }
            } else {
                setPiece(newPiece);
                return currentBoard;
            }
        });
    }, [piece, gameState, checkCollision, mergePiece, clearLines, nextPiece, level]);

    const moveHorizontal = useCallback((dir: -1 | 1) => {
        if (!piece || gameState !== 'playing') return;

        const newPiece = { ...piece, x: piece.x + dir };
        setBoard(currentBoard => {
            if (!checkCollision(newPiece, currentBoard)) {
                setPiece(newPiece);
            }
            return currentBoard;
        });
    }, [piece, gameState, checkCollision]);

    const rotatePiece = useCallback(() => {
        if (!piece || gameState !== 'playing') return;

        const rotatedShape = rotate(piece.shape);
        const newPiece = { ...piece, shape: rotatedShape };

        setBoard(currentBoard => {
            if (!checkCollision(newPiece, currentBoard)) {
                setPiece(newPiece);
            } else {
                // Wall kick - try shifting left/right
                for (const offset of [-1, 1, -2, 2]) {
                    const kicked = { ...newPiece, x: newPiece.x + offset };
                    if (!checkCollision(kicked, currentBoard)) {
                        setPiece(kicked);
                        return currentBoard;
                    }
                }
            }
            return currentBoard;
        });
    }, [piece, gameState, checkCollision]);

    const hardDrop = useCallback(() => {
        if (!piece || gameState !== 'playing') return;

        setBoard(currentBoard => {
            // Find the lowest valid position
            let newY = piece.y;
            while (!checkCollision({ ...piece, y: newY + 1 }, currentBoard)) {
                newY++;
            }

            // Create the dropped piece at the lowest position
            const droppedPiece = { ...piece, y: newY };

            // Immediately merge and lock
            const merged = mergePiece(droppedPiece, currentBoard);
            const { newBoard, cleared, clearingIndices } = clearLines(merged);

            const spawnNext = (boardToUse: Board) => {
                const nextP = nextPiece || randomTetromino();
                const newNext = randomTetromino();

                if (checkCollision(nextP, boardToUse)) {
                    setGameState('over');
                    setPiece(null);
                } else {
                    setPiece(nextP);
                    setNextPiece(newNext);
                }
            };

            if (cleared > 0) {
                // Trigger animation
                setClearingRows(clearingIndices);

                const points = [0, 100, 300, 500, 800][cleared] * level;
                setScore(s => s + points);
                setLines(l => {
                    const newLines = l + cleared;
                    setLevel(Math.floor(newLines / 10) + 1);
                    return newLines;
                });

                // Hide current piece during animation
                setPiece(null);

                // After animation: clear rows, update board, spawn next
                setTimeout(() => {
                    setClearingRows([]);
                    setBoard(() => {
                        spawnNext(newBoard);
                        return newBoard;
                    });
                }, 300);

                // Return merged board (lines still visible for animation)
                return merged;
            } else {
                // No lines cleared, spawn immediately
                spawnNext(newBoard);
                return newBoard;
            }
        });
    }, [piece, gameState, checkCollision, mergePiece, clearLines, nextPiece, level]);

    const initGame = useCallback(() => {
        setBoard(createEmptyBoard());
        setScore(0);
        setLines(0);
        setLevel(1);
        setGameState('playing');
        speedRef.current = 1000;

        const first = randomTetromino();
        const next = randomTetromino();
        setPiece(first);
        setNextPiece(next);
    }, []);

    const togglePause = useCallback(() => {
        setGameState(s => s === 'playing' ? 'paused' : 'playing');
    }, []);

    // Game loop
    useEffect(() => {
        if (gameState !== 'playing') {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
                gameLoopRef.current = null;
            }
            return;
        }

        speedRef.current = Math.max(100, 1000 - (level - 1) * 100);

        gameLoopRef.current = window.setInterval(() => {
            drop();
        }, speedRef.current);

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [gameState, level, drop]);

    // Initial spawn
    useEffect(() => {
        initGame();
    }, [initGame]);

    // Calculate ghost piece position (where piece would land on hard drop)
    const ghostPiece = (() => {
        if (!piece) return null;
        let ghostY = piece.y;
        while (!checkCollision({ ...piece, y: ghostY + 1 }, board)) {
            ghostY++;
        }
        // Only show ghost if it's different from current position
        if (ghostY === piece.y) return null;
        return { ...piece, y: ghostY };
    })();

    return {
        board,
        piece,
        ghostPiece,
        nextPiece,
        score,
        lines,
        level,
        gameState,
        clearingRows,
        initGame,
        moveHorizontal,
        rotatePiece,
        drop,
        hardDrop,
        togglePause,
    };
};

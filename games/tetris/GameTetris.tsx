import React, { useEffect } from 'react';
import { useTetris } from './useTetris';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES } from './constants';

const GameTetris: React.FC = () => {
    const {
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
    } = useTetris();

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState === 'over') return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    moveHorizontal(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    moveHorizontal(1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    drop();
                    break;
                case 'ArrowUp':
                case 'x':
                    e.preventDefault();
                    rotatePiece();
                    break;
                case ' ':
                    e.preventDefault();
                    hardDrop();
                    break;
                case 'p':
                case 'Escape':
                    e.preventDefault();
                    togglePause();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, moveHorizontal, rotatePiece, drop, hardDrop, togglePause]);

    // Render the board with ghost piece and current piece overlaid
    const renderBoard = () => {
        // Create a display board
        const displayBoard: ({ filled: boolean; color: string; isGhost?: boolean } | null)[][] =
            board.map(row => row.map(cell => cell ? { ...cell } : null));

        // Draw ghost piece first (so actual piece renders on top)
        if (ghostPiece) {
            for (let row = 0; row < ghostPiece.shape.length; row++) {
                for (let col = 0; col < ghostPiece.shape[row].length; col++) {
                    if (ghostPiece.shape[row][col]) {
                        const y = ghostPiece.y + row;
                        const x = ghostPiece.x + col;
                        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH && !displayBoard[y][x]) {
                            displayBoard[y][x] = { filled: true, color: ghostPiece.color, isGhost: true };
                        }
                    }
                }
            }
        }

        // Draw current piece
        if (piece) {
            for (let row = 0; row < piece.shape.length; row++) {
                for (let col = 0; col < piece.shape[row].length; col++) {
                    if (piece.shape[row][col]) {
                        const y = piece.y + row;
                        const x = piece.x + col;
                        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
                            displayBoard[y][x] = { filled: true, color: piece.color };
                        }
                    }
                }
            }
        }

        return displayBoard.map((row, rowIdx) => {
            const isClearing = clearingRows.includes(rowIdx);
            return (
                <div key={rowIdx} className={`flex ${isClearing ? 'animate-line-clear' : ''}`}>
                    {row.map((cell, colIdx) => (
                        <div
                            key={colIdx}
                            className={`w-6 h-6 border border-gray-700/30 transition-all duration-100 ${isClearing
                                    ? 'bg-white'
                                    : cell
                                        ? cell.isGhost
                                            ? `${cell.color} opacity-30`
                                            : cell.color
                                        : 'bg-gray-900/50'
                                }`}
                        />
                    ))}
                </div>
            );
        });
    };

    const renderNextPiece = () => {
        if (!nextPiece) return null;

        return (
            <div className="flex flex-col items-center">
                {nextPiece.shape.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex">
                        {row.map((cell, colIdx) => (
                            <div
                                key={colIdx}
                                className={`w-5 h-5 ${cell ? nextPiece.color : 'bg-transparent'
                                    }`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-center w-full">
            {/* Game Board */}
            <div className="relative">
                <div className="bg-gray-900 p-2 rounded-lg border-4 border-gray-700 shadow-2xl">
                    {renderBoard()}
                </div>

                {/* Overlays */}
                {gameState === 'paused' && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                        <div className="text-center">
                            <p className="text-white text-3xl font-bold mb-4">PAUSED</p>
                            <button
                                onClick={togglePause}
                                className="px-6 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-500"
                            >
                                Resume
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'over' && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg animate-fade-in">
                        <div className="text-center">
                            <p className="text-red-500 text-4xl font-bold mb-2">GAME OVER</p>
                            <p className="text-white text-xl mb-4">Score: {score.toLocaleString()}</p>
                            <button
                                onClick={initGame}
                                className="px-6 py-3 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 transition-colors"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Side Panel */}
            <div className="flex flex-col gap-4 min-w-[150px]">
                {/* Next Piece */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-2">Next</p>
                    <div className="h-16 flex items-center justify-center">
                        {renderNextPiece()}
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="mb-3">
                        <p className="text-gray-400 text-xs font-bold uppercase">Score</p>
                        <p className="text-white text-2xl font-bold">{score.toLocaleString()}</p>
                    </div>
                    <div className="mb-3">
                        <p className="text-gray-400 text-xs font-bold uppercase">Lines</p>
                        <p className="text-cyan-400 text-xl font-bold">{lines}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase">Level</p>
                        <p className="text-purple-400 text-xl font-bold">{level}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-2">Controls</p>
                    <div className="text-gray-300 text-xs space-y-1">
                        <p>← → Move</p>
                        <p>↑ Rotate</p>
                        <p>↓ Soft Drop</p>
                        <p>Space Hard Drop</p>
                        <p>P Pause</p>
                    </div>
                </div>

                {/* Buttons */}
                <button
                    onClick={initGame}
                    className="px-4 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition-colors"
                >
                    New Game
                </button>
                <button
                    onClick={togglePause}
                    disabled={gameState === 'over'}
                    className="px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-500 transition-colors disabled:opacity-50"
                >
                    {gameState === 'paused' ? 'Resume' : 'Pause'}
                </button>
            </div>

            <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 300ms ease-out forwards;
        }
        @keyframes line-clear {
          0% { background-color: white; transform: scaleY(1); }
          50% { background-color: #22d3ee; transform: scaleY(1.1); }
          100% { background-color: white; transform: scaleY(0); opacity: 0; }
        }
        .animate-line-clear {
          animation: line-clear 300ms ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default GameTetris;

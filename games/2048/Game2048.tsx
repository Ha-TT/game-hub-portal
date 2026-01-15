
import React, { useEffect, useRef } from 'react';
import { use2048, Tile } from './use2048';
import { TILE_COLORS, GRID_SIZE } from './constants';

const Game2048: React.FC = () => {
    const { grid, score, bestScore, gameState, initGame, move } = use2048();
    const containerRef = useRef<HTMLDivElement>(null);

    // Keyboard Input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': e.preventDefault(); move('up'); break;
                case 'ArrowDown': e.preventDefault(); move('down'); break;
                case 'ArrowLeft': e.preventDefault(); move('left'); break;
                case 'ArrowRight': e.preventDefault(); move('right'); break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move]);

    // Touch Input
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let touchStartX = 0;
        let touchStartY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 1) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            e.preventDefault();
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStartX || !touchStartY) return;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            if (Math.max(Math.abs(dx), Math.abs(dy)) > 20) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    move(dx > 0 ? 'right' : 'left');
                } else {
                    move(dy > 0 ? 'down' : 'up');
                }
            }
            e.preventDefault();
        };

        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [move]);

    const renderTile = (tile: Tile, isMerging = false) => {
        const gap = 16; // 1rem
        // Use left/top for positioning, transform only for animation
        const cellSize = `calc((100% - ${3 * gap}px) / 4)`;

        return (
            <div
                key={tile.id}
                className="absolute"
                style={{
                    width: cellSize,
                    height: cellSize,
                    left: `calc(${tile.y} * ((100% - ${3 * gap}px) / 4 + ${gap}px))`,
                    top: `calc(${tile.x} * ((100% - ${3 * gap}px) / 4 + ${gap}px))`,
                    transition: 'left 100ms ease-out, top 100ms ease-out',
                    zIndex: tile.mergedFrom ? 20 : 10,
                }}
            >
                {/* Inner div for scale animation without affecting position */}
                <div
                    className={`w-full h-full flex items-center justify-center rounded-lg font-bold ${TILE_COLORS[tile.value] || 'bg-[#3c3a32] text-[#f9f6f2]'} ${tile.isNew ? 'animate-appear' : ''} ${tile.mergedFrom ? 'animate-merge' : ''}`}
                >
                    {tile.value}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[500px] mx-auto">
            {/* HUD */}
            <div className="flex items-center justify-between w-full mb-6">
                <div>
                    <h2 className="text-4xl font-extrabold text-[#776e65] dark:text-gray-200">2048</h2>
                    <p className="text-[#776e65] dark:text-gray-400">Join the tiles, get to 2048!</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-col items-center bg-[#bbada0] px-4 py-2 rounded-md min-w-[80px]">
                        <span className="text-[#eee4da] text-xs font-bold uppercase">Score</span>
                        <span className="text-white font-bold text-xl">{score}</span>
                    </div>
                    <div className="flex flex-col items-center bg-[#bbada0] px-4 py-2 rounded-md min-w-[80px]">
                        <span className="text-[#eee4da] text-xs font-bold uppercase">Best</span>
                        <span className="text-white font-bold text-xl">{bestScore}</span>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-end mb-4">
                <button
                    onClick={initGame}
                    className="px-6 py-2 bg-[#8f7a66] text-white font-bold rounded hover:bg-[#9f8b77] transition-colors"
                >
                    New Game
                </button>
            </div>

            {/* Game Container */}
            <div
                ref={containerRef}
                className="relative bg-[#bbada0] p-4 rounded-lg w-full aspect-square touch-none select-none"
            >
                {/* Background Grid */}
                <div className="grid grid-cols-4 grid-rows-4 gap-4 w-full h-full">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="bg-[#cdc1b4] rounded-lg w-full h-full" />
                    ))}
                </div>

                {/* Floating Tiles */}
                <div className="absolute inset-4">
                    {grid.flatMap(row => row.filter(t => t !== null)).map(tile => (
                        <React.Fragment key={tile!.id}>
                            {/* If merged, render children for animation? 
                         For now simplifed: just render the tile. 
                         If we want perfect animation, we render mergedFrom tiles too.
                     */}
                            {tile!.mergedFrom?.map(sub => renderTile({ ...sub, isNew: false, mergedFrom: undefined }))}
                            {renderTile(tile!)}
                        </React.Fragment>
                    ))}
                </div>

                {/* Overlays */}
                {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-[#eee4da]/70 flex flex-col items-center justify-center rounded-lg z-30 animate-fade-in">
                        <h2 className="text-6xl font-bold text-[#776e65] mb-4">
                            {gameState === 'won' ? 'You Win!' : 'Game Over'}
                        </h2>
                        <button
                            onClick={initGame}
                            className="px-6 py-3 bg-[#8f7a66] text-white font-bold rounded text-xl shadow-lg hover:scale-105 transition-transform"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes appear {
            0% { 
                opacity: 0;
                transform: translate(var(--tx), var(--ty)) scale(0);
            }
            100% { 
                opacity: 1;
                transform: translate(var(--tx), var(--ty)) scale(1);
            }
        }
        .animate-appear {
            animation: tile-appear 150ms ease-out backwards;
        }
        @keyframes tile-appear {
            0% { 
                opacity: 0;
                transform: scale(0);
            }
            100% { 
                opacity: 1;
                transform: scale(1);
            }
        }
        @keyframes merge {
            0% { transform: scale(1); }
            50% { transform: scale(1.25); }
            100% { transform: scale(1); }
        }
        .animate-merge {
            animation: tile-merge 200ms ease-out;
        }
        @keyframes tile-merge {
            0% { transform: scale(1); }
            40% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 800ms ease-in-out forwards;
        }
      `}</style>
        </div>
    );
};

export default Game2048;

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Tetromino shapes (I, O, T, S, Z, J, L)
export const TETROMINOES = {
    I: {
        shape: [[1, 1, 1, 1]],
        color: 'bg-cyan-400',
    },
    O: {
        shape: [
            [1, 1],
            [1, 1],
        ],
        color: 'bg-yellow-400',
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
        ],
        color: 'bg-purple-500',
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
        ],
        color: 'bg-green-500',
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
        ],
        color: 'bg-red-500',
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
        ],
        color: 'bg-blue-600',
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
        ],
        color: 'bg-orange-500',
    },
};

export type TetrominoType = keyof typeof TETROMINOES;


import { Game, GameCategory } from './types';

export const CATEGORIES = [
  { id: 'all', name: GameCategory.ALL, icon: 'grid_view' },
  { id: 'puzzle', name: GameCategory.PUZZLE, icon: 'extension' },
  { id: 'arcade', name: GameCategory.ARCADE, icon: 'joystick' },
  { id: 'action', name: GameCategory.ACTION, icon: 'bolt' },
  { id: 'sports', name: GameCategory.SPORTS, icon: 'sports_score' },
];

export const GAMES: Game[] = [
  {
    id: '2048',
    title: '2048 Classic',
    description: 'Join the numbers and reach the 2048 tile! The ultimate math-based puzzle game that keeps your brain sharp.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlGl0Ri2e18PeltpnX0vPjVoY0ej-E-mJ9LpA7amIez7ilJAuk6g_uxATp2GsThg2KGXWehFz4icaGDZPjv3DcvDNYuNAgFISofRFdV05jo6lkhtyB4PWKvtYvlywtynthTwCV7MxoyVMKoGJbT0n4yg4yJ7XbNTYAObEHNcDqcyAqv963rMzdzrEB9cyeG8qoK1X0tBk-bg6NhruUyI4MIeSiMu-pMYNJJKWPpdyjtGBFiqDwGO4Sj3jNFKQI3WXaW4FUFDjc-zwO',
    category: GameCategory.PUZZLE,
    rating: 4.9,
    players: '1.2M',
    isEditorChoice: true
  },
  {
    id: 'tetris-retro',
    title: 'Tetris Retro',
    description: 'Clear lines and stack blocks in this classic arcade hit.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwAGnfjKmgpwyj4myLEIFruYWrJmAxNXGp4ztiJgua3RKYXNZqixImWh9yud8_wGY1m3qSs--qiaGA9-xaqC5wC3IFhWmsDArLtF_ZH02XiQd469LOhAl3f3jB1VT4NtYG_EU4tKQJamfXkZVfVHdiTa98pLJ2h9tn8cu-fAR__hFWw0tisBlUzUu4MmQIg_4hz7l4y0gpp6I_Ppn-2TBHkN6Xd_Dbwfouu9N_r-XeFyznTuVfR9LbrkjiU0ryild0h4qwvxanWAVT',
    category: GameCategory.PUZZLE,
    rating: 4.8
  },
  {
    id: 'snake-neon',
    title: 'Snake Neon',
    description: 'A fast-paced neon spin on the original Nokia classic.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxOslPYnrYteRSzAm8Afbm62Vvxiacoqs4c7cEt5lThpScagLf_aN2hj-RPrnBiaGz_Ss22DNzxZyTqtbTF64OWSwJfZxyj-FlApv4z_cjlLuZUPF2xgC3Hb-n0M_9eSiLxay_vgY2DFsJTOFBDWGuMqUDMJPURWPL5z7Oh5rjSTv4WqxDSBPrYJfy1bHjABMu-0FOs1ExqVnbLUXThskIUNG77pO1K128uW8NBnLXdxSLBpjOVLMHig_moe99sCGaC2xqKCGzQ18L',
    category: GameCategory.ARCADE,
    rating: 4.5,
    isNew: true
  },
  {
    id: 'master-sudoku',
    title: 'Master Sudoku',
    description: 'Daily challenges to test your logic and number skills.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2DXSk5F4RTCPklGxmKDfjVlUmpdw7PNTeQh8UnTJpXFzvNtWNbzTeeCdEKTAWkLPSGo3a3c_o5VHqdJ6IjPi5eFFWWfAh8Lf6VSk9l1OBsI3cetEHUyL97VvIwQ82AKBnuiFijEg1VvsSJhOiSnxpQ3CkyhGTqVVq-p_UiCWNy7ucopyExD8CPY6mg0wW7sNIFFZ3CcnP1Cnuezr0bA6C7qI6joVDkUoGOscfT8-q4xcUuv17kubTghn8yWPh6ddIOrruBeXkqhQd',
    category: GameCategory.PUZZLE,
    rating: 4.2
  },
  {
    id: 'space-raider',
    title: 'Space Raider',
    description: 'Protect your galaxy from waves of pixel invaders.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDACn7UL_gb7GZZcBAzJvBrNZ59c3rz9SnnW2TnhD7GqPBiQ-fiO8CSjPELg2PHIBj7GBa_-O1_zlk-_x6E6I_DB5yomxNs_JB_xgNvWiLDO2-Dtv4Sdx-47ZuLdjAk5FteYjgJqV72EMoHLwITn_P5N1CilhHDEik8kquwCk5ptqkE7yncZmJPASYWE7LZ3-N8tPdwPJbPRKnojZCDiafBuzpgFQLwnHZ4n2erpc_GrTYzaj9dAejzCIAcOflJLqYcGvO-qwgYE8W9',
    category: GameCategory.ACTION,
    rating: 4.7
  }
];

export const TILE_COLORS: Record<number, string> = {
  2: 'bg-[#cdc1b4] text-[#776e65]',
  4: 'bg-[#eee4da] text-[#776e65]',
  8: 'bg-[#ede0c8] text-[#f9f6f2]',
  16: 'bg-[#f2b179] text-[#f9f6f2]',
  32: 'bg-[#f59563] text-[#f9f6f2]',
  64: 'bg-[#f67c5f] text-[#f9f6f2]',
  128: 'bg-[#edcf72] text-[#f9f6f2]',
  256: 'bg-[#edcc61] text-[#f9f6f2]',
  512: 'bg-[#edc850] text-[#f9f6f2]',
  1024: 'bg-[#edc53f] text-[#f9f6f2]',
  2048: 'bg-[#edc22e] text-[#f9f6f2]',
};

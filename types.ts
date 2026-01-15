
export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  players?: string;
  isNew?: boolean;
  isEditorChoice?: boolean;
}

export enum GameCategory {
  ALL = 'All Games',
  PUZZLE = 'Puzzle',
  ARCADE = 'Arcade',
  ACTION = 'Action',
  SPORTS = 'Sports'
}

export interface Tile {
  id: number;
  value: number;
  x: number;
  y: number;
  mergedFrom?: Tile[];
}

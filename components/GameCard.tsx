
import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link to={`/game/${game.id}`} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden card-shadow border border-white dark:border-gray-700 hover:-translate-y-2 transition-all duration-300">
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          src={game.image} 
          alt={game.title} 
        />
        {game.category && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-white text-[10px] font-bold uppercase tracking-widest">
            {game.category}
          </div>
        )}
        {game.isNew && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-accent-yellow text-black text-[10px] font-black rounded uppercase">
            New
          </span>
        )}
      </div>
      <div className="p-5">
        <h4 className="text-lg font-bold mb-1 dark:text-white">{game.title}</h4>
        <p className="text-gray-400 text-sm mb-4 line-clamp-1">{game.description}</p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-lg">star</span>
            <span className="text-sm font-bold">{game.rating}</span>
          </div>
          <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
            Play
          </button>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;

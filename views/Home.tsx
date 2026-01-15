
import React from 'react';
import { Link } from 'react-router-dom';
import { GAMES, CATEGORIES } from '../constants';
import { GameCategory } from '../types';
import GameCard from '../components/GameCard';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState<GameCategory>(GameCategory.ALL);
  
  const filteredGames = GAMES.filter(game => 
    activeCategory === GameCategory.ALL || game.category === activeCategory
  );

  const featuredGame = GAMES.find(g => g.isEditorChoice) || GAMES[0];

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      {/* Categories */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.name as GameCategory)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap border ${
              activeCategory === cat.name 
              ? 'bg-primary text-white shadow-lg shadow-primary/20 border-primary' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-100 dark:border-gray-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Featured Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 dark:text-white">
            <span className="material-symbols-outlined text-primary">auto_awesome</span> 
            Featured This Week
          </h2>
        </div>
        <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 featured-card-shadow border border-white dark:border-gray-700">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-3/5 relative overflow-hidden aspect-video lg:aspect-auto">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={featuredGame.image} 
                alt={featuredGame.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-gray-800 via-transparent to-transparent hidden lg:block"></div>
            </div>
            <div className="w-full lg:w-2/5 p-8 flex flex-col justify-center gap-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-accent-yellow text-[#111817] text-xs font-bold mb-4 uppercase tracking-wider">Editor's Choice</span>
                <h3 className="text-4xl font-bold mb-3 tracking-tight dark:text-white">{featuredGame.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">{featuredGame.description}</p>
              </div>
              <div className="flex items-center gap-6">
                <Link to={`/game/${featuredGame.id}`} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">play_arrow</span> Play Now
                </Link>
                <button className="size-14 border-2 border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">groups</span> {featuredGame.players} Players
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-accent-yellow">star</span> {featuredGame.rating} Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">Trending Games</h2>
          <button className="text-primary font-semibold flex items-center gap-1 hover:underline">
            View All <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredGames.slice(1).map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-6">
          <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">groups</span>
          </div>
          <div>
            <div className="text-3xl font-black dark:text-white">2.4M</div>
            <div className="text-gray-500 text-sm uppercase tracking-widest font-bold">Monthly Players</div>
          </div>
        </div>
        <div className="p-8 rounded-3xl bg-accent-yellow/5 border border-accent-yellow/10 flex items-center gap-6">
          <div className="size-14 bg-accent-yellow text-black rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">emoji_events</span>
          </div>
          <div>
            <div className="text-3xl font-black dark:text-white">150+</div>
            <div className="text-gray-500 text-sm uppercase tracking-widest font-bold">Casual Games</div>
          </div>
        </div>
        <div className="p-8 rounded-3xl bg-gray-500/5 border border-gray-500/10 flex items-center gap-6">
          <div className="size-14 bg-gray-800 text-white rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">timer</span>
          </div>
          <div>
            <div className="text-3xl font-black dark:text-white">24/7</div>
            <div className="text-gray-500 text-sm uppercase tracking-widest font-bold">Live Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

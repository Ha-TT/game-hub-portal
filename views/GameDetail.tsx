
import { useParams, Link } from 'react-router-dom';
import { GAMES } from '../constants';
import Game2048 from '../games/2048/Game2048';
import GameTetris from '../games/tetris/GameTetris';

const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const game = GAMES.find(g => g.id === id) || GAMES[0];

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-[#1e3632] px-4 py-2 rounded-xl shadow-sm hover:bg-primary/10 transition-colors dark:text-white">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Back to Portal</span>
        </Link>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-[#1e3632] px-4 py-2 rounded-xl shadow-sm hover:bg-primary/10 transition-colors dark:text-white">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
          <button className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-[#1e3632] px-4 py-2 rounded-xl shadow-sm hover:bg-primary/10 transition-colors dark:text-white">
            <span className="material-symbols-outlined text-[20px]">report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Gameplay Area */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[#111817] dark:text-white tracking-tight text-[36px] font-bold leading-tight">{game.title}</h1>
              <p className="text-[#638882] dark:text-gray-400 font-medium">{game.description}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center justify-center bg-white dark:bg-[#1e3632] p-3 rounded-xl shadow-sm dark:text-white">
                <span className="material-symbols-outlined">fullscreen</span>
              </button>
            </div>
          </div>

          {/* Game Board Container */}
          <div className="relative w-full max-w-[700px] mx-auto bg-white dark:bg-[#1e3632] rounded-3xl shadow-2xl p-6 border-8 border-white dark:border-[#1e3632]">
            {game.id === '2048' ? (
              <Game2048 />
            ) : game.id === 'tetris-retro' ? (
              <GameTetris />
            ) : (
              <div className="aspect-video w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
                <p className="text-gray-400">Game Placeholder for {game.title}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Removed Score board from Sidebar as it is inside Game2048 now, 
              or we can pull state up later. For now, leaving generic info. */}

          <div className="flex flex-col gap-4 p-6 bg-white dark:bg-[#1e3632] rounded-2xl shadow-sm border border-[#dce5e4] dark:border-[#2a4a44]">
            <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
              <span className="material-symbols-outlined text-primary">lightbulb</span>
              How to Play
            </h3>
            <div className="text-sm leading-relaxed text-[#111817] dark:text-gray-300 flex flex-col gap-3">
              <p>Use your <strong>arrow keys</strong> or <strong>swipe</strong> to move the tiles across the grid.</p>
              <p>When two tiles with the same number touch, they <strong>merge into one</strong>!</p>
              <div className="flex items-center gap-2 bg-primary/10 p-3 rounded-lg border border-primary/20">
                <span className="material-symbols-outlined text-primary">info</span>
                <span className="font-medium text-xs">Reach the 2048 tile to win the game!</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold px-1 dark:text-white">Related Games</h3>
            <div className="flex flex-col gap-3">
              {GAMES.filter(g => g.id !== id).slice(0, 3).map(relatedGame => (
                <Link to={`/game/${relatedGame.id}`} key={relatedGame.id} className="group flex items-center gap-4 p-3 bg-white dark:bg-[#1e3632] rounded-2xl shadow-sm border border-[#dce5e4] dark:border-[#2a4a44] cursor-pointer hover:border-primary transition-all hover:translate-x-1">
                  <img src={relatedGame.image} className="size-16 rounded-lg object-cover shrink-0 border border-[#dce5e4] dark:border-[#2a4a44]" alt={relatedGame.title} />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-[#111817] dark:text-white truncate">{relatedGame.title}</p>
                    <p className="text-xs text-[#638882] truncate">{relatedGame.category}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px] text-accent-yellow fill-1">star</span>
                      <span className="text-[10px] font-bold dark:text-white">{relatedGame.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`size-6 rounded-full border-2 border-white dark:border-[#1e3632] bg-gray-${300 + i * 100}`}></div>
                ))}
              </div>
              <p className="text-xs font-bold dark:text-white">128 others playing</p>
            </div>
            <span className="material-symbols-outlined text-primary">chat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
